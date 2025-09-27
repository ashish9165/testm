import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { doctorAPI } from '../../services/api';
import { 
  FaUserInjured, 
  FaCalendarAlt, 
  FaStethoscope, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaPhone,
  FaFileMedicalAlt,
  FaUsers,
  FaChartLine
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const DoctorDashboard = () => {
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
      const response = await doctorAPI.getDashboard();
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

  const handleAppointmentAction = async (appointmentId, action) => {
    try {
      await doctorAPI.updateAppointmentStatus(appointmentId, action);
      toast.success(`Appointment ${action} successfully`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
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

  const { doctor, todaysAppointments, pendingAppointments, recentAppointments, stats } = dashboardData;

  return (
    <Container className="py-4">
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <div className="bg-white rounded-3 p-4 shadow-sm">
            <h2 className="text-primary mb-2">
              Welcome back, Dr. {doctor.name}!
            </h2>
            <p className="text-muted mb-0">
              {doctor.specialization} • {doctor.department?.name || 'General Medicine'}
            </p>
          </div>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="dashboard-card h-100">
            <div className="d-flex align-items-center">
              <div className="dashboard-card-icon primary me-3">
                <FaUsers />
              </div>
              <div>
                <h3 className="mb-0 text-primary">{stats.totalPatients}</h3>
                <p className="text-muted mb-0">Total Patients</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="dashboard-card h-100">
            <div className="d-flex align-items-center">
              <div className="dashboard-card-icon success me-3">
                <FaCalendarAlt />
              </div>
              <div>
                <h3 className="mb-0 text-success">{stats.todaysAppointments}</h3>
                <p className="text-muted mb-0">Today's Appointments</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="dashboard-card h-100">
            <div className="d-flex align-items-center">
              <div className="dashboard-card-icon warning me-3">
                <FaClock />
              </div>
              <div>
                <h3 className="mb-0 text-warning">{stats.pendingAppointments}</h3>
                <p className="text-muted mb-0">Pending Approvals</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="dashboard-card h-100">
            <div className="d-flex align-items-center">
              <div className="dashboard-card-icon info me-3">
                <FaChartLine />
              </div>
              <div>
                <h3 className="mb-0 text-info">${doctor.consultationFee}</h3>
                <p className="text-muted mb-0">Consultation Fee</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Today's Appointments */}
      <Row className="mb-4">
        <Col>
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <h4 className="mb-0">
                <FaCalendarAlt className="me-2" />
                Today's Appointments
              </h4>
            </Card.Header>
            <Card.Body className="p-0">
              {todaysAppointments && todaysAppointments.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Patient</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todaysAppointments.map((appointment, index) => (
                        <tr key={index}>
                          <td>
                            <strong>{appointment.time}</strong>
                          </td>
                          <td>
                            <div>
                              <strong>{appointment.patientId.name}</strong>
                              <br />
                              <small className="text-muted">Age: {appointment.patientId.age}</small>
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
                            <div className="d-flex gap-1">
                              {appointment.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="success" 
                                    size="sm"
                                    onClick={() => handleAppointmentAction(appointment._id, 'approved')}
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleAppointmentAction(appointment._id, 'rejected')}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              <Button variant="outline-primary" size="sm">
                                View
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <FaCalendarAlt size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No appointments today</h5>
                  <p className="text-muted">You have a free day!</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pending Appointments */}
      <Row className="mb-4">
        <Col>
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <h4 className="mb-0">
                <FaClock className="me-2" />
                Pending Appointments
              </h4>
            </Card.Header>
            <Card.Body className="p-0">
              {pendingAppointments && pendingAppointments.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Patient</th>
                        <th>Reason</th>
                        <th>Type</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingAppointments.map((appointment, index) => (
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
                              <strong>{appointment.patientId.name}</strong>
                              <br />
                              <small className="text-muted">Age: {appointment.patientId.age}</small>
                            </div>
                          </td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: '200px' }}>
                              {appointment.reason}
                            </div>
                          </td>
                          <td>
                            <Badge bg="info">{appointment.type}</Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button 
                                variant="success" 
                                size="sm"
                                onClick={() => handleAppointmentAction(appointment._id, 'approved')}
                              >
                                Approve
                              </Button>
                              <Button 
                                variant="danger" 
                                size="sm"
                                onClick={() => handleAppointmentAction(appointment._id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <FaClock size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No pending appointments</h5>
                  <p className="text-muted">All appointments have been processed</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* My Patients */}
      <Row className="mb-4">
        <Col>
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <h4 className="mb-0">
                <FaUserInjured className="me-2" />
                My Patients
              </h4>
            </Card.Header>
            <Card.Body className="p-0">
              {doctor.patientsAssigned && doctor.patientsAssigned.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Age</th>
                        <th>Contact</th>
                        <th>Symptoms</th>
                        <th>Last Visit</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctor.patientsAssigned.slice(0, 10).map((patient, index) => (
                        <tr key={index}>
                          <td>
                            <div>
                              <strong>{patient.name}</strong>
                              <br />
                              <small className="text-muted">{patient.email}</small>
                            </div>
                          </td>
                          <td>{patient.age}</td>
                          <td>
                            <div>
                              <FaPhone className="me-1" />
                              {patient.phone}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {patient.symptoms.slice(0, 2).map((symptom, idx) => (
                                <Badge key={idx} bg="primary" className="small">
                                  {symptom}
                                </Badge>
                              ))}
                              {patient.symptoms.length > 2 && (
                                <Badge bg="secondary" className="small">
                                  +{patient.symptoms.length - 2}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td>
                            <small className="text-muted">N/A</small>
                          </td>
                          <td>
                            <Button variant="outline-primary" size="sm">
                              <FaFileMedicalAlt className="me-1" />
                              View Records
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <FaUserInjured size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No patients assigned</h5>
                  <p className="text-muted">Patients will be assigned to you through the triage system</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row>
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
                    <FaUserInjured size={32} className="mb-2" />
                    <span>View All Patients</span>
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    variant="outline-success" 
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4"
                    style={{ minHeight: '120px' }}
                  >
                    <FaCalendarAlt size={32} className="mb-2" />
                    <span>Manage Appointments</span>
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    variant="outline-info" 
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4"
                    style={{ minHeight: '120px' }}
                  >
                    <FaFileMedicalAlt size={32} className="mb-2" />
                    <span>Add Medical Record</span>
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    variant="outline-warning" 
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4"
                    style={{ minHeight: '120px' }}
                  >
                    <FaStethoscope size={32} className="mb-2" />
                    <span>Update Availability</span>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorDashboard;
