import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'dashboard'
  const [loginData, setLoginData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    symptoms: '',
    emergencyContact: '',
    address: ''
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSymptomLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert symptoms string to array
      const symptomsArray = loginData.symptoms
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const response = await axios.post('http://localhost:5000/api/patient/symptom-login', {
        name: loginData.name,
        age: parseInt(loginData.age),
        email: loginData.email,
        phone: loginData.phone,
        symptoms: symptomsArray,
        emergencyContact: loginData.emergencyContact,
        address: loginData.address
      });

      if (response.data.success) {
        setUser(response.data.patient);
        setCurrentView('dashboard');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.patient));
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
    setLoginData({
      name: '',
      age: '',
      email: '',
      phone: '',
      symptoms: '',
      emergencyContact: '',
      address: ''
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (currentView === 'login') {
    return (
      <div className="App">
        <div className="container">
          <div className="header">
            <h1>🏥 Hospital Management System</h1>
            <p>Patient Triage & Doctor Assignment</p>
          </div>

          <div className="login-form">
            <h2>Patient Registration & Login</h2>
            <p className="subtitle">Describe your symptoms and get assigned to the right doctor</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSymptomLogin}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={loginData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label>Age *</label>
                  <input
                    type="number"
                    name="age"
                    value={loginData.age}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="120"
                    placeholder="Enter your age"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={loginData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Symptoms *</label>
                <textarea
                  name="symptoms"
                  value={loginData.symptoms}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Enter your symptoms separated by commas (e.g., fever, headache, cough)"
                />
                <small>Separate multiple symptoms with commas</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Emergency Contact</label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={loginData.emergencyContact}
                    onChange={handleInputChange}
                    placeholder="Emergency contact number"
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={loginData.address}
                    onChange={handleInputChange}
                    placeholder="Your address"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Processing...' : 'Get Doctor Assignment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user?.name}</h1>
            <p>Patient ID: {user?.id}</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>

        <div className="dashboard-content">
          <div className="info-card">
            <h2>📋 Your Information</h2>
            <div className="info-grid">
              <div><strong>Name:</strong> {user?.name}</div>
              <div><strong>Age:</strong> {user?.age}</div>
              <div><strong>Email:</strong> {user?.email}</div>
              <div><strong>Priority Level:</strong> 
                <span className={`priority ${user?.priorityLevel}`}>
                  {user?.priorityLevel?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="symptoms-card">
            <h2>🩺 Your Symptoms</h2>
            <div className="symptoms-list">
              {user?.symptoms?.map((symptom, index) => (
                <span key={index} className="symptom-tag">{symptom}</span>
              ))}
            </div>
          </div>

          {user?.assignedDoctor && (
            <div className="doctor-card">
              <h2>👨‍⚕️ Assigned Doctor</h2>
              <div className="doctor-info">
                <div className="doctor-details">
                  <h3>Dr. {user.assignedDoctor.name}</h3>
                  <p><strong>Specialization:</strong> {user.assignedDoctor.specialization}</p>
                  <p><strong>Phone:</strong> {user.assignedDoctor.phone}</p>
                  <p><strong>Consultation Fee:</strong> ₹{user.assignedDoctor.consultationFee}</p>
                </div>
                <div className="doctor-actions">
                  <button className="contact-btn">Contact Doctor</button>
                  <button className="appointment-btn">Book Appointment</button>
                </div>
              </div>
            </div>
          )}

          <div className="suggestions-card">
            <h2>💡 Medical Suggestions</h2>
            <div className="suggestions-content">
              <p>Based on your symptoms, you have been assigned to a <strong>{user?.assignedDoctor?.specialization}</strong> specialist.</p>
              <p>Your priority level is <strong>{user?.priorityLevel}</strong>, which means you will be seen accordingly.</p>
              <div className="next-steps">
                <h3>Next Steps:</h3>
                <ul>
                  <li>Contact your assigned doctor to schedule an appointment</li>
                  <li>If this is an emergency, go to the nearest emergency room</li>
                  <li>Keep track of any new or worsening symptoms</li>
                  <li>Follow any pre-appointment instructions from your doctor</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;