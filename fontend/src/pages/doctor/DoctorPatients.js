import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { doctorAPI } from '../../services/api';
import { 
  FaUserInjured, 
  FaPhone, 
  FaEnvelope, 
  FaStethoscope, 
  FaFileMedicalAlt,
  FaCalendarAlt,
  FaPlus,
  FaSearch
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const DoctorPatients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showMedicalRecordModal, setShowMedicalRecordModal] = useState(false);
  const [medicalRecordData, setMedicalRecordData] = useState({
    diagnosis: '',
    prescription: [],
    treatmentNotes: ''
  });
  const [newPrescription, setNewPrescription] = useState({
    medicine: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.symptoms.some(symptom => 
        symptom.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredPatients(filtered);
  }, [patients, searchTerm]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getPatients();
      setPatients(response.data.data.patients || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Failed to load patients');
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const handleAddMedicalRecord = (patient) => {
    setSelectedPatient(patient);
    setMedicalRecordData({
      diagnosis: '',
      prescription: [],
      treatmentNotes: ''
    });
    setShowMedicalRecordModal(true);
  };

  const addPrescription = () => {
    if (newPrescription.medicine.trim()) {
      setMedicalRecordData(prev => ({
        ...prev,
        prescription: [...prev.prescription, { ...newPrescription }]
      }));
      setNewPrescription({
        medicine: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      });
    }
  };

  const removePrescription = (index) => {
    setMedicalRecordData(prev => ({
      ...prev,
      prescription: prev.prescription.filter((_, i) => i !== index)
    }));
  };

  const handleSaveMedicalRecord = async () => {
    try {
      if (!medicalRecordData.diagnosis.trim()) {
        toast.error('Please enter a diagnosis');
        return;
      }

      await doctorAPI.addMedicalRecord(selectedPatient._id, medicalRecordData);
      toast.success('Medical record added successfully');
      setShowMedicalRecordModal(false);
      fetchPatients(); // Refresh to get updated data
    } catch (error) {
      console.error('Error adding medical record:', error);
      toast.error('Failed to add medical record');
    }
  };

  const getSymptomBadges = (symptoms) => {
    return symptoms.slice(0, 3).map((symptom, index) => (
      <Badge key={index} bg="primary" className="me-1">
        {symptom}
      </Badge>
    ));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="spinner-custom" />
          <p className="mt-3 text-muted">Loading patients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <h4>Error Loading Patients</h4>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchPatients}>
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
                <FaUserInjured className="me-2" />
                My Patients
              </h2>
              <p className="text-muted mb-0">Manage your assigned patients and their medical records</p>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="position-relative">
                <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <Form.Control
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control-custom ps-5"
                  style={{ minWidth: '300px' }}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Patients Grid */}
      <Row>
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient, index) => (
            <Col lg={4} md={6} className="mb-4" key={index}>
              <Card className="card-custom border-0 shadow h-100">
                <Card.Header className="card-header-custom">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{patient.name}</h5>
                    <Badge bg="info">Age: {patient.age}</Badge>
                  </div>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <FaEnvelope className="me-2 text-muted" />
                      <small className="text-muted">{patient.email}</small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <FaPhone className="me-2 text-muted" />
                      <small className="text-muted">{patient.phone}</small>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6 className="text-primary mb-2">
                      <FaStethoscope className="me-2" />
                      Symptoms
                    </h6>
                    <div className="d-flex flex-wrap gap-1">
                      {getSymptomBadges(patient.symptoms)}
                      {patient.symptoms.length > 3 && (
                        <Badge bg="secondary">+{patient.symptoms.length - 3}</Badge>
                      )}
                    </div>
                  </div>

                  {patient.bloodType && (
                    <div className="mb-3">
                      <small className="text-muted">Blood Type: </small>
                      <Badge bg="danger">{patient.bloodType}</Badge>
                    </div>
                  )}

                  {patient.allergies && patient.allergies.length > 0 && (
                    <div className="mb-3">
                      <h6 className="text-warning mb-2">Allergies</h6>
                      <div className="d-flex flex-wrap gap-1">
                        {patient.allergies.slice(0, 2).map((allergy, idx) => (
                          <Badge key={idx} bg="warning" text="dark">
                            {allergy}
                          </Badge>
                        ))}
                        {patient.allergies.length > 2 && (
                          <Badge bg="secondary">+{patient.allergies.length - 2}</Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="d-flex gap-2 mt-3">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleViewPatient(patient)}
                      className="flex-fill"
                    >
                      <FaFileMedicalAlt className="me-1" />
                      View Details
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleAddMedicalRecord(patient)}
                      className="flex-fill"
                    >
                      <FaPlus className="me-1" />
                      Add Record
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
                <FaUserInjured size={64} className="text-muted mb-3" />
                <h4 className="text-muted mb-3">No Patients Found</h4>
                <p className="text-muted">
                  {searchTerm ? 'No patients match your search criteria.' : 'No patients have been assigned to you yet.'}
                </p>
                {searchTerm && (
                  <Button 
                    variant="outline-primary" 
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* Patient Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton className="card-header-custom">
          <Modal.Title>
            <FaUserInjured className="me-2" />
            Patient Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedPatient && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <h5 className="text-primary mb-3">Personal Information</h5>
                  <div className="mb-2">
                    <strong>Name:</strong> {selectedPatient.name}
                  </div>
                  <div className="mb-2">
                    <strong>Age:</strong> {selectedPatient.age}
                  </div>
                  <div className="mb-2">
                    <strong>Email:</strong> {selectedPatient.email}
                  </div>
                  <div className="mb-2">
                    <strong>Phone:</strong> {selectedPatient.phone}
                  </div>
                  {selectedPatient.bloodType && (
                    <div className="mb-2">
                      <strong>Blood Type:</strong> 
                      <Badge bg="danger" className="ms-2">{selectedPatient.bloodType}</Badge>
                    </div>
                  )}
                </Col>
                <Col md={6}>
                  <h5 className="text-primary mb-3">Medical Information</h5>
                  <div className="mb-3">
                    <strong>Symptoms:</strong>
                    <div className="mt-1">
                      {selectedPatient.symptoms.map((symptom, idx) => (
                        <Badge key={idx} bg="primary" className="me-1 mb-1">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                    <div className="mb-3">
                      <strong>Allergies:</strong>
                      <div className="mt-1">
                        {selectedPatient.allergies.map((allergy, idx) => (
                          <Badge key={idx} bg="warning" text="dark" className="me-1 mb-1">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPatient.currentMedications && selectedPatient.currentMedications.length > 0 && (
                    <div className="mb-3">
                      <strong>Current Medications:</strong>
                      <div className="mt-1">
                        {selectedPatient.currentMedications.map((med, idx) => (
                          <Badge key={idx} bg="success" className="me-1 mb-1">
                            {med}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Col>
              </Row>

              {selectedPatient.emergencyContact && (
                <div className="mb-4">
                  <h5 className="text-primary mb-3">Emergency Contact</h5>
                  <div className="row">
                    <div className="col-md-4">
                      <strong>Name:</strong> {selectedPatient.emergencyContact.name}
                    </div>
                    <div className="col-md-4">
                      <strong>Phone:</strong> {selectedPatient.emergencyContact.phone}
                    </div>
                    <div className="col-md-4">
                      <strong>Relationship:</strong> {selectedPatient.emergencyContact.relationship}
                    </div>
                  </div>
                </div>
              )}

              {selectedPatient.address && (
                <div className="mb-4">
                  <h5 className="text-primary mb-3">Address</h5>
                  <div>
                    {selectedPatient.address.street && <div>{selectedPatient.address.street}</div>}
                    {selectedPatient.address.city && selectedPatient.address.state && (
                      <div>{selectedPatient.address.city}, {selectedPatient.address.state}</div>
                    )}
                    {selectedPatient.address.zipCode && (
                      <div>{selectedPatient.address.zipCode}</div>
                    )}
                    {selectedPatient.address.country && (
                      <div>{selectedPatient.address.country}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setShowModal(false);
              handleAddMedicalRecord(selectedPatient);
            }}
          >
            <FaPlus className="me-2" />
            Add Medical Record
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Medical Record Modal */}
      <Modal show={showMedicalRecordModal} onHide={() => setShowMedicalRecordModal(false)} size="lg">
        <Modal.Header closeButton className="card-header-custom">
          <Modal.Title>
            <FaFileMedicalAlt className="me-2" />
            Add Medical Record
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedPatient && (
            <div>
              <div className="mb-4">
                <h6 className="text-primary">Patient: {selectedPatient.name}</h6>
                <small className="text-muted">Age: {selectedPatient.age} | Email: {selectedPatient.email}</small>
              </div>

              <Form.Group className="mb-4">
                <Form.Label className="form-label-custom">Diagnosis *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={medicalRecordData.diagnosis}
                  onChange={(e) => setMedicalRecordData(prev => ({
                    ...prev,
                    diagnosis: e.target.value
                  }))}
                  className="form-control-custom"
                  placeholder="Enter diagnosis"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="form-label-custom">Treatment Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={medicalRecordData.treatmentNotes}
                  onChange={(e) => setMedicalRecordData(prev => ({
                    ...prev,
                    treatmentNotes: e.target.value
                  }))}
                  className="form-control-custom"
                  placeholder="Enter treatment notes"
                />
              </Form.Group>

              <div className="mb-4">
                <h6 className="text-primary mb-3">Prescription</h6>
                
                {medicalRecordData.prescription.map((prescription, index) => (
                  <Card key={index} className="mb-3">
                    <Card.Body className="p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-0">{prescription.medicine}</h6>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => removePrescription(index)}
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <small className="text-muted">Dosage:</small>
                          <div>{prescription.dosage}</div>
                        </div>
                        <div className="col-md-3">
                          <small className="text-muted">Frequency:</small>
                          <div>{prescription.frequency}</div>
                        </div>
                        <div className="col-md-3">
                          <small className="text-muted">Duration:</small>
                          <div>{prescription.duration}</div>
                        </div>
                        <div className="col-md-3">
                          <small className="text-muted">Instructions:</small>
                          <div>{prescription.instructions}</div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}

                <Card className="border-dashed">
                  <Card.Body className="p-3">
                    <h6 className="text-muted mb-3">Add New Prescription</h6>
                    <Row>
                      <Col md={6}>
                        <Form.Control
                          type="text"
                          placeholder="Medicine name"
                          value={newPrescription.medicine}
                          onChange={(e) => setNewPrescription(prev => ({
                            ...prev,
                            medicine: e.target.value
                          }))}
                          className="form-control-custom mb-2"
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Control
                          type="text"
                          placeholder="Dosage"
                          value={newPrescription.dosage}
                          onChange={(e) => setNewPrescription(prev => ({
                            ...prev,
                            dosage: e.target.value
                          }))}
                          className="form-control-custom mb-2"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <Form.Control
                          type="text"
                          placeholder="Frequency"
                          value={newPrescription.frequency}
                          onChange={(e) => setNewPrescription(prev => ({
                            ...prev,
                            frequency: e.target.value
                          }))}
                          className="form-control-custom mb-2"
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Control
                          type="text"
                          placeholder="Duration"
                          value={newPrescription.duration}
                          onChange={(e) => setNewPrescription(prev => ({
                            ...prev,
                            duration: e.target.value
                          }))}
                          className="form-control-custom mb-2"
                        />
                      </Col>
                      <Col md={4}>
                        <Button 
                          variant="outline-primary" 
                          onClick={addPrescription}
                          className="w-100"
                        >
                          Add Medicine
                        </Button>
                      </Col>
                    </Row>
                    <Form.Control
                      type="text"
                      placeholder="Instructions"
                      value={newPrescription.instructions}
                      onChange={(e) => setNewPrescription(prev => ({
                        ...prev,
                        instructions: e.target.value
                      }))}
                      className="form-control-custom mt-2"
                    />
                  </Card.Body>
                </Card>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMedicalRecordModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveMedicalRecord}>
            <FaFileMedicalAlt className="me-2" />
            Save Medical Record
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DoctorPatients;
