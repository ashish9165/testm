import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { patientAPI } from '../../services/api';
import { 
  FaFileMedicalAlt, 
  FaUserMd, 
  FaCalendarAlt, 
  FaStethoscope,
  FaPills,
  FaNotesMedical
} from 'react-icons/fa';

const PatientMedicalHistory = () => {
  const { user } = useAuth();
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  const fetchMedicalHistory = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getMedicalHistory();
      setMedicalHistory(response.data.data.medicalHistory || []);
    } catch (error) {
      console.error('Error fetching medical history:', error);
      setError('Failed to load medical history');
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="spinner-custom" />
          <p className="mt-3 text-muted">Loading medical history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <h4>Error Loading Medical History</h4>
          <p>{error}</p>
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
            <FaFileMedicalAlt className="me-2" />
            Medical History
          </h2>
          <p className="text-muted mb-0">Your complete medical record and treatment history</p>
        </Col>
      </Row>

      {/* Medical History List */}
      <Row>
        <Col>
          {medicalHistory.length > 0 ? (
            <div className="timeline">
              {medicalHistory.map((record, index) => (
                <Card key={index} className="card-custom border-0 shadow mb-4">
                  <Card.Header className="card-header-custom">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">
                          <FaCalendarAlt className="me-2" />
                          {formatDate(record.date)}
                        </h5>
                        <small className="opacity-75">
                          <FaUserMd className="me-1" />
                          Dr. {record.doctor?.name || 'Unknown Doctor'}
                        </small>
                      </div>
                      <Badge bg="primary">
                        {record.doctor?.specialization || 'General Medicine'}
                      </Badge>
                    </div>
                  </Card.Header>
                  
                  <Card.Body className="p-4">
                    <Row>
                      {/* Diagnosis */}
                      <Col md={6} className="mb-4">
                        <div className="d-flex align-items-start">
                          <div className="flex-shrink-0 me-3">
                            <div className="bg-danger text-white rounded-circle p-2">
                              <FaStethoscope size={16} />
                            </div>
                          </div>
                          <div>
                            <h6 className="text-danger mb-2">Diagnosis</h6>
                            <p className="text-muted mb-0">
                              {record.diagnosis || 'No diagnosis recorded'}
                            </p>
                          </div>
                        </div>
                      </Col>

                      {/* Treatment Notes */}
                      <Col md={6} className="mb-4">
                        <div className="d-flex align-items-start">
                          <div className="flex-shrink-0 me-3">
                            <div className="bg-info text-white rounded-circle p-2">
                              <FaNotesMedical size={16} />
                            </div>
                          </div>
                          <div>
                            <h6 className="text-info mb-2">Treatment Notes</h6>
                            <p className="text-muted mb-0">
                              {record.treatmentNotes || 'No treatment notes recorded'}
                            </p>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    {/* Prescription */}
                    {record.prescription && record.prescription.length > 0 && (
                      <div className="mt-4">
                        <div className="d-flex align-items-start">
                          <div className="flex-shrink-0 me-3">
                            <div className="bg-success text-white rounded-circle p-2">
                              <FaPills size={16} />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="text-success mb-3">Prescription</h6>
                            <div className="row">
                              {record.prescription.map((med, medIndex) => (
                                <div key={medIndex} className="col-md-6 mb-3">
                                  <div className="bg-light p-3 rounded">
                                    <h6 className="mb-2">{med.medicine}</h6>
                                    <div className="row">
                                      <div className="col-6">
                                        <small className="text-muted">Dosage:</small>
                                        <p className="mb-1">{med.dosage}</p>
                                      </div>
                                      <div className="col-6">
                                        <small className="text-muted">Frequency:</small>
                                        <p className="mb-1">{med.frequency}</p>
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-6">
                                        <small className="text-muted">Duration:</small>
                                        <p className="mb-1">{med.duration}</p>
                                      </div>
                                    </div>
                                    {med.instructions && (
                                      <div>
                                        <small className="text-muted">Instructions:</small>
                                        <p className="mb-0 small">{med.instructions}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Follow-up Information */}
                    {record.followUpDate && (
                      <div className="mt-4 p-3 bg-warning bg-opacity-10 rounded">
                        <h6 className="text-warning mb-2">
                          <FaCalendarAlt className="me-2" />
                          Follow-up Required
                        </h6>
                        <p className="mb-1">
                          <strong>Date:</strong> {formatDate(record.followUpDate)}
                        </p>
                        {record.followUpNotes && (
                          <p className="mb-0">
                            <strong>Notes:</strong> {record.followUpNotes}
                          </p>
                        )}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="card-custom border-0 shadow">
              <Card.Body className="text-center py-5">
                <FaFileMedicalAlt size={64} className="text-muted mb-3" />
                <h4 className="text-muted mb-3">No Medical History Found</h4>
                <p className="text-muted mb-4">
                  Your medical records will appear here after your first visit with a doctor.
                </p>
                <p className="text-muted">
                  Book an appointment to start building your medical history.
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PatientMedicalHistory;
