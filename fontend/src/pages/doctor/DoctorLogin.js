import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { FaUserMd, FaLock, FaStethoscope } from 'react-icons/fa';
import { toast } from 'react-toastify';

const DoctorLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(formData, 'doctor');
      
      if (result.success) {
        toast.success('Login successful! Welcome to your dashboard.');
        navigate('/doctor/dashboard');
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={6} xl={5}>
            <Card className="card-custom shadow-lg border-0">
              <Card.Header className="card-header-custom text-center py-4">
                <FaUserMd size={48} className="mb-3" />
                <h2 className="h3 mb-0">Doctor Login</h2>
                <p className="mb-0 opacity-75">Access your medical dashboard</p>
              </Card.Header>
              
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="form-label-custom">
                      <FaUserMd className="me-2" />
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-control-custom ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="Enter your email address"
                      autoComplete="email"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="form-label-custom">
                      <FaLock className="me-2" />
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-control-custom ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      id="rememberMe"
                      label="Remember me"
                      className="text-muted"
                    />
                    <a href="#" className="text-primary text-decoration-none">
                      Forgot password?
                    </a>
                  </div>

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="btn-primary-custom"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Signing In...
                        </>
                      ) : (
                        <>
                          <FaStethoscope className="me-2" />
                          Sign In
                        </>
                      )}
                    </Button>
                  </div>
                </Form>

                <hr className="my-4" />

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Don't have an account? 
                    <a href="#" className="text-primary text-decoration-none ms-1">
                      Contact Administrator
                    </a>
                  </p>
                </div>
              </Card.Body>
            </Card>

            {/* Additional Info Card */}
            <Card className="card-custom border-0 shadow-sm mt-4">
              <Card.Body className="p-4">
                <h6 className="text-primary mb-3">
                  <FaStethoscope className="me-2" />
                  Doctor Portal Features
                </h6>
                <ul className="list-unstyled mb-0 text-muted small">
                  <li className="mb-2">• Manage assigned patients</li>
                  <li className="mb-2">• View patient medical history</li>
                  <li className="mb-2">• Schedule and manage appointments</li>
                  <li className="mb-2">• Add diagnosis and prescriptions</li>
                  <li className="mb-2">• Update patient records</li>
                  <li className="mb-0">• Real-time patient notifications</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DoctorLogin;
