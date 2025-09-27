import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Patient API
export const patientAPI = {
  // Symptom-based login
  symptomLogin: (credentials) => api.post('/patient/symptom-login', credentials),
  
  // Dashboard
  getDashboard: () => api.get('/patient/dashboard'),
  
  // Appointments
  requestAppointment: (appointmentData) => api.post('/patient/request-appointment', appointmentData),
  getAppointments: () => api.get('/patient/appointments'),
  
  // Medical history
  getMedicalHistory: () => api.get('/patient/medical-history'),
  
  // Profile
  updateProfile: (profileData) => api.put('/patient/profile', profileData),
  getProfile: () => api.get('/patient/profile'),
};

// Doctor API
export const doctorAPI = {
  // Login
  login: (credentials) => api.post('/doctor/login', credentials),
  
  // Dashboard
  getDashboard: () => api.get('/doctor/dashboard'),
  
  // Patients
  getPatients: () => api.get('/doctor/patients'),
  getPatient: (patientId) => api.get(`/doctor/patient/${patientId}`),
  
  // Appointments
  getAppointments: (params) => api.get('/doctor/appointments', { params }),
  updateAppointmentStatus: (appointmentId, status) => 
    api.put(`/doctor/appointment/${appointmentId}/status`, { status }),
  
  // Medical records
  addMedicalRecord: (patientId, recordData) => 
    api.post(`/doctor/patient/${patientId}/medical-record`, recordData),
  
  // Availability
  updateAvailability: (availabilityData) => 
    api.put('/doctor/availability', availabilityData),
};

// Admin API
export const adminAPI = {
  // Login
  login: (credentials) => api.post('/admin/login', credentials),
  
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Doctors
  getDoctors: (params) => api.get('/admin/doctors', { params }),
  createDoctor: (doctorData) => api.post('/admin/doctors', doctorData),
  updateDoctor: (doctorId, doctorData) => api.put(`/admin/doctors/${doctorId}`, doctorData),
  deleteDoctor: (doctorId) => api.delete(`/admin/doctors/${doctorId}`),
  
  // Patients
  getPatients: (params) => api.get('/admin/patients', { params }),
  
  // Departments
  getDepartments: () => api.get('/admin/departments'),
  createDepartment: (departmentData) => api.post('/admin/departments', departmentData),
  updateDepartment: (departmentId, departmentData) => 
    api.put(`/admin/departments/${departmentId}`, departmentData),
  deleteDepartment: (departmentId) => api.delete(`/admin/departments/${departmentId}`),
  
  // Reports
  getReports: (params) => api.get('/admin/reports', { params }),
  exportReport: (type, format) => api.get(`/admin/reports/export/${type}/${format}`),
};

// Common API
export const commonAPI = {
  // Health check
  healthCheck: () => api.get('/health'),
  
  // File upload
  uploadFile: (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
