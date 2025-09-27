import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';
import { 
  FaUsers, 
  FaUserMd, 
  FaUserInjured, 
  FaCalendarAlt, 
  FaChartLine, 
  FaBuilding,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaFileAlt
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

const AdminDashboard = () => {
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
      const response = await adminAPI.getDashboard();
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
        return <FaExclamationTriangle className="text-danger" />;
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

  // Chart data for symptoms
  const symptomsChartData = {
    labels: dashboardData?.charts?.commonSymptoms?.map(item => item._id) || [],
    datasets: [
      {
        label: 'Number of Cases',
        data: dashboardData?.charts?.commonSymptoms?.map(item => item.count) || [],
        backgroundColor: [
          '#2c5aa0',
          '#4a90e2',
          '#7bb3f0',
          '#28a745',
          '#ffc107',
          '#dc3545',
          '#17a2b8',
          '#6f42c1',
          '#e83e8c',
          '#fd7e14'
        ],
        borderWidth: 1
      }
    ]
  };

  // Chart data for department distribution
  const departmentChartData = {
    labels: dashboardData?.charts?.departmentDistribution?.map(item => item._id) || [],
    datasets: [
      {
        label: 'Patient Count',
        data: dashboardData?.charts?.departmentDistribution?.map(item => item.patientCount) || [],
        backgroundColor: [
          '#2c5aa0',
          '#4a90e2',
          '#7bb3f0',
          '#28a745',
          '#ffc107',
          '#dc3545',
          '#17a2b8',
          '#6f42c1'
        ],
        borderWidth: 1
      }
    ]
  };

  // Chart data for appointment status
  const appointmentStatusData = {
    labels: dashboardData?.charts?.appointmentStatus?.map(item => item._id) || [],
    datasets: [
      {
        label: 'Appointments',
        data: dashboardData?.charts?.appointmentStatus?.map(item => item.count) || [],
        backgroundColor: [
          '#ffc107',
          '#28a745',
          '#dc3545',
          '#17a2b8',
          '#6c757d'
        ],
        borderWidth: 1
      }
    ]
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
          <p className="mt-3 text-muted">Loading admin dashboard...</p>
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
          <p>Unable to load dashboard data at this time.</p>
        </Alert>
      </Container>
    );
  }

  const { overview, charts, recentActivities } = dashboardData;

  return (
    <Container className="py-4">
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <div className="bg-white rounded-3 p-4 shadow-sm">
            <h2 className="text-primary mb-2">
              Welcome back, {user.name}!
            </h2>
            <p className="text-muted mb-0">
              System Administrator • Hospital Management System
            </p>
          </div>
        </Col>
      </Row>

      {/* Overview Stats */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="dashboard-card h-100">
            <div className="d-flex align-items-center">
              <div className="dashboard-card-icon primary me-3">
                <FaUserInjured />
              </div>
              <div>
                <h3 className="mb-0 text-primary">{overview.totalPatients}</h3>
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
                <h3 className="mb-0 text-success">{overview.totalDoctors}</h3>
                <p className="text-muted mb-0">Total Doctors</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="dashboard-card h-100">
            <div className="d-flex align-items-center">
              <div className="dashboard-card-icon warning me-3">
                <FaCalendarAlt />
              </div>
              <div>
                <h3 className="mb-0 text-warning">{overview.todaysAppointments}</h3>
                <p className="text-muted mb-0">Today's Appointments</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="dashboard-card h-100">
            <div className="d-flex align-items-center">
              <div className="dashboard-card-icon info me-3">
                <FaBuilding />
              </div>
              <div>
                <h3 className="mb-0 text-info">{overview.totalDepartments}</h3>
                <p className="text-muted mb-0">Departments</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="mb-4">
        <Col lg={6} className="mb-4">
          <Card className="card-custom border-0 shadow h-100">
            <Card.Header className="card-header-custom">
              <h4 className="mb-0">
                <FaChartLine className="me-2" />
                Most Common Symptoms
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              {charts.commonSymptoms && charts.commonSymptoms.length > 0 ? (
                <Doughnut data={symptomsChartData} options={chartOptions} />
              ) : (
                <div className="text-center py-4">
                  <FaChartLine size={48} className="text-muted mb-3" />
                  <p className="text-muted">No symptom data available</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} className="mb-4">
          <Card className="card-custom border-0 shadow h-100">
            <Card.Header className="card-header-custom">
              <h4 className="mb-0">
                <FaBuilding className="me-2" />
                Patient Distribution by Department
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              {charts.departmentDistribution && charts.departmentDistribution.length > 0 ? (
                <Bar data={departmentChartData} options={chartOptions} />
              ) : (
                <div className="text-center py-4">
                  <FaBuilding size={48} className="text-muted mb-3" />
                  <p className="text-muted">No department data available</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Appointment Status Chart */}
      <Row className="mb-4">
        <Col>
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <h4 className="mb-0">
                <FaCalendarAlt className="me-2" />
                Appointment Status Distribution
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              {charts.appointmentStatus && charts.appointmentStatus.length > 0 ? (
                <div className="row">
                  <div className="col-md-8">
                    <Bar data={appointmentStatusData} options={chartOptions} />
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex flex-column gap-3">
                      {charts.appointmentStatus.map((status, index) => (
                        <div key={index} className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            {getStatusIcon(status._id)}
                            <span className="ms-2 text-capitalize">{status._id}</span>
                          </div>
                          <span className="badge bg-primary">{status.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <FaCalendarAlt size={48} className="text-muted mb-3" />
                  <p className="text-muted">No appointment data available</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Row className="mb-4">
        <Col>
          <Card className="card-custom border-0 shadow">
            <Card.Header className="card-header-custom">
              <h4 className="mb-0">
                <FaFileAlt className="me-2" />
                Recent Activities
              </h4>
            </Card.Header>
            <Card.Body className="p-0">
              {recentActivities && recentActivities.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivities.map((activity, index) => (
                        <tr key={index}>
                          <td>
                            <div>
                              <strong>{new Date(activity.date).toLocaleDateString()}</strong>
                              <br />
                              <small className="text-muted">{activity.time}</small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <strong>{activity.patientId?.name || 'N/A'}</strong>
                            </div>
                          </td>
                          <td>
                            <div>
                              <strong>{activity.doctorId?.name || 'N/A'}</strong>
                              <br />
                              <small className="text-muted">{activity.doctorId?.specialization || ''}</small>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-info text-capitalize">{activity.type}</span>
                          </td>
                          <td>
                            <span className={getStatusBadge(activity.status)}>
                              {getStatusIcon(activity.status)}
                              <span className="ms-1 text-capitalize">{activity.status}</span>
                            </span>
                          </td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: '200px' }}>
                              {activity.reason}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <FaFileAlt size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No recent activities</h5>
                  <p className="text-muted">System activities will appear here</p>
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
                    <FaUserMd size={32} className="mb-2" />
                    <span>Manage Doctors</span>
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    variant="outline-success" 
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4"
                    style={{ minHeight: '120px' }}
                  >
                    <FaUserInjured size={32} className="mb-2" />
                    <span>Manage Patients</span>
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    variant="outline-info" 
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4"
                    style={{ minHeight: '120px' }}
                  >
                    <FaBuilding size={32} className="mb-2" />
                    <span>Manage Departments</span>
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    variant="outline-warning" 
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4"
                    style={{ minHeight: '120px' }}
                  >
                    <FaChartLine size={32} className="mb-2" />
                    <span>Generate Reports</span>
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

export default AdminDashboard;
