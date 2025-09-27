import express from 'express';
import { body, validationResult } from 'express-validator';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import { auth, authorize } from '../middleware/auth.js';
import { mapSymptomsToSpecialization, getPriorityLevel, suggestRelatedSymptoms } from '../services/symptomMapping.js';

const router = express.Router();

// @route   POST /api/patient/symptom-login
// @desc    Patient login based on symptoms (triage)
// @access  Public
router.post('/symptom-login', [
  body('name').notEmpty().withMessage('Name is required'),
  body('age').isInt({ min: 0, max: 120 }).withMessage('Age must be between 0 and 120'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Please provide a valid phone number'),
  body('symptoms').isArray({ min: 1 }).withMessage('At least one symptom is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, age, email, phone, symptoms, emergencyContact, address } = req.body;

    // Map symptoms to specializations
    const specializations = mapSymptomsToSpecialization(symptoms);
    const priorityLevel = getPriorityLevel(symptoms);

    if (specializations.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No doctor available for these symptoms. Please contact emergency services.',
        suggestedSymptoms: suggestRelatedSymptoms(symptoms)
      });
    }

    // Find available doctor with matching specialization
    const availableDoctor = await Doctor.findOne({
      specialization: { $in: specializations },
      isAvailable: true,
      isActive: true
    }).sort({ patientsAssigned: 1 }); // Assign to doctor with least patients

    if (!availableDoctor) {
      return res.status(400).json({
        success: false,
        message: 'No doctor available for these symptoms at the moment. Please try again later or contact emergency services.',
        priorityLevel,
        suggestedSpecializations: specializations
      });
    }

    // Check if patient already exists
    let patient = await Patient.findOne({ email });
    
    if (patient) {
      // Update existing patient
      patient.symptoms = symptoms;
      patient.assignedDoctor = availableDoctor._id;
      await patient.save();
    } else {
      // Create new patient
      patient = new Patient({
        name,
        age,
        email,
        phone,
        symptoms,
        assignedDoctor: availableDoctor._id,
        emergencyContact,
        address
      });
      await patient.save();
    }

    // Add patient to doctor's assigned patients
    if (!availableDoctor.patientsAssigned.includes(patient._id)) {
      availableDoctor.patientsAssigned.push(patient._id);
      await availableDoctor.save();
    }

    // Generate token
    const { generateToken } = await import('../middleware/auth.js');
    const token = generateToken(patient._id, 'patient');

    res.status(200).json({
      success: true,
      message: 'Patient logged in successfully',
      token,
      patient: {
        id: patient._id,
        name: patient.name,
        age: patient.age,
        email: patient.email,
        symptoms: patient.symptoms,
        priorityLevel,
        assignedDoctor: {
          id: availableDoctor._id,
          name: availableDoctor.name,
          specialization: availableDoctor.specialization,
          phone: availableDoctor.phone,
          consultationFee: availableDoctor.consultationFee
        }
      }
    });

  } catch (error) {
    console.error('Symptom login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during symptom login'
    });
  }
});

// @route   GET /api/patient/dashboard
// @desc    Get patient dashboard data
// @access  Private (Patient)
router.get('/dashboard', auth, authorize('patient'), async (req, res) => {
  try {
    const patient = await Patient.findById(req.user._id)
      .populate('assignedDoctor', 'name specialization phone consultationFee');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // No appointments for now - simplified version

    res.status(200).json({
      success: true,
      data: {
        patient: {
          id: patient._id,
          name: patient.name,
          age: patient.age,
          email: patient.email,
          symptoms: patient.symptoms,
          assignedDoctor: patient.assignedDoctor,
          medicalHistory: patient.medicalHistory.slice(-5) // Last 5 records
        }
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
});

// Appointment routes removed for simplified version

// @route   GET /api/patient/medical-history
// @desc    Get patient medical history
// @access  Private (Patient)
router.get('/medical-history', auth, authorize('patient'), async (req, res) => {
  try {
    const patient = await Patient.findById(req.user._id)
      .populate('medicalHistory.doctor', 'name specialization');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        medicalHistory: patient.medicalHistory
      }
    });

  } catch (error) {
    console.error('Medical history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching medical history'
    });
  }
});

// @route   PUT /api/patient/profile
// @desc    Update patient profile
// @access  Private (Patient)
router.put('/profile', [
  auth,
  authorize('patient'),
  body('name').optional().isLength({ min: 2, max: 50 }),
  body('age').optional().isInt({ min: 0, max: 120 }),
  body('phone').optional().matches(/^[\+]?[1-9][\d]{0,15}$/),
  body('bloodType').optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const allowedUpdates = ['name', 'age', 'phone', 'emergencyContact', 'address', 'bloodType', 'allergies', 'currentMedications'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const patient = await Patient.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { patient }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

export default router;
