import mongoose from 'mongoose';
import Doctor from './models/Doctor.js';
import dotenv from 'dotenv';

// Configure dotenv
dotenv.config({ path: './config.env' });

const doctors = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    phone: '+1234567890',
    password: 'password123',
    specialization: 'General Physician',
    licenseNumber: 'DOC001',
    department: 'General',
    consultationFee: 100,
    experience: 8,
    isAvailable: true,
    isActive: true,
    patientsAssigned: []
  },
  {
    name: 'Dr. Michael Chen',
    email: 'michael.chen@hospital.com',
    phone: '+1234567891',
    password: 'password123',
    specialization: 'Cardiologist',
    licenseNumber: 'DOC002',
    department: 'General',
    consultationFee: 200,
    experience: 12,
    isAvailable: true,
    isActive: true,
    patientsAssigned: []
  },
  {
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@hospital.com',
    phone: '+1234567892',
    password: 'password123',
    specialization: 'Neurologist',
    licenseNumber: 'DOC003',
    department: 'General',
    consultationFee: 250,
    experience: 10,
    isAvailable: true,
    isActive: true,
    patientsAssigned: []
  },
  {
    name: 'Dr. David Kim',
    email: 'david.kim@hospital.com',
    phone: '+1234567893',
    password: 'password123',
    specialization: 'Internal Medicine',
    licenseNumber: 'DOC004',
    department: 'General',
    consultationFee: 150,
    experience: 15,
    isAvailable: true,
    isActive: true,
    patientsAssigned: []
  },
  {
    name: 'Dr. Lisa Wang',
    email: 'lisa.wang@hospital.com',
    phone: '+1234567894',
    password: 'password123',
    specialization: 'Dermatologist',
    licenseNumber: 'DOC005',
    department: 'General',
    consultationFee: 180,
    experience: 7,
    isAvailable: true,
    isActive: true,
    patientsAssigned: []
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing doctors
    await Doctor.deleteMany({});
    console.log('Cleared existing doctors');

    // Insert new doctors
    const insertedDoctors = await Doctor.insertMany(doctors);
    console.log(`Inserted ${insertedDoctors.length} doctors`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
