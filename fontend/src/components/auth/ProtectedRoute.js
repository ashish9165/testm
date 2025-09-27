import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Spinner, Alert } from 'react-bootstrap';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="spinner-custom" />
          <p className="mt-3 text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    // Redirect to appropriate login page based on role
    const loginPath = role ? `/${role}/login` : '/';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return (
      <div className="container mt-5">
        <Alert variant="danger" className="text-center">
          <h4>Access Denied</h4>
          <p>You don't have permission to access this page.</p>
          <p>Required role: <strong>{role}</strong></p>
          <p>Your role: <strong>{user.role}</strong></p>
        </Alert>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
