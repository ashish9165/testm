import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { patientAPI } from '../../services/api';
import { FaUserInjured, FaStethoscope, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const PatientLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    symptoms: [],
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    }
  });
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [errors, setErrors] = useState({});

  // Common symptoms for quick selection
  const commonSymptoms = [
    'fever', 'headache', 'cough', 'chest pain', 'shortness of breath',
    'abdominal pain', 'nausea', 'vomiting', 'diarrhea', 'fatigue',
    'dizziness', 'joint pain', 'back pain', 'rash', 'anxiety',
    'insomnia', 'weight loss', 'weight gain', 'muscle weakness',
    'memory problems', 'vision problems', 'hearing problems'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const addSymptom = () => {
    if (currentSymptom.trim() && !formData.symptoms.includes(currentSymptom.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, currentSymptom.trim().toLowerCase()]
      }));
      setCurrentSymptom('');
    }
  };

  const removeSymptom = (symptomToRemove) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter(symptom => symptom !== symptomToRemove)
    }));
  };

  const addCommonSymptom = (symptom) => {
    if (!formData.symptoms.includes(symptom)) {
      setFormData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, symptom]
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age || formData.age < 0 || formData.age > 120) newErrors.age = 'Please enter a valid age';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (formData.symptoms.length === 0) newErrors.symptoms = 'At least one symptom is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(formData, 'patient');
      
      if (result.success) {
        toast.success('Login successful! Finding the best doctor for your symptoms...');
        navigate('/patient/dashboard');
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <Card className="card-custom shadow-lg border-0">
              <Card.Header className="card-header-custom text-center py-4">
                <FaUserInjured size={48} className="mb-3" />
                <h2 className="h3 mb-0">Patient Symptom-Based Login</h2>
                <p className="mb-0 opacity-75">Enter your symptoms to find the right doctor</p>
              </Card.Header>
              
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  {/* Basic Information */}
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="form-label-custom">Full Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`form-control-custom ${errors.name ? 'is-invalid' : ''}`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="form-label-custom">Age *</Form.Label>
                        <Form.Control
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          className={`form-control-custom ${errors.age ? 'is-invalid' : ''}`}
                          placeholder="Enter your age"
                          min="0"
                          max="120"
                        />
                        {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="form-label-custom">Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`form-control-custom ${errors.email ? 'is-invalid' : ''}`}
                          placeholder="Enter your email"
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="form-label-custom">Phone Number *</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`form-control-custom ${errors.phone ? 'is-invalid' : ''}`}
                          placeholder="Enter your phone number"
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Symptoms Section */}
                  <Form.Group className="mb-4">
                    <Form.Label className="form-label-custom">
                      <FaStethoscope className="me-2" />
                      Symptoms * (Select or add your symptoms)
                    </Form.Label>
                    
                    {/* Current Symptoms */}
                    {formData.symptoms.length > 0 && (
                      <div className="mb-3">
                        <div className="d-flex flex-wrap gap-2">
                          {formData.symptoms.map((symptom, index) => (
                            <span key={index} className="badge bg-primary d-flex align-items-center gap-2">
                              {symptom}
                              <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={() => removeSymptom(symptom)}
                                style={{ fontSize: '0.7rem' }}
                              />
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add Symptom Input */}
                    <div className="d-flex gap-2 mb-3">
                      <Form.Control
                        type="text"
                        value={currentSymptom}
                        onChange={(e) => setCurrentSymptom(e.target.value)}
                        placeholder="Enter a symptom"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSymptom())}
                      />
                      <Button type="button" variant="outline-primary" onClick={addSymptom}>
                        Add
                      </Button>
                    </div>

                    {/* Common Symptoms */}
                    <div>
                      <small className="text-muted mb-2 d-block">Common symptoms (click to add):</small>
                      <div className="d-flex flex-wrap gap-1">
                        {commonSymptoms.map((symptom) => (
                          <Button
                            key={symptom}
                            type="button"
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => addCommonSymptom(symptom)}
                            disabled={formData.symptoms.includes(symptom)}
                            className="mb-1"
                          >
                            {symptom}
                          </Button>
                        ))}
                      </div>
                    </div>
                    {errors.symptoms && <div className="text-danger small mt-1">{errors.symptoms}</div>}
                  </Form.Group>

                  {/* Emergency Contact */}
                  <div className="mb-4">
                    <h6 className="text-primary mb-3">Emergency Contact (Optional)</h6>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label className="form-label-custom">Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="emergencyContact.name"
                            value={formData.emergencyContact.name}
                            onChange={handleInputChange}
                            placeholder="Emergency contact name"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label className="form-label-custom">Phone</Form.Label>
                          <Form.Control
                            type="tel"
                            name="emergencyContact.phone"
                            value={formData.emergencyContact.phone}
                            onChange={handleInputChange}
                            placeholder="Emergency contact phone"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label className="form-label-custom">Relationship</Form.Label>
                          <Form.Control
                            type="text"
                            name="emergencyContact.relationship"
                            value={formData.emergencyContact.relationship}
                            onChange={handleInputChange}
                            placeholder="e.g., Spouse, Parent"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Emergency Notice */}
                  <Alert variant="warning" className="d-flex align-items-center">
                    <FaExclamationTriangle className="me-2" />
                    <div>
                      <strong>Emergency Notice:</strong> If you're experiencing severe symptoms like chest pain, 
                      difficulty breathing, or loss of consciousness, please call 911 immediately.
                    </div>
                  </Alert>

                  {/* Submit Button */}
                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="btn-primary-custom"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Finding Doctor...
                        </>
                      ) : (
                        <>
                          <FaStethoscope className="me-2" />
                          Find My Doctor
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PatientLogin;
