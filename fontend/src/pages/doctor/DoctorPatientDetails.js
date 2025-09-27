import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { doctorAPI } from '../../services/api';
import { 
  FaUserInjured, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaTint, 
  FaExclamationTriangle,
  FaPills,
  FaFileMedicalAlt,
  FaCalendarAlt,
  FaStethoscope,
  FaArrowLeft,
  FaPlus
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const DoctorPatientDetails = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (patientId) {
      fetchPatientDetails();
    }
  }, [patientId]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getPatient(patientId);
      setPatient(response.data.data.patient);
    } catch (error) {
      console.error('Error fetching patient details:', error);
      setError('Failed to load patient details');
      toast.error('Failed to load patient details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          <p className="mt-3 text-muted">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <h4>Error Loading Patient Details</h4>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => navigate('/doctor/patients')}>
            Back to Patients
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!patient) {
    return (
      <Container className="mt-5">
        <Alert variant="info">
          <h4>Patient Not Found</h4>
          <p>The requested patient could not be found.</p>
          <Button variant="outline-primary" onClick={() => navigate('/doctor/patients')}>
            Back to Patients
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
          <div className="d-flex align-items-center mb-3">
            <Button 
              variant="outline-primary" 
              onClick={() => navigate('/doctor/patients')}
              className="me-3"
            >
              <FaArrowLeft className="me-2" />
              Back to Patients
            </Button>
            <div>
              <h2 className="text-primary mb-0">
                <FaUserInjured className="me-2" />
                {patient.name}
              </h2>
              <p className="text-muted mb-0">Patient Details & Medical Records</p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Patient Overview Card */}
      <Row className="mb-4">
        <Col>
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <h4 className="mb-0">Patient Overview</h4>
            </Card.Header>
            <Card.Body className="p-4">
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="text-primary mb-2">Personal Information</h6>
                    <div className="mb-2">
                      <strong>Name:</strong> {patient.name}
                    </div>
                    <div className="mb-2">
                      <strong>Age:</strong> {patient.age} years old
                    </div>
                    <div className="mb-2">
                      <strong>Email:</strong> 
                      <a href={`mailto:${patient.email}`} className="ms-2 text-decoration-none">
                        <FaEnvelope className="me-1" />
                        {patient.email}
                      </a>
                    </div>
                    <div className="mb-2">
                      <strong>Phone:</strong> 
                      <a href={`tel:${patient.phone}`} className="ms-2 text-decoration-none">
                        <FaPhone className="me-1" />
                        {patient.phone}
                      </a>
                    </div>
                    {patient.bloodType && (
                      <div className="mb-2">
                        <strong>Blood Type:</strong> 
                        <Badge bg="danger" className="ms-2">{patient.bloodType}</Badge>
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="text-primary mb-2">Current Symptoms</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {patient.symptoms.map((symptom, index) => (
                        <Badge key={index} bg="primary">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {patient.allergies && patient.allergies.length > 0 && (
                    <div className="mb-3">
                      <h6 className="text-warning mb-2">Allergies</h6>
                      <div className="d-flex flex-wrap gap-1">
                        {patient.allergies.map((allergy, index) => (
                          <Badge key={index} bg="warning" text="dark">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {patient.currentMedications && patient.currentMedications.length > 0 && (
                    <div className="mb-3">
                      <h6 className="text-success mb-2">Current Medications</h6>
                      <div className="d-flex flex-wrap gap-1">
                        {patient.currentMedications.map((medication, index) => (
                          <Badge key={index} bg="success">
                            {medication}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Col>
              </Row>

              {patient.emergencyContact && (
                <div className="mt-4">
                  <h6 className="text-primary mb-3">Emergency Contact</h6>
                  <Row>
                    <Col md={4}>
                      <div className="mb-2">
                        <strong>Name:</strong> {patient.emergencyContact.name}
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mb-2">
                        <strong>Phone:</strong> 
                        <a href={`tel:${patient.emergencyContact.phone}`} className="ms-2 text-decoration-none">
                          <FaPhone className="me-1" />
                          {patient.emergencyContact.phone}
                        </a>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mb-2">
                        <strong>Relationship:</strong> {patient.emergencyContact.relationship}
                      </div>
                    </Col>
                  </Row>
                </div>
              )}

              {patient.address && (
                <div className="mt-4">
                  <h6 className="text-primary mb-3">
                    <FaMapMarkerAlt className="me-2" />
                    Address
                  </h6>
                  <div>
                    {patient.address.street && <div>{patient.address.street}</div>}
                    {patient.address.city && patient.address.state && (
                      <div>{patient.address.city}, {patient.address.state}</div>
                    )}
                    {patient.address.zipCode && (
                      <div>{patient.address.zipCode}</div>
                    )}
                    {patient.address.country && (
                      <div>{patient.address.country}</div>
                    )}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs for different sections */}
      <Row>
        <Col>
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="border-0"
              >
                <Tab eventKey="overview" title="Overview">
                  <div className="p-4">
                    <Row>
                      <Col md={6}>
                        <h6 className="text-primary mb-3">Appointment History</h6>
                        {patient.appointments && patient.appointments.length > 0 ? (
                          <div className="table-responsive">
                            <table className="table table-sm">
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Time</th>
                                  <th>Type</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {patient.appointments.slice(0, 5).map((appointment, index) => (
                                  <tr key={index}>
                                    <td>{formatDate(appointment.date)}</td>
                                    <td>{appointment.time}</td>
                                    <td>
                                      <Badge bg="info">
                                        {appointment.type.replace('_', ' ')}
                                      </Badge>
                                    </td>
                                    <td>
                                      <span className={getStatusBadge(appointment.status)}>
                                        {appointment.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-muted">No appointments found</p>
                        )}
                      </Col>
                      <Col md={6}>
                        <h6 className="text-primary mb-3">Quick Actions</h6>
                        <div className="d-grid gap-2">
                          <Button variant="primary" size="sm">
                            <FaCalendarAlt className="me-2" />
                            Schedule Appointment
                          </Button>
                          <Button variant="success" size="sm">
                            <FaFileMedicalAlt className="me-2" />
                            Add Medical Record
                          </Button>
                          <Button variant="info" size="sm">
                            <FaStethoscope className="me-2" />
                            Update Symptoms
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Tab>
                
                <Tab eventKey="medical-history" title="Medical History">
                  <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h6 className="text-primary mb-0">Medical Records</h6>
                      <Button variant="primary" size="sm">
                        <FaPlus className="me-2" />
                        Add Record
                      </Button>
                    </div>
                    
                    {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                      <div className="timeline">
                        {patient.medicalHistory.map((record, index) => (
                          <Card key={index} className="mb-3">
                            <Card.Header className="bg-light">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <strong>{formatDate(record.date)}</strong>
                                  <br />
                                  <small className="text-muted">
                                    Dr. {record.doctor?.name || 'Unknown Doctor'}
                                  </small>
                                </div>
                                <Badge bg="primary">
                                  {record.doctor?.specialization || 'General Medicine'}
                                </Badge>
                              </div>
                            </Card.Header>
                            <Card.Body>
                              <Row>
                                <Col md={6}>
                                  <h6 className="text-danger">Diagnosis</h6>
                                  <p className="text-muted">
                                    {record.diagnosis || 'No diagnosis recorded'}
                                  </p>
                                </Col>
                                <Col md={6}>
                                  <h6 className="text-info">Treatment Notes</h6>
                                  <p className="text-muted">
                                    {record.treatmentNotes || 'No treatment notes recorded'}
                                  </p>
                                </Col>
                              </Row>
                              
                              {record.prescription && record.prescription.length > 0 && (
                                <div className="mt-3">
                                  <h6 className="text-success">Prescription</h6>
                                  <div className="row">
                                    {record.prescription.map((med, medIndex) => (
                                      <div key={medIndex} className="col-md-6 mb-2">
                                        <div className="bg-light p-2 rounded">
                                          <strong>{med.medicine}</strong>
                                          <br />
                                          <small className="text-muted">
                                            {med.dosage} - {med.frequency} - {med.duration}
                                          </small>
                                          {med.instructions && (
                                            <div className="mt-1">
                                              <small className="text-muted">
                                                <em>{med.instructions}</em>
                                              </small>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <FaFileMedicalAlt size={48} className="text-muted mb-3" />
                        <h5 className="text-muted">No Medical History</h5>
                        <p className="text-muted">No medical records found for this patient</p>
                      </div>
                    )}
                  </div>
                </Tab>
                
                <Tab eventKey="appointments" title="Appointments">
                  <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h6 className="text-primary mb-0">All Appointments</h6>
                      <Button variant="primary" size="sm">
                        <FaPlus className="me-2" />
                        New Appointment
                      </Button>
                    </div>
                    
                    {patient.appointments && patient.appointments.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Date & Time</th>
                              <th>Type</th>
                              <th>Reason</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {patient.appointments.map((appointment, index) => (
                              <tr key={index}>
                                <td>
                                  <div>
                                    <strong>{formatDate(appointment.date)}</strong>
                                    <br />
                                    <small className="text-muted">{appointment.time}</small>
                                  </div>
                                </td>
                                <td>
                                  <Badge bg="info">
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
                                    {appointment.status}
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
                      <div className="text-center py-4">
                        <FaCalendarAlt size={48} className="text-muted mb-3" />
                        <h5 className="text-muted">No Appointments</h5>
                        <p className="text-muted">No appointments found for this patient</p>
                      </div>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </Card.Header>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorPatientDetails;
