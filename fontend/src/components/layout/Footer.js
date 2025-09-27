import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaHospital, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h5 className="text-primary mb-3">
              <FaHospital className="me-2" />
              Hospital Management System
            </h5>
            <p className="text-muted">
              A comprehensive healthcare management solution designed to streamline 
              patient care, doctor workflows, and administrative tasks.
            </p>
          </Col>
          
          <Col md={2} className="mb-4">
            <h6 className="text-primary mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-muted text-decoration-none">Home</a></li>
              <li><a href="/patient/login" className="text-muted text-decoration-none">Patient Login</a></li>
              <li><a href="/doctor/login" className="text-muted text-decoration-none">Doctor Login</a></li>
              <li><a href="/admin/login" className="text-muted text-decoration-none">Admin Login</a></li>
            </ul>
          </Col>
          
          <Col md={3} className="mb-4">
            <h6 className="text-primary mb-3">Contact Info</h6>
            <div className="d-flex align-items-center mb-2">
              <FaPhone className="me-2 text-primary" />
              <span className="text-muted">+1 (555) 123-4567</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <FaEnvelope className="me-2 text-primary" />
              <span className="text-muted">info@hospital.com</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <FaMapMarkerAlt className="me-2 text-primary" />
              <span className="text-muted">123 Medical Center Dr, City, State 12345</span>
            </div>
          </Col>
          
          <Col md={3} className="mb-4">
            <h6 className="text-primary mb-3">Operating Hours</h6>
            <div className="d-flex align-items-center mb-2">
              <FaClock className="me-2 text-primary" />
              <div>
                <div className="text-muted">Mon - Fri: 8:00 AM - 6:00 PM</div>
                <div className="text-muted">Sat: 9:00 AM - 4:00 PM</div>
                <div className="text-muted">Sun: Emergency Only</div>
              </div>
            </div>
          </Col>
        </Row>
        
        <hr className="my-4" />
        
        <Row className="align-items-center">
          <Col md={6}>
            <p className="text-muted mb-0">
              &copy; 2024 Hospital Management System. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="text-muted mb-0">
              Built with React & Node.js
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
