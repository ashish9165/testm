import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { 
  FaUserInjured, 
  FaUserMd, 
  FaCog, 
  FaHeartbeat, 
  FaCalendarAlt, 
  FaChartLine,
  FaShieldAlt,
  FaMobileAlt,
  FaClock
} from 'react-icons/fa';

const Home = () => {
  const features = [
    {
      icon: <FaUserInjured className="text-primary" size={40} />,
      title: 'Patient Portal',
      description: 'Symptom-based triage system for quick doctor assignment and appointment booking.',
      link: '/patient/login',
      color: 'primary'
    },
    {
      icon: <FaUserMd className="text-success" size={40} />,
      title: 'Doctor Dashboard',
      description: 'Comprehensive patient management and appointment scheduling for healthcare providers.',
      link: '/doctor/login',
      color: 'success'
    },
    {
      icon: <FaCog className="text-warning" size={40} />,
      title: 'Admin Panel',
      description: 'Complete system administration with analytics, reports, and user management.',
      link: '/admin/login',
      color: 'warning'
    }
  ];

  const benefits = [
    {
      icon: <FaHeartbeat className="text-danger" size={30} />,
      title: 'Smart Triage System',
      description: 'AI-powered symptom analysis for accurate doctor assignment'
    },
    {
      icon: <FaCalendarAlt className="text-info" size={30} />,
      title: 'Easy Scheduling',
      description: 'Streamlined appointment booking and management'
    },
    {
      icon: <FaChartLine className="text-success" size={30} />,
      title: 'Real-time Analytics',
      description: 'Comprehensive reporting and data visualization'
    },
    {
      icon: <FaShieldAlt className="text-primary" size={30} />,
      title: 'Secure & HIPAA Compliant',
      description: 'Enterprise-grade security for patient data protection'
    },
    {
      icon: <FaMobileAlt className="text-warning" size={30} />,
      title: 'Mobile Responsive',
      description: 'Access your dashboard from any device, anywhere'
    },
    {
      icon: <FaClock className="text-secondary" size={30} />,
      title: '24/7 Availability',
      description: 'Round-the-clock access to medical records and appointments'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-gradient text-white py-5" 
               style={{ background: 'linear-gradient(135deg, #2c5aa0, #4a90e2)' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4">
                Advanced Hospital Management System
              </h1>
              <p className="lead mb-4">
                Streamline healthcare operations with our comprehensive MERN-based solution. 
                Featuring intelligent symptom-based triage, real-time analytics, and seamless 
                patient-doctor communication.
              </p>
              <div className="d-flex gap-3">
                <Button as={Link} to="/patient/login" variant="light" size="lg" className="px-4">
                  <FaUserInjured className="me-2" />
                  Patient Login
                </Button>
                <Button as={Link} to="/doctor/login" variant="outline-light" size="lg" className="px-4">
                  <FaUserMd className="me-2" />
                  Doctor Login
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <div className="text-center">
                <div className="hero-image bg-white rounded-circle p-5 d-inline-block shadow-lg">
                  <FaHeartbeat size={120} className="text-primary" />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2 className="display-5 fw-bold text-primary mb-3">Choose Your Role</h2>
              <p className="lead text-muted">
                Access the system based on your role and responsibilities
              </p>
            </Col>
          </Row>
          
          <Row>
            {features.map((feature, index) => (
              <Col lg={4} md={6} className="mb-4" key={index}>
                <Card className="h-100 card-custom text-center border-0 shadow">
                  <Card.Body className="p-4">
                    <div className="mb-3">
                      {feature.icon}
                    </div>
                    <Card.Title className="h4 mb-3">{feature.title}</Card.Title>
                    <Card.Text className="text-muted mb-4">
                      {feature.description}
                    </Card.Text>
                    <Button 
                      as={Link} 
                      to={feature.link} 
                      variant={`outline-${feature.color}`}
                      className="w-100"
                    >
                      Access Portal
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2 className="display-5 fw-bold text-primary mb-3">Why Choose Our System?</h2>
              <p className="lead text-muted">
                Advanced features designed for modern healthcare management
              </p>
            </Col>
          </Row>
          
          <Row>
            {benefits.map((benefit, index) => (
              <Col lg={4} md={6} className="mb-4" key={index}>
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0 me-3">
                    {benefit.icon}
                  </div>
                  <div>
                    <h5 className="fw-bold mb-2">{benefit.title}</h5>
                    <p className="text-muted mb-0">{benefit.description}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #2c5aa0, #4a90e2)' }}>
        <Container>
          <Row className="text-center text-white">
            <Col md={3} className="mb-4">
              <div className="h2 fw-bold">1000+</div>
              <div className="text-light">Patients Served</div>
            </Col>
            <Col md={3} className="mb-4">
              <div className="h2 fw-bold">50+</div>
              <div className="text-light">Healthcare Providers</div>
            </Col>
            <Col md={3} className="mb-4">
              <div className="h2 fw-bold">10+</div>
              <div className="text-light">Medical Departments</div>
            </Col>
            <Col md={3} className="mb-4">
              <div className="h2 fw-bold">99.9%</div>
              <div className="text-light">System Uptime</div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="display-5 fw-bold text-primary mb-3">
                Ready to Get Started?
              </h2>
              <p className="lead text-muted mb-4">
                Join thousands of healthcare professionals who trust our system 
                for their daily operations.
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <Button as={Link} to="/patient/login" variant="primary" size="lg" className="px-5">
                  <FaUserInjured className="me-2" />
                  Patient Access
                </Button>
                <Button as={Link} to="/doctor/login" variant="outline-primary" size="lg" className="px-5">
                  <FaUserMd className="me-2" />
                  Doctor Access
                </Button>
                <Button as={Link} to="/admin/login" variant="outline-secondary" size="lg" className="px-5">
                  <FaCog className="me-2" />
                  Admin Access
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
