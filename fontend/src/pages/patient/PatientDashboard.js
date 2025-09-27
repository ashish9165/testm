import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { patientAPI } from '../../services/api';
import { 
  FaUserMd, 
  FaCalendarAlt, 
  FaFileMedicalAlt, 
  FaUser, 
  FaPhone, 
  FaStethoscope,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="spinner-custom" />
          <p className="mt-3 text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <h4>Error Loading Dashboard</h4>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchDashboardData}>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!dashboardData) {
    return (
      <Container className="mt-5">
        <Alert variant="info">
          <h4>No Data Available</h4>
          <p>Unable to load your dashboard data at this time.</p>
        </Alert>
      </Container>
    );
  }

  const { patient } = dashboardData;

  return (
    <Container className="py-4">
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <div className="bg-white rounded-3 p-4 shadow-sm">
            <h2 className="text-primary mb-2">
              Welcome back, {patient.name}!
            </h2>
            <p className="text-muted mb-0">
              Here's your health dashboard with all the important information you need.
            </p>
          </div>
        </Col>
      </Row>

      {/* Assigned Doctor Card */}
      {patient.assignedDoctor && (
        <Row className="mb-4">
          <Col>
            <Card className="card-custom border-0 shadow">
              <Card.Header className="card-header-custom">
                <h4 className="mb-0">
                  <FaUserMd className="me-2" />
                  Your Assigned Doctor
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                <Row className="align-items-center">
                  <Col md={8}>
                    <h5 className="text-primary mb-2">{patient.assignedDoctor.name}</h5>
                    <p className="text-muted mb-2">
                      <strong>Specialization:</strong> {patient.assignedDoctor.specialization}
                    </p>
                    <p className="text-muted mb-2">
                      <FaPhone className="me-2" />
                      {patient.assignedDoctor.phone}
                    </p>
                    <p className="text-muted mb-0">
                      <strong>Consultation Fee:</strong> ${patient.assignedDoctor.consultationFee}
                    </p>
                  </Col>
                  <Col md={4} className="text-md-end">
                    <div className="d-flex flex-column gap-2">
                      <Button variant="outline-primary" size="sm">
                        <FaPhone className="me-1" />
                        Call Doctor
                      </Button>
                      <Button variant="primary" size="sm">
                        <FaCalendarAlt className="me-1" />
                        Book Appointment
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Current Symptoms */}
      {patient.symptoms && patient.symptoms.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Card className="card-custom border-0 shadow">
              <Card.Header className="card-header-custom">
                <h4 className="mb-0">
                  <FaStethoscope className="me-2" />
                  Current Symptoms
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="d-flex flex-wrap gap-2">
                  {patient.symptoms.map((symptom, index) => (
                    <span key={index} className="badge bg-primary fs-6 px-3 py-2">
                      {symptom}
                    </span>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <h4 className="mb-0">Quick Actions</h4>
            </Card.Header>
            <Card.Body className="p-4">
              <Row>
                <Col md={3} className="mb-3">
                  <Button 
                    variant="outline-primary" 
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4"
                    style={{ minHeight: '120px' }}
                  >
                    <FaCalendarAlt size={32} className="mb-2" />
                    <span>Book Appointment</span>
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    variant="outline-success" 
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4"
                    style={{ minHeight: '120px' }}
                  >
                    <FaFileMedicalAlt size={32} className="mb-2" />
                    <span>View Medical History</span>
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    variant="outline-info" 
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4"
                    style={{ minHeight: '120px' }}
                  >
                    <FaUser size={32} className="mb-2" />
                    <span>Update Profile</span>
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    variant="outline-warning" 
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4"
                    style={{ minHeight: '120px' }}
                  >
                    <FaStethoscope size={32} className="mb-2" />
                    <span>Update Symptoms</span>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Appointments */}
      <Row className="mb-4">
        <Col>
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <h4 className="mb-0">
                <FaCalendarAlt className="me-2" />
                Recent Appointments
              </h4>
            </Card.Header>
            <Card.Body className="p-0">
              {patient.appointments && patient.appointments.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Doctor</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patient.appointments.slice(0, 5).map((appointment, index) => (
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
                              <strong>{appointment.doctorId.name}</strong>
                              <br />
                              <small className="text-muted">{appointment.doctorId.specialization}</small>
                            </div>
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
                  <h5 className="text-muted">No appointments yet</h5>
                  <p className="text-muted">Book your first appointment to get started</p>
                  <Button variant="primary">
                    <FaCalendarAlt className="me-2" />
                    Book Appointment
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Medical History */}
      <Row>
        <Col>
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <h4 className="mb-0">
                <FaFileMedicalAlt className="me-2" />
                Recent Medical History
              </h4>
            </Card.Header>
            <Card.Body className="p-0">
              {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Doctor</th>
                        <th>Diagnosis</th>
                        <th>Treatment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patient.medicalHistory.slice(0, 5).map((record, index) => (
                        <tr key={index}>
                          <td>
                            <strong>{new Date(record.date).toLocaleDateString()}</strong>
                          </td>
                          <td>
                            <div>
                              <strong>{record.doctor?.name || 'N/A'}</strong>
                              <br />
                              <small className="text-muted">{record.doctor?.specialization || ''}</small>
                            </div>
                          </td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: '200px' }}>
                              {record.diagnosis || 'No diagnosis recorded'}
                            </div>
                          </td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: '200px' }}>
                              {record.treatmentNotes || 'No treatment notes'}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <FaFileMedicalAlt size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No medical history yet</h5>
                  <p className="text-muted">Your medical records will appear here after your first visit</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PatientDashboard;
