import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal, Form, Badge, Table } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';
import { 
  FaUserMd, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch,
  FaPhone,
  FaEnvelope,
  FaStethoscope,
  FaBuilding,
  FaEye
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminDoctors = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    phone: '',
    licenseNumber: '',
    department: '',
    experience: '',
    consultationFee: '',
    bio: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = {
        specialization: filterSpecialization || undefined,
        isActive: filterStatus === 'active' ? true : filterStatus === 'inactive' ? false : undefined
      };
      const response = await adminAPI.getDoctors(params);
      setDoctors(response.data.data.doctors || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to load doctors');
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await adminAPI.getDepartments();
      setDepartments(response.data.data.departments || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [filterSpecialization, filterStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.specialization) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    
    try {
      if (editingDoctor) {
        const response = await adminAPI.updateDoctor(editingDoctor._id, formData);
        if (response.data.success) {
          toast.success('Doctor updated successfully');
        }
      } else {
        const response = await adminAPI.createDoctor(formData);
        if (response.data.success) {
          toast.success('Doctor created successfully');
        }
      }
      
      setShowModal(false);
      setEditingDoctor(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        specialization: '',
        phone: '',
        licenseNumber: '',
        department: '',
        experience: '',
        consultationFee: '',
        bio: ''
      });
      fetchDoctors();
    } catch (error) {
      console.error('Error saving doctor:', error);
      toast.error('Failed to save doctor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name || '',
      email: doctor.email || '',
      password: '',
      specialization: doctor.specialization || '',
      phone: doctor.phone || '',
      licenseNumber: doctor.licenseNumber || '',
      department: doctor.department?._id || '',
      experience: doctor.experience || '',
      consultationFee: doctor.consultationFee || '',
      bio: doctor.bio || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await adminAPI.deleteDoctor(doctorId);
        toast.success('Doctor deleted successfully');
        fetchDoctors();
      } catch (error) {
        console.error('Error deleting doctor:', error);
        toast.error('Failed to delete doctor');
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingDoctor(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      specialization: '',
      phone: '',
      licenseNumber: '',
      department: '',
      experience: '',
      consultationFee: '',
      bio: ''
    });
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const specializations = [
    'General Physician',
    'Cardiologist',
    'Neurologist',
    'Dermatologist',
    'Orthopedist',
    'Pediatrician',
    'Gynecologist',
    'Psychiatrist',
    'Radiologist',
    'Anesthesiologist',
    'Emergency Medicine',
    'Internal Medicine',
    'Surgery',
    'Ophthalmology',
    'ENT'
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="spinner-custom" />
          <p className="mt-3 text-muted">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <h4>Error Loading Doctors</h4>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchDoctors}>
            Try Again
          </Button>
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
                <FaUserMd className="me-2" />
                Manage Doctors
              </h2>
              <p className="text-muted mb-0">Add, edit, and manage doctor profiles</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
              className="btn-primary-custom"
            >
              <FaPlus className="me-2" />
              Add Doctor
            </Button>
          </div>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col>
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <h5 className="mb-0">Filters & Search</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Row>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="form-label-custom">Search</Form.Label>
                    <div className="position-relative">
                      <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      <Form.Control
                        type="text"
                        placeholder="Search doctors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control-custom ps-5"
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="form-label-custom">Specialization</Form.Label>
                    <Form.Select
                      value={filterSpecialization}
                      onChange={(e) => setFilterSpecialization(e.target.value)}
                      className="form-control-custom"
                    >
                      <option value="">All Specializations</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="form-label-custom">Status</Form.Label>
                    <Form.Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="form-control-custom"
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => {
                      setSearchTerm('');
                      setFilterSpecialization('');
                      setFilterStatus('');
                    }}
                    className="w-100"
                  >
                    Clear
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Doctors Table */}
      <Row>
        <Col>
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <h4 className="mb-0">Doctors List ({filteredDoctors.length})</h4>
            </Card.Header>
            <Card.Body className="p-0">
              {filteredDoctors.length > 0 ? (
                <div className="table-responsive">
                  <Table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Doctor</th>
                        <th>Specialization</th>
                        <th>Department</th>
                        <th>Experience</th>
                        <th>Fee</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDoctors.map((doctor, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                                <FaUserMd />
                              </div>
                              <div>
                                <div className="fw-bold">{doctor.name}</div>
                                <div className="text-muted small">
                                  <FaEnvelope className="me-1" />
                                  {doctor.email}
                                </div>
                                <div className="text-muted small">
                                  <FaPhone className="me-1" />
                                  {doctor.phone}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge bg="info">{doctor.specialization}</Badge>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <FaBuilding className="me-2 text-muted" />
                              {doctor.department?.name || 'N/A'}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <FaStethoscope className="me-2 text-muted" />
                              {doctor.experience} years
                            </div>
                          </td>
                          <td>
                            <strong>${doctor.consultationFee}</strong>
                          </td>
                          <td>
                            <Badge bg={doctor.isActive ? 'success' : 'danger'}>
                              {doctor.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => handleEdit(doctor)}
                              >
                                <FaEdit />
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleDelete(doctor._id)}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <FaUserMd size={64} className="text-muted mb-3" />
                  <h4 className="text-muted mb-3">No Doctors Found</h4>
                  <p className="text-muted">
                    {searchTerm || filterSpecialization || filterStatus 
                      ? 'No doctors match your current filters.' 
                      : 'No doctors have been added yet.'
                    }
                  </p>
                  <Button 
                    variant="primary" 
                    onClick={() => setShowModal(true)}
                    className="btn-primary-custom"
                  >
                    <FaPlus className="me-2" />
                    Add First Doctor
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Doctor Modal */}
      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton className="card-header-custom">
          <Modal.Title>
            <FaUserMd className="me-2" />
            {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="Enter doctor's full name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Email Address *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="Enter email address"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">
                    Password {!editingDoctor && '*'}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder={editingDoctor ? "Leave blank to keep current" : "Enter password"}
                    required={!editingDoctor}
                  />
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
                    className="form-control-custom"
                    placeholder="Enter phone number"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Specialization *</Form.Label>
                  <Form.Select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    required
                  >
                    <option value="">Select Specialization</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">License Number *</Form.Label>
                  <Form.Control
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="Enter license number"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Department *</Form.Label>
                  <Form.Select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Experience (Years) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="Enter years of experience"
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Consultation Fee *</Form.Label>
                  <Form.Control
                    type="number"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="Enter consultation fee"
                    min="0"
                    step="0.01"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="form-control-custom"
                placeholder="Enter doctor's bio"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              className="btn-primary-custom"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {editingDoctor ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <FaUserMd className="me-2" />
                  {editingDoctor ? 'Update Doctor' : 'Create Doctor'}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminDoctors;
