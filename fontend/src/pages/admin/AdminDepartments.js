import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal, Form, Badge } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';
import { 
  FaBuilding, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaUsers,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminDepartments = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: {
      floor: '',
      room: '',
      building: ''
    },
    contactInfo: {
      phone: '',
      email: ''
    },
    capacity: '',
    operatingHours: {
      monday: { start: '09:00', end: '17:00', isOpen: true },
      tuesday: { start: '09:00', end: '17:00', isOpen: true },
      wednesday: { start: '09:00', end: '17:00', isOpen: true },
      thursday: { start: '09:00', end: '17:00', isOpen: true },
      friday: { start: '09:00', end: '17:00', isOpen: true },
      saturday: { start: '09:00', end: '13:00', isOpen: true },
      sunday: { start: '09:00', end: '13:00', isOpen: false }
    }
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDepartments();
      setDepartments(response.data.data.departments || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError('Failed to load departments');
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = e.target.name.split('.');
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

  const handleOperatingHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.location.floor || !formData.location.room) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    
    try {
      if (editingDepartment) {
        const response = await adminAPI.updateDepartment(editingDepartment._id, formData);
        if (response.data.success) {
          toast.success('Department updated successfully');
        }
      } else {
        const response = await adminAPI.createDepartment(formData);
        if (response.data.success) {
          toast.success('Department created successfully');
        }
      }
      
      setShowModal(false);
      setEditingDepartment(null);
      resetForm();
      fetchDepartments();
    } catch (error) {
      console.error('Error saving department:', error);
      toast.error('Failed to save department');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name || '',
      description: department.description || '',
      location: {
        floor: department.location?.floor || '',
        room: department.location?.room || '',
        building: department.location?.building || ''
      },
      contactInfo: {
        phone: department.contactInfo?.phone || '',
        email: department.contactInfo?.email || ''
      },
      capacity: department.capacity || '',
      operatingHours: department.operatingHours || {
        monday: { start: '09:00', end: '17:00', isOpen: true },
        tuesday: { start: '09:00', end: '17:00', isOpen: true },
        wednesday: { start: '09:00', end: '17:00', isOpen: true },
        thursday: { start: '09:00', end: '17:00', isOpen: true },
        friday: { start: '09:00', end: '17:00', isOpen: true },
        saturday: { start: '09:00', end: '13:00', isOpen: true },
        sunday: { start: '09:00', end: '13:00', isOpen: false }
      }
    });
    setShowModal(true);
  };

  const handleDelete = async (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await adminAPI.deleteDepartment(departmentId);
        toast.success('Department deleted successfully');
        fetchDepartments();
      } catch (error) {
        console.error('Error deleting department:', error);
        toast.error('Failed to delete department');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: {
        floor: '',
        room: '',
        building: ''
      },
      contactInfo: {
        phone: '',
        email: ''
      },
      capacity: '',
      operatingHours: {
        monday: { start: '09:00', end: '17:00', isOpen: true },
        tuesday: { start: '09:00', end: '17:00', isOpen: true },
        wednesday: { start: '09:00', end: '17:00', isOpen: true },
        thursday: { start: '09:00', end: '17:00', isOpen: true },
        friday: { start: '09:00', end: '17:00', isOpen: true },
        saturday: { start: '09:00', end: '13:00', isOpen: true },
        sunday: { start: '09:00', end: '13:00', isOpen: false }
      }
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingDepartment(null);
    resetForm();
  };

  const getOperatingHoursDisplay = (operatingHours) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const openDays = days.filter(day => operatingHours[day]?.isOpen);
    
    if (openDays.length === 0) return 'Closed';
    if (openDays.length === 7) return '24/7';
    
    return `${openDays.length} days/week`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="spinner-custom" />
          <p className="mt-3 text-muted">Loading departments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <h4>Error Loading Departments</h4>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchDepartments}>
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
                <FaBuilding className="me-2" />
                Manage Departments
              </h2>
              <p className="text-muted mb-0">Add, edit, and manage hospital departments</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
              className="btn-primary-custom"
            >
              <FaPlus className="me-2" />
              Add Department
            </Button>
          </div>
        </Col>
      </Row>

      {/* Departments Grid */}
      <Row>
        {departments.length > 0 ? (
          departments.map((department, index) => (
            <Col lg={4} md={6} className="mb-4" key={index}>
              <Card className="card-custom border-0 shadow h-100">
                <Card.Header className="card-header-custom">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{department.name}</h5>
                    <Badge bg={department.isActive ? 'success' : 'danger'}>
                      {department.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <p className="text-muted mb-2">{department.description}</p>
                  </div>

                  <div className="mb-3">
                    <h6 className="text-primary mb-2">
                      <FaMapMarkerAlt className="me-2" />
                      Location
                    </h6>
                    <div className="text-muted small">
                      <div>Floor: {department.location?.floor}</div>
                      <div>Room: {department.location?.room}</div>
                      <div>Building: {department.location?.building}</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6 className="text-primary mb-2">
                      <FaPhone className="me-2" />
                      Contact
                    </h6>
                    <div className="text-muted small">
                      <div>
                        <FaPhone className="me-1" />
                        {department.contactInfo?.phone}
                      </div>
                      <div>
                        <FaEnvelope className="me-1" />
                        {department.contactInfo?.email}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6 className="text-primary mb-2">
                      <FaUsers className="me-2" />
                      Capacity
                    </h6>
                    <div className="text-muted small">
                      <div>Capacity: {department.capacity} people</div>
                      <div>Current: {department.currentOccupancy || 0} people</div>
                      <div className="mt-1">
                        <div className="progress" style={{ height: '8px' }}>
                          <div 
                            className="progress-bar" 
                            style={{ 
                              width: `${((department.currentOccupancy || 0) / department.capacity) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6 className="text-primary mb-2">
                      <FaClock className="me-2" />
                      Operating Hours
                    </h6>
                    <div className="text-muted small">
                      {getOperatingHoursDisplay(department.operatingHours)}
                    </div>
                  </div>

                  {department.doctors && department.doctors.length > 0 && (
                    <div className="mb-3">
                      <h6 className="text-primary mb-2">Doctors</h6>
                      <div className="text-muted small">
                        {department.doctors.length} doctor(s) assigned
                      </div>
                    </div>
                  )}

                  <div className="d-flex gap-2 mt-3">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleEdit(department)}
                      className="flex-fill"
                    >
                      <FaEdit className="me-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(department._id)}
                      className="flex-fill"
                    >
                      <FaTrash className="me-1" />
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Card className="card-custom border-0 shadow">
              <Card.Body className="text-center py-5">
                <FaBuilding size={64} className="text-muted mb-3" />
                <h4 className="text-muted mb-3">No Departments Found</h4>
                <p className="text-muted mb-4">No departments have been created yet.</p>
                <Button 
                  variant="primary" 
                  onClick={() => setShowModal(true)}
                  className="btn-primary-custom"
                >
                  <FaPlus className="me-2" />
                  Add First Department
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* Add/Edit Department Modal */}
      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton className="card-header-custom">
          <Modal.Title>
            <FaBuilding className="me-2" />
            {editingDepartment ? 'Edit Department' : 'Add New Department'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Department Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="Enter department name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Capacity *</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="Enter capacity"
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-control-custom"
                placeholder="Enter department description"
                required
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Floor *</Form.Label>
                  <Form.Control
                    type="number"
                    name="location.floor"
                    value={formData.location.floor}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="Floor number"
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Room *</Form.Label>
                  <Form.Control
                    type="text"
                    name="location.room"
                    value={formData.location.room}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="Room number"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Building *</Form.Label>
                  <Form.Control
                    type="text"
                    name="location.building"
                    value={formData.location.building}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="Building name"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Phone *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="contactInfo.phone"
                    value={formData.contactInfo.phone}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="Enter phone number"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="contactInfo.email"
                    value={formData.contactInfo.email}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    placeholder="Enter email address"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="mb-3">
              <h6 className="text-primary mb-3">Operating Hours</h6>
              <Row>
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                  <Col md={6} key={day} className="mb-3">
                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="checkbox"
                        id={`${day}-open`}
                        checked={formData.operatingHours[day]?.isOpen || false}
                        onChange={(e) => handleOperatingHoursChange(day, 'isOpen', e.target.checked)}
                        className="me-2"
                      />
                      <Form.Label htmlFor={`${day}-open`} className="mb-0 me-2 text-capitalize">
                        {day}
                      </Form.Label>
                      {formData.operatingHours[day]?.isOpen && (
                        <div className="d-flex align-items-center">
                          <Form.Control
                            type="time"
                            value={formData.operatingHours[day]?.start || '09:00'}
                            onChange={(e) => handleOperatingHoursChange(day, 'start', e.target.value)}
                            className="form-control-custom me-2"
                            style={{ width: '100px' }}
                          />
                          <span className="me-2">to</span>
                          <Form.Control
                            type="time"
                            value={formData.operatingHours[day]?.end || '17:00'}
                            onChange={(e) => handleOperatingHoursChange(day, 'end', e.target.value)}
                            className="form-control-custom"
                            style={{ width: '100px' }}
                          />
                        </div>
                      )}
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
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
                  {editingDepartment ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <FaBuilding className="me-2" />
                  {editingDepartment ? 'Update Department' : 'Create Department'}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminDepartments;
