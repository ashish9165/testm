import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Navbar as BootstrapNavbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { FaUser, FaSignOutAlt, FaHospital, FaUserMd, FaUserInjured, FaCog } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'patient':
        return <FaUserInjured className="me-2" />;
      case 'doctor':
        return <FaUserMd className="me-2" />;
      case 'admin':
        return <FaCog className="me-2" />;
      default:
        return <FaUser className="me-2" />;
    }
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case 'patient':
        return '/patient/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <BootstrapNavbar expand="lg" className="navbar-custom">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="navbar-brand-custom">
          <FaHospital className="me-2" />
          Hospital Management System
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="nav-link-custom">
              Home
            </Nav.Link>
            
            {!isAuthenticated() && (
              <>
                <Nav.Link as={Link} to="/patient/login" className="nav-link-custom">
                  Patient Login
                </Nav.Link>
                <Nav.Link as={Link} to="/doctor/login" className="nav-link-custom">
                  Doctor Login
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/login" className="nav-link-custom">
                  Admin Login
                </Nav.Link>
              </>
            )}
          </Nav>

          {isAuthenticated() && (
            <Nav>
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-light" className="d-flex align-items-center">
                  {getRoleIcon(user.role)}
                  {user.name}
                  <span className="badge bg-light text-dark ms-2">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to={getDashboardPath(user.role)}>
                    <FaUser className="me-2" />
                    Dashboard
                  </Dropdown.Item>
                  
                  {user.role === 'patient' && (
                    <>
                      <Dropdown.Item as={Link} to="/patient/appointments">
                        Appointments
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/patient/medical-history">
                        Medical History
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/patient/profile">
                        Profile
                      </Dropdown.Item>
                    </>
                  )}
                  
                  {user.role === 'doctor' && (
                    <>
                      <Dropdown.Item as={Link} to="/doctor/patients">
                        My Patients
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/doctor/appointments">
                        Appointments
                      </Dropdown.Item>
                    </>
                  )}
                  
                  {user.role === 'admin' && (
                    <>
                      <Dropdown.Item as={Link} to="/admin/doctors">
                        Manage Doctors
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/patients">
                        Manage Patients
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/departments">
                        Manage Departments
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/reports">
                        Reports
                      </Dropdown.Item>
                    </>
                  )}
                  
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          )}
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
