import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal, Form, Badge } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { patientAPI } from '../../services/api';
import { 
  FaCalendarAlt, 
  FaPlus, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaUserMd,
  FaStethoscope
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PatientAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date(),
    time: '',
    reason: '',
    type: 'consultation',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getAppointments();
      setAppointments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments');
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.time || !formData.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    
    try {
      const appointmentData = {
        ...formData,
        date: formData.date.toISOString().split('T')[0]
      };
      
      const response = await patientAPI.requestAppointment(appointmentData);
      
      if (response.data.success) {
        toast.success('Appointment requested successfully');
        setShowModal(false);
        setFormData({
          date: new Date(),
          time: '',
          reason: '',
          type: 'consultation',
          notes: ''
        });
        fetchAppointments();
      } else {
        toast.error(response.data.message || 'Failed to request appointment');
      }
    } catch (error) {
      console.error('Error requesting appointment:', error);
      toast.error('Failed to request appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="text-success" />;
      case 'pending':
        return <FaClock className="text-warning" />;
      case 'rejected':
        return <FaExclamationCircle className="text-danger" />;
      default:
        return <FaClock className="text-secondary" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      approved: 'badge-approved',
      pending: 'badge-pending',
      rejected: 'badge-rejected',
      completed: 'badge-completed'
    };
    return `badge-custom ${statusClasses[status] || 'badge-pending'}`;
  };

  const getTypeBadge = (type) => {
    const typeClasses = {
      consultation: 'bg-primary',
      follow_up: 'bg-info',
      emergency: 'bg-danger',
      routine_checkup: 'bg-success'
    };
    return `badge ${typeClasses[type] || 'bg-secondary'}`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="spinner-custom" />
          <p className="mt-3 text-muted">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <h4>Error Loading Appointments</h4>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchAppointments}>
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
                <FaCalendarAlt className="me-2" />
                My Appointments
              </h2>
              <p className="text-muted mb-0">Manage your medical appointments</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
              className="btn-primary-custom"
            >
              <FaPlus className="me-2" />
              Book Appointment
            </Button>
          </div>
        </Col>
      </Row>

      {/* Appointments List */}
      <Row>
        <Col>
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <h4 className="mb-0">Appointment History</h4>
            </Card.Header>
            <Card.Body className="p-0">
              {appointments.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Doctor</th>
                        <th>Type</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment, index) => (
                        <tr key={index}>
                          <td>
                            <div>
                              <strong>{new Date(appointment.date).toLocaleDateString()}</strong>
                              <br />
                              <small className="text-muted">{appointment.time}</small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <strong>{appointment.doctorId?.name || 'N/A'}</strong>
                              <br />
                              <small className="text-muted">{appointment.doctorId?.specialization || ''}</small>
                            </div>
                          </td>
                          <td>
                            <Badge className={getTypeBadge(appointment.type)}>
                              {appointment.type.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: '200px' }}>
                              {appointment.reason}
                            </div>
                          </td>
                          <td>
                            <span className={getStatusBadge(appointment.status)}>
                              {getStatusIcon(appointment.status)}
                              <span className="ms-1">{appointment.status}</span>
                            </span>
                          </td>
                          <td>
                            <Button variant="outline-primary" size="sm">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <FaCalendarAlt size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No appointments found</h5>
                  <p className="text-muted">Book your first appointment to get started</p>
                  <Button 
                    variant="primary" 
                    onClick={() => setShowModal(true)}
                    className="btn-primary-custom"
                  >
                    <FaPlus className="me-2" />
                    Book Appointment
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Book Appointment Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton className="card-header-custom">
          <Modal.Title>
            <FaCalendarAlt className="me-2" />
            Book New Appointment
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Date *</Form.Label>
                  <DatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    className="form-control form-control-custom"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select date"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Time *</Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Appointment Type *</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="form-control-custom"
                    required
                  >
                    <option value="consultation">Consultation</option>
                    <option value="follow_up">Follow-up</option>
                    <option value="emergency">Emergency</option>
                    <option value="routine_checkup">Routine Checkup</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">Reason for Visit *</Form.Label>
              <Form.Control
                as="textarea"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                className="form-control-custom"
                rows={3}
                placeholder="Please describe the reason for your appointment"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="form-control-custom"
                rows={2}
                placeholder="Any additional information you'd like to share"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
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
                  Booking...
                </>
              ) : (
                <>
                  <FaStethoscope className="me-2" />
                  Book Appointment
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default PatientAppointments;
