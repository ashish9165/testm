import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge, Table, Form } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';
import { 
  FaUserInjured, 
  FaSearch,
  FaPhone,
  FaEnvelope,
  FaStethoscope,
  FaUserMd,
  FaFilter,
  FaEye
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminPatients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSymptoms, setFilterSymptoms] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, [pagination.current, filterSymptoms, filterDoctor]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: 10,
        symptoms: filterSymptoms || undefined,
        assignedDoctor: filterDoctor || undefined
      };
      const response = await adminAPI.getPatients(params);
      setPatients(response.data.data.patients || []);
      setPagination(response.data.data.pagination || pagination);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Failed to load patients');
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await adminAPI.getDoctors();
      setDoctors(response.data.data.doctors || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'symptoms') {
      setFilterSymptoms(value);
    } else if (filterType === 'doctor') {
      setFilterDoctor(value);
    }
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterSymptoms('');
    setFilterDoctor('');
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const getSymptomBadges = (symptoms) => {
    return symptoms.slice(0, 3).map((symptom, index) => (
      <Badge key={index} bg="primary" className="me-1">
        {symptom}
      </Badge>
    ));
  };

  const getStatusBadge = (isActive) => {
    return (
      <Badge bg={isActive ? 'success' : 'danger'}>
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    patient.symptoms.some(symptom => 
      symptom.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
          <h2 className="text-primary mb-2">
            <FaUserInjured className="me-2" />
            Manage Patients
          </h2>
          <p className="text-muted mb-0">View and manage all patient records</p>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col>
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <h5 className="mb-0">
                <FaFilter className="me-2" />
                Filters & Search
              </h5>
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
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="form-control-custom ps-5"
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="form-label-custom">Symptoms</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Filter by symptoms..."
                      value={filterSymptoms}
                      onChange={(e) => handleFilterChange('symptoms', e.target.value)}
                      className="form-control-custom"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="form-label-custom">Assigned Doctor</Form.Label>
                    <Form.Select
                      value={filterDoctor}
                      onChange={(e) => handleFilterChange('doctor', e.target.value)}
                      className="form-control-custom"
                    >
                      <option value="">All Doctors</option>
                      {doctors.map(doctor => (
                        <option key={doctor._id} value={doctor._id}>
                          Dr. {doctor.name} - {doctor.specialization}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button 
                    variant="outline-secondary" 
                    onClick={clearFilters}
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

      {/* Patients Table */}
      <Row>
        <Col>
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <h4 className="mb-0">Patients List ({filteredPatients.length})</h4>
            </Card.Header>
            <Card.Body className="p-0">
              {filteredPatients.length > 0 ? (
                <div className="table-responsive">
                  <Table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Contact</th>
                        <th>Symptoms</th>
                        <th>Assigned Doctor</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((patient, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                                <FaUserInjured />
                              </div>
                              <div>
                                <div className="fw-bold">{patient.name}</div>
                                <div className="text-muted small">Age: {patient.age}</div>
                                {patient.bloodType && (
                                  <div className="text-muted small">
                                    Blood Type: <Badge bg="danger" className="small">{patient.bloodType}</Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="mb-1">
                              <FaEnvelope className="me-2 text-muted" />
                              <small>{patient.email}</small>
                            </div>
                            <div>
                              <FaPhone className="me-2 text-muted" />
                              <small>{patient.phone}</small>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {getSymptomBadges(patient.symptoms)}
                              {patient.symptoms.length > 3 && (
                                <Badge bg="secondary">+{patient.symptoms.length - 3}</Badge>
                              )}
                            </div>
                          </td>
                          <td>
                            {patient.assignedDoctor ? (
                              <div className="d-flex align-items-center">
                                <FaUserMd className="me-2 text-muted" />
                                <div>
                                  <div className="fw-bold">Dr. {patient.assignedDoctor.name}</div>
                                  <div className="text-muted small">{patient.assignedDoctor.specialization}</div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted">Not assigned</span>
                            )}
                          </td>
                          <td>
                            {getStatusBadge(patient.isActive)}
                          </td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                            >
                              <FaEye className="me-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <FaUserInjured size={64} className="text-muted mb-3" />
                  <h4 className="text-muted mb-3">No Patients Found</h4>
                  <p className="text-muted">
                    {searchTerm || filterSymptoms || filterDoctor 
                      ? 'No patients match your current filters.' 
                      : 'No patients have been registered yet.'
                    }
                  </p>
                  {(searchTerm || filterSymptoms || filterDoctor) && (
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
              <h5 className="mb-0">Patient Summary</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="text-center">
                <Col md={3}>
                  <div className="h4 text-primary mb-1">
                    {patients.filter(p => p.isActive).length}
                  </div>
                  <div className="text-muted">Active Patients</div>
                </Col>
                <Col md={3}>
                  <div className="h4 text-success mb-1">
                    {patients.filter(p => p.assignedDoctor).length}
                  </div>
                  <div className="text-muted">Assigned to Doctors</div>
                </Col>
                <Col md={3}>
                  <div className="h4 text-warning mb-1">
                    {patients.filter(p => !p.assignedDoctor).length}
                  </div>
                  <div className="text-muted">Unassigned</div>
                </Col>
                <Col md={3}>
                  <div className="h4 text-info mb-1">
                    {patients.length}
                  </div>
                  <div className="text-muted">Total Patients</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPatients;
