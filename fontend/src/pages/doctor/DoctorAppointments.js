import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge, Form, Table } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { doctorAPI } from '../../services/api';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaUserInjured,
  FaPhone,
  FaEye,
  FaTimes,
  FaFilter
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const DoctorAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    date: '',
    type: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  useEffect(() => {
    fetchAppointments();
  }, [filters, pagination.current]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: 10,
        ...filters
      };
      
      const response = await doctorAPI.getAppointments(params);
      setAppointments(response.data.data.appointments || []);
      setPagination(response.data.data.pagination || pagination);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments');
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await doctorAPI.updateAppointmentStatus(appointmentId, newStatus);
      toast.success(`Appointment ${newStatus} successfully`);
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      date: '',
      type: ''
    });
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="text-success" />;
      case 'pending':
        return <FaClock className="text-warning" />;
      case 'rejected':
        return <FaExclamationCircle className="text-danger" />;
      case 'completed':
        return <FaCheckCircle className="text-info" />;
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

  const getStatusActions = (appointment) => {
    switch (appointment.status) {
      case 'pending':
        return (
          <div className="d-flex gap-1">
            <Button 
              variant="success" 
              size="sm"
              onClick={() => handleStatusChange(appointment._id, 'approved')}
            >
              <FaCheckCircle className="me-1" />
              Approve
            </Button>
            <Button 
              variant="danger" 
              size="sm"
              onClick={() => handleStatusChange(appointment._id, 'rejected')}
            >
              <FaTimes className="me-1" />
              Reject
            </Button>
          </div>
        );
      case 'approved':
        return (
          <Button 
            variant="info" 
            size="sm"
            onClick={() => handleStatusChange(appointment._id, 'completed')}
          >
            <FaCheckCircle className="me-1" />
            Mark Complete
          </Button>
        );
      default:
        return (
          <Button variant="outline-secondary" size="sm" disabled>
            No Actions
          </Button>
        );
    }
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
          <h2 className="text-primary mb-2">
            <FaCalendarAlt className="me-2" />
            My Appointments
          </h2>
          <p className="text-muted mb-0">Manage your patient appointments and schedules</p>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col>
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <h5 className="mb-0">
                <FaFilter className="me-2" />
                Filters
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="form-label-custom">Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="form-control-custom"
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="form-label-custom">Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={filters.date}
                      onChange={handleFilterChange}
                      className="form-control-custom"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="form-label-custom">Type</Form.Label>
                    <Form.Select
                      name="type"
                      value={filters.type}
                      onChange={handleFilterChange}
                      className="form-control-custom"
                    >
                      <option value="">All Types</option>
                      <option value="consultation">Consultation</option>
                      <option value="follow_up">Follow-up</option>
                      <option value="emergency">Emergency</option>
                      <option value="routine_checkup">Routine Checkup</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3} className="d-flex align-items-end">
                  <Button 
                    variant="outline-secondary" 
                    onClick={clearFilters}
                    className="w-100"
                  >
                    Clear Filters
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Appointments Table */}
      <Row>
        <Col>
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <h4 className="mb-0">Appointments List</h4>
            </Card.Header>
            <Card.Body className="p-0">
              {appointments.length > 0 ? (
                <div className="table-responsive">
                  <Table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Patient</th>
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
                              <small className="text-muted">
                                <FaClock className="me-1" />
                                {appointment.time}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="d-flex align-items-center">
                                <FaUserInjured className="me-2 text-primary" />
                                <div>
                                  <strong>{appointment.patientId?.name || 'N/A'}</strong>
                                  <br />
                                  <small className="text-muted">
                                    Age: {appointment.patientId?.age || 'N/A'}
                                  </small>
                                </div>
                              </div>
                              {appointment.patientId?.phone && (
                                <div className="mt-1">
                                  <small className="text-muted">
                                    <FaPhone className="me-1" />
                                    {appointment.patientId.phone}
                                  </small>
                                </div>
                              )}
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
                            {appointment.notes && (
                              <div className="text-muted small mt-1">
                                <em>"{appointment.notes}"</em>
                              </div>
                            )}
                          </td>
                          <td>
                            <span className={getStatusBadge(appointment.status)}>
                              {getStatusIcon(appointment.status)}
                              <span className="ms-1">{appointment.status}</span>
                            </span>
                          </td>
                          <td>
                            <div className="d-flex flex-column gap-1">
                              {getStatusActions(appointment)}
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                className="mt-1"
                              >
                                <FaEye className="me-1" />
                                View Details
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
                  <FaCalendarAlt size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No appointments found</h5>
                  <p className="text-muted">
                    {Object.values(filters).some(f => f) 
                      ? 'No appointments match your current filters.' 
                      : 'You have no appointments scheduled.'
                    }
                  </p>
                  {Object.values(filters).some(f => f) && (
                    <Button variant="outline-primary" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Row className="mt-4">
          <Col>
            <div className="d-flex justify-content-center">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${pagination.current === 1 ? 'disabled' : ''}`}>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setPagination(prev => ({
                        ...prev,
                        current: prev.current - 1
                      }))}
                      disabled={pagination.current === 1}
                    >
                      Previous
                    </Button>
                  </li>
                  
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${pagination.current === page ? 'active' : ''}`}>
                      <Button
                        variant={pagination.current === page ? 'primary' : 'outline-primary'}
                        size="sm"
                        onClick={() => setPagination(prev => ({
                          ...prev,
                          current: page
                        }))}
                        className="ms-1"
                      >
                        {page}
                      </Button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${pagination.current === pagination.pages ? 'disabled' : ''}`}>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setPagination(prev => ({
                        ...prev,
                        current: prev.current + 1
                      }))}
                      disabled={pagination.current === pagination.pages}
                      className="ms-1"
                    >
                      Next
                    </Button>
                  </li>
                </ul>
              </nav>
            </div>
          </Col>
        </Row>
      )}

      {/* Summary Stats */}
      <Row className="mt-4">
        <Col>
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <h5 className="mb-0">Appointment Summary</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="text-center">
                <Col md={3}>
                  <div className="h4 text-warning mb-1">
                    {appointments.filter(apt => apt.status === 'pending').length}
                  </div>
                  <div className="text-muted">Pending</div>
                </Col>
                <Col md={3}>
                  <div className="h4 text-success mb-1">
                    {appointments.filter(apt => apt.status === 'approved').length}
                  </div>
                  <div className="text-muted">Approved</div>
                </Col>
                <Col md={3}>
                  <div className="h4 text-info mb-1">
                    {appointments.filter(apt => apt.status === 'completed').length}
                  </div>
                  <div className="text-muted">Completed</div>
                </Col>
                <Col md={3}>
                  <div className="h4 text-danger mb-1">
                    {appointments.filter(apt => apt.status === 'rejected').length}
                  </div>
                  <div className="text-muted">Rejected</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorAppointments;
