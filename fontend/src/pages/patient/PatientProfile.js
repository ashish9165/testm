import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { patientAPI } from '../../services/api';
import { 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaTint, 
  FaExclamationTriangle,
  FaPills,
  FaEdit,
  FaSave,
  FaTimes
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const PatientProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
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
    },
    bloodType: '',
    allergies: [],
    currentMedications: []
  });
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getProfile();
      const profileData = response.data.data.patient;
      setProfile(profileData);
      setFormData({
        name: profileData.name || '',
        age: profileData.age || '',
        phone: profileData.phone || '',
        emergencyContact: {
          name: profileData.emergencyContact?.name || '',
          phone: profileData.emergencyContact?.phone || '',
          relationship: profileData.emergencyContact?.relationship || ''
        },
        address: {
          street: profileData.address?.street || '',
          city: profileData.address?.city || '',
          state: profileData.address?.state || '',
          zipCode: profileData.address?.zipCode || '',
          country: profileData.address?.country || 'USA'
        },
        bloodType: profileData.bloodType || '',
        allergies: profileData.allergies || [],
        currentMedications: profileData.currentMedications || []
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

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
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergyToRemove) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(allergy => allergy !== allergyToRemove)
    }));
  };

  const addMedication = () => {
    if (newMedication.trim() && !formData.currentMedications.includes(newMedication.trim())) {
      setFormData(prev => ({
        ...prev,
        currentMedications: [...prev.currentMedications, newMedication.trim()]
      }));
      setNewMedication('');
    }
  };

  const removeMedication = (medicationToRemove) => {
    setFormData(prev => ({
      ...prev,
      currentMedications: prev.currentMedications.filter(med => med !== medicationToRemove)
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await patientAPI.updateProfile(formData);
      
      if (response.data.success) {
        toast.success('Profile updated successfully');
        setProfile(response.data.data.patient);
        setEditing(false);
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name || '',
      age: profile.age || '',
      phone: profile.phone || '',
      emergencyContact: {
        name: profile.emergencyContact?.name || '',
        phone: profile.emergencyContact?.phone || '',
        relationship: profile.emergencyContact?.relationship || ''
      },
      address: {
        street: profile.address?.street || '',
        city: profile.address?.city || '',
        state: profile.address?.state || '',
        zipCode: profile.address?.zipCode || '',
        country: profile.address?.country || 'USA'
      },
      bloodType: profile.bloodType || '',
      allergies: profile.allergies || [],
      currentMedications: profile.currentMedications || []
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="spinner-custom" />
          <p className="mt-3 text-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <h4>Error Loading Profile</h4>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container className="mt-5">
        <Alert variant="info">
          <h4>No Profile Data</h4>
          <p>Unable to load profile data at this time.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="text-primary mb-2">
                <FaUser className="me-2" />
                My Profile
              </h2>
              <p className="text-muted mb-0">Manage your personal information and medical details</p>
            </div>
            <div>
              {!editing ? (
                <Button 
                  variant="outline-primary" 
                  onClick={() => setEditing(true)}
                  className="btn-outline-primary-custom"
                >
                  <FaEdit className="me-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="d-flex gap-2">
                  <Button 
                    variant="success" 
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary-custom"
                  >
                    {saving ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="me-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handleCancel}
                    className="btn-outline-primary-custom"
                  >
                    <FaTimes className="me-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Personal Information */}
        <Col lg={6} className="mb-4">
          <Card className="card-custom border-0 shadow h-100">
            <Card.Header className="card-header-custom">
              <h4 className="mb-0">Personal Information</h4>
            </Card.Header>
            <Card.Body className="p-4">
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="form-control-custom"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">Age</Form.Label>
                      <Form.Control
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="form-control-custom"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">
                    <FaEnvelope className="me-2" />
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={profile.email}
                    disabled
                    className="form-control-custom bg-light"
                  />
                  <Form.Text className="text-muted">
                    Email cannot be changed. Contact support if needed.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">
                    <FaPhone className="me-2" />
                    Phone Number
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="form-control-custom"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">
                    <FaTint className="me-2" />
                    Blood Type
                  </Form.Label>
                  <Form.Select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="form-control-custom"
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Emergency Contact */}
        <Col lg={6} className="mb-4">
          <Card className="card-custom border-0 shadow h-100">
            <Card.Header className="card-header-custom">
              <h4 className="mb-0">Emergency Contact</h4>
            </Card.Header>
            <Card.Body className="p-4">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Contact Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="emergencyContact.name"
                    value={formData.emergencyContact.name}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="form-control-custom"
                    placeholder="Emergency contact name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Contact Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="emergencyContact.phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="form-control-custom"
                    placeholder="Emergency contact phone"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Relationship</Form.Label>
                  <Form.Control
                    type="text"
                    name="emergencyContact.relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="form-control-custom"
                    placeholder="e.g., Spouse, Parent, Sibling"
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Address Information */}
        <Col lg={6} className="mb-4">
          <Card className="card-custom border-0 shadow h-100">
            <Card.Header className="card-header-custom">
              <h4 className="mb-0">
                <FaMapMarkerAlt className="me-2" />
                Address Information
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Street Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="form-control-custom"
                    placeholder="Street address"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">City</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="form-control-custom"
                        placeholder="City"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">State</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="form-control-custom"
                        placeholder="State"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">ZIP Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="form-control-custom"
                        placeholder="ZIP code"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">Country</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="form-control-custom"
                        placeholder="Country"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Medical Information */}
        <Col lg={6} className="mb-4">
          <Card className="card-custom border-0 shadow h-100">
            <Card.Header className="card-header-custom">
              <h4 className="mb-0">
                <FaExclamationTriangle className="me-2" />
                Allergies
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="mb-3">
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {formData.allergies.map((allergy, index) => (
                    <span key={index} className="badge bg-danger d-flex align-items-center gap-2">
                      {allergy}
                      {editing && (
                        <button
                          type="button"
                          className="btn-close btn-close-white"
                          onClick={() => removeAllergy(allergy)}
                          style={{ fontSize: '0.7rem' }}
                        />
                      )}
                    </span>
                  ))}
                </div>
                
                {editing && (
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      placeholder="Add allergy"
                      className="form-control-custom"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                    />
                    <Button variant="outline-danger" onClick={addAllergy}>
                      Add
                    </Button>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Current Medications */}
        <Col lg={12} className="mb-4">
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <h4 className="mb-0">
                <FaPills className="me-2" />
                Current Medications
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="mb-3">
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {formData.currentMedications.map((medication, index) => (
                    <span key={index} className="badge bg-success d-flex align-items-center gap-2">
                      {medication}
                      {editing && (
                        <button
                          type="button"
                          className="btn-close btn-close-white"
                          onClick={() => removeMedication(medication)}
                          style={{ fontSize: '0.7rem' }}
                        />
                      )}
                    </span>
                  ))}
                </div>
                
                {editing && (
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      value={newMedication}
                      onChange={(e) => setNewMedication(e.target.value)}
                      placeholder="Add medication"
                      className="form-control-custom"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedication())}
                    />
                    <Button variant="outline-success" onClick={addMedication}>
                      Add
                    </Button>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PatientProfile;
