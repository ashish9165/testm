import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form, Badge } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';
import { 
  FaChartLine, 
  FaDownload, 
  FaCalendarAlt,
  FaFileAlt,
  FaFilter,
  FaUsers,
  FaUserMd,
  FaCalendarCheck,
  FaStethoscope
} from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { toast } from 'react-toastify';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'appointments',
    startDate: '',
    endDate: ''
  });
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getReports(filters);
      setReports(response.data.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to load reports');
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      await fetchReports();
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleExportReport = async (format) => {
    try {
      const response = await adminAPI.exportReport(filters.type, format);
      // Create download link
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report_${filters.type}_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  const getChartData = (data, type) => {
    if (!data || data.length === 0) return null;

    const labels = data.map(item => item._id?.date || item._id || 'Unknown');
    const values = data.map(item => item.count || 0);

    const colors = [
      '#2c5aa0',
      '#4a90e2',
      '#7bb3f0',
      '#28a745',
      '#ffc107',
      '#dc3545',
      '#17a2b8',
      '#6f42c1'
    ];

    return {
      labels,
      datasets: [
        {
          label: type === 'appointments' ? 'Appointments' : 
                 type === 'patients' ? 'Patients' : 'Symptoms',
          data: values,
          backgroundColor: colors.slice(0, values.length),
          borderColor: colors.slice(0, values.length),
          borderWidth: 1
        }
      ]
    };
  };

  const getDoughnutData = (data) => {
    if (!data || data.length === 0) return null;

    const labels = data.map(item => item._id || 'Unknown');
    const values = data.map(item => item.count || 0);

    const colors = [
      '#2c5aa0',
      '#4a90e2',
      '#7bb3f0',
      '#28a745',
      '#ffc107',
      '#dc3545',
      '#17a2b8',
      '#6f42c1'
    ];

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors.slice(0, values.length),
          borderColor: colors.slice(0, values.length),
          borderWidth: 1
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Hospital Statistics'
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="spinner-custom" />
          <p className="mt-3 text-muted">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <h4>Error Loading Reports</h4>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchReports}>
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
            <FaChartLine className="me-2" />
            Reports & Analytics
          </h2>
          <p className="text-muted mb-0">Generate and view comprehensive hospital reports</p>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col>
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <h5 className="mb-0">
                <FaFilter className="me-2" />
                Report Filters
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="form-label-custom">Report Type</Form.Label>
                    <Form.Select
                      name="type"
                      value={filters.type}
                      onChange={handleFilterChange}
                      className="form-control-custom"
                    >
                      <option value="appointments">Appointments</option>
                      <option value="patients">Patients</option>
                      <option value="symptoms">Symptoms</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="form-label-custom">Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={filters.startDate}
                      onChange={handleFilterChange}
                      className="form-control-custom"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="form-label-custom">End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={filters.endDate}
                      onChange={handleFilterChange}
                      className="form-control-custom"
                    />
                  </Form.Group>
                </Col>
                <Col md={3} className="d-flex align-items-end">
                  <Button 
                    variant="primary" 
                    onClick={handleGenerateReport}
                    disabled={generating}
                    className="w-100 btn-primary-custom"
                  >
                    {generating ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FaChartLine className="me-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Export Options */}
      <Row className="mb-4">
        <Col>
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <h5 className="mb-0">
                <FaDownload className="me-2" />
                Export Options
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="d-flex gap-3">
                <Button 
                  variant="outline-success" 
                  onClick={() => handleExportReport('csv')}
                  className="btn-outline-primary-custom"
                >
                  <FaFileAlt className="me-2" />
                  Export as CSV
                </Button>
                <Button 
                  variant="outline-danger" 
                  onClick={() => handleExportReport('pdf')}
                  className="btn-outline-primary-custom"
                >
                  <FaFileAlt className="me-2" />
                  Export as PDF
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      {reports && (
        <Row className="mb-4">
          <Col lg={6} className="mb-4">
            <Card className="card-custom border-0 shadow h-100">
              <Card.Header className="card-header-custom">
                <h4 className="mb-0">
                  <FaChartLine className="me-2" />
                  {filters.type === 'appointments' ? 'Appointments Over Time' :
                   filters.type === 'patients' ? 'Patient Registrations' : 'Symptom Distribution'}
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                {reports.reportData && reports.reportData.length > 0 ? (
                  <Bar data={getChartData(reports.reportData, filters.type)} options={chartOptions} />
                ) : (
                  <div className="text-center py-4">
                    <FaChartLine size={48} className="text-muted mb-3" />
                    <p className="text-muted">No data available for the selected period</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} className="mb-4">
            <Card className="card-custom border-0 shadow h-100">
              <Card.Header className="card-header-custom">
                <h4 className="mb-0">
                  <FaStethoscope className="me-2" />
                  {filters.type === 'symptoms' ? 'Symptom Distribution' : 'Status Distribution'}
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                {reports.reportData && reports.reportData.length > 0 ? (
                  <Doughnut data={getDoughnutData(reports.reportData)} options={chartOptions} />
                ) : (
                  <div className="text-center py-4">
                    <FaStethoscope size={48} className="text-muted mb-3" />
                    <p className="text-muted">No data available for the selected period</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="dashboard-card h-100">
            <div className="d-flex align-items-center">
              <div className="dashboard-card-icon primary me-3">
                <FaUsers />
              </div>
              <div>
                <h3 className="mb-0 text-primary">1,234</h3>
                <p className="text-muted mb-0">Total Patients</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="dashboard-card h-100">
            <div className="d-flex align-items-center">
              <div className="dashboard-card-icon success me-3">
                <FaUserMd />
              </div>
              <div>
                <h3 className="mb-0 text-success">45</h3>
                <p className="text-muted mb-0">Active Doctors</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="dashboard-card h-100">
            <div className="d-flex align-items-center">
              <div className="dashboard-card-icon warning me-3">
                <FaCalendarCheck />
              </div>
              <div>
                <h3 className="mb-0 text-warning">89</h3>
                <p className="text-muted mb-0">Today's Appointments</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="dashboard-card h-100">
            <div className="d-flex align-items-center">
              <div className="dashboard-card-icon info me-3">
                <FaStethoscope />
              </div>
              <div>
                <h3 className="mb-0 text-info">12</h3>
                <p className="text-muted mb-0">Departments</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Report Details */}
      {reports && reports.reportData && reports.reportData.length > 0 && (
        <Row>
          <Col>
            <Card className="card-custom border-0 shadow">
              <Card.Header className="card-header-custom">
                <h4 className="mb-0">
                  <FaFileAlt className="me-2" />
                  Report Details
                </h4>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Date/Item</th>
                        <th>Count</th>
                        <th>Percentage</th>
                        <th>Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.reportData.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <strong>{item._id?.date || item._id || 'Unknown'}</strong>
                          </td>
                          <td>
                            <Badge bg="primary">{item.count}</Badge>
                          </td>
                          <td>
                            {((item.count / reports.reportData.reduce((sum, i) => sum + i.count, 0)) * 100).toFixed(1)}%
                          </td>
                          <td>
                            <span className="text-success">
                              <FaChartLine className="me-1" />
                              +5.2%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Quick Stats */}
      <Row className="mt-4">
        <Col>
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <h5 className="mb-0">Quick Statistics</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="text-center">
                <Col md={2}>
                  <div className="h4 text-primary mb-1">98.5%</div>
                  <div className="text-muted">Patient Satisfaction</div>
                </Col>
                <Col md={2}>
                  <div className="h4 text-success mb-1">15 min</div>
                  <div className="text-muted">Avg Wait Time</div>
                </Col>
                <Col md={2}>
                  <div className="h4 text-info mb-1">24/7</div>
                  <div className="text-muted">Emergency Service</div>
                </Col>
                <Col md={2}>
                  <div className="h4 text-warning mb-1">99.9%</div>
                  <div className="text-muted">System Uptime</div>
                </Col>
                <Col md={2}>
                  <div className="h4 text-danger mb-1">5 min</div>
                  <div className="text-muted">Response Time</div>
                </Col>
                <Col md={2}>
                  <div className="h4 text-secondary mb-1">100%</div>
                  <div className="text-muted">HIPAA Compliant</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminReports;
