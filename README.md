# Hospital Management System (HMS)

A comprehensive full-stack Hospital Management System built with the MERN stack (MongoDB, Express.js, React, Node.js). This system features a unique symptom-based triage system for patients, comprehensive doctor dashboards, and administrative controls.

## 🏥 Features

### Patient Module
- **Symptom-Based Login/Triage**: Patients enter symptoms and are automatically assigned to the most appropriate doctor
- **Smart Doctor Assignment**: AI-powered symptom analysis maps symptoms to doctor specializations
- **Patient Dashboard**: View assigned doctor, appointment history, and medical records
- **Appointment Booking**: Easy appointment scheduling with assigned doctors
- **Medical History**: Complete medical record tracking

### Doctor Module
- **Doctor Dashboard**: Comprehensive overview of assigned patients and appointments
- **Patient Management**: View and manage assigned patients
- **Appointment Management**: Approve/reject appointment requests
- **Medical Records**: Add diagnosis, prescriptions, and treatment notes
- **Real-time Updates**: Live notifications for new appointments and patient updates

### Admin Module
- **System Overview**: Complete hospital statistics and analytics
- **Doctor Management**: CRUD operations for doctor profiles
- **Patient Management**: Oversee all patient records
- **Department Management**: Manage medical departments and specializations
- **Reports & Analytics**: Generate comprehensive reports with charts and data visualization
- **User Management**: Control access and permissions

## 🚀 Technology Stack

### Backend
- **Node.js** - Runtime environment (ES Modules)
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

### Frontend
- **React 18** - Frontend library
- **React Router** - Client-side routing
- **Bootstrap 5** - UI framework
- **Chart.js** - Data visualization
- **React DatePicker** - Date selection
- **Axios** - HTTP client
- **React Toastify** - Notifications

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hospital-management-system
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital_management
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
```

### 4. Frontend Setup
```bash
cd ../fontend
npm install
```

### 5. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

### 6. Run the Application

#### Start Backend Server
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:5000`

#### Start Frontend Development Server
```bash
cd fontend
npm start
```
The frontend will start on `http://localhost:3000`

## 🎯 Usage

### Patient Access
1. Navigate to `http://localhost:3000`
2. Click "Patient Login"
3. Enter your symptoms and personal information
4. System will automatically assign you to the most appropriate doctor
5. Access your dashboard to view assigned doctor and book appointments

### Doctor Access
1. Navigate to `http://localhost:3000/doctor/login`
2. Enter your email and password
3. Access your dashboard to manage patients and appointments
4. View assigned patients and their medical history
5. Approve/reject appointment requests

### Admin Access
1. Navigate to `http://localhost:3000/admin/login`
2. Enter admin credentials
3. Access the admin panel for system management
4. Manage doctors, patients, and departments
5. Generate reports and analytics

## 🗄️ Database Schema

### Patient Model
```javascript
{
  name: String,
  age: Number,
  email: String,
  phone: String,
  symptoms: [String],
  assignedDoctor: ObjectId,
  medicalHistory: [Object],
  appointments: [ObjectId],
  emergencyContact: Object,
  address: Object,
  bloodType: String,
  allergies: [String],
  currentMedications: [String]
}
```

### Doctor Model
```javascript
{
  name: String,
  email: String,
  password: String,
  specialization: String,
  phone: String,
  licenseNumber: String,
  department: ObjectId,
  patientsAssigned: [ObjectId],
  experience: Number,
  consultationFee: Number,
  availability: Object,
  isActive: Boolean
}
```

### Admin Model
```javascript
{
  name: String,
  email: String,
  password: String,
  role: String,
  permissions: [String],
  isActive: Boolean
}
```

### Appointment Model
```javascript
{
  patientId: ObjectId,
  doctorId: ObjectId,
  date: Date,
  time: String,
  status: String,
  type: String,
  reason: String,
  diagnosis: String,
  prescription: [Object],
  createdBy: String
}
```

## 🔧 API Endpoints

### Patient Endpoints
- `POST /api/patient/symptom-login` - Patient login with symptoms
- `GET /api/patient/dashboard` - Get patient dashboard data
- `POST /api/patient/request-appointment` - Request new appointment
- `GET /api/patient/medical-history` - Get medical history
- `PUT /api/patient/profile` - Update patient profile

### Doctor Endpoints
- `POST /api/doctor/login` - Doctor login
- `GET /api/doctor/dashboard` - Get doctor dashboard
- `GET /api/doctor/patients` - Get assigned patients
- `GET /api/doctor/patient/:id` - Get specific patient details
- `PUT /api/doctor/appointment/:id/status` - Update appointment status
- `POST /api/doctor/patient/:id/medical-record` - Add medical record

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Get admin dashboard
- `GET /api/admin/doctors` - Get all doctors
- `POST /api/admin/doctors` - Create new doctor
- `PUT /api/admin/doctors/:id` - Update doctor
- `DELETE /api/admin/doctors/:id` - Delete doctor
- `GET /api/admin/patients` - Get all patients
- `GET /api/admin/departments` - Get all departments
- `GET /api/admin/reports` - Generate reports

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Healthcare Theme**: Clean, professional design with medical color scheme
- **Interactive Charts**: Real-time data visualization with Chart.js
- **Toast Notifications**: User-friendly feedback for all actions
- **Modal Forms**: Clean, accessible forms for data entry
- **Status Indicators**: Clear visual indicators for appointment and patient statuses
- **Loading States**: Smooth loading animations and spinners

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Comprehensive validation on both client and server
- **Role-based Access**: Different access levels for patients, doctors, and admins
- **CORS Protection**: Cross-origin resource sharing protection
- **Error Handling**: Comprehensive error handling and logging

## 📊 Symptom Mapping System

The system includes an intelligent symptom-to-specialization mapping:

- **General Symptoms**: fever, headache, fatigue → General Physician
- **Cardiovascular**: chest pain, heart palpitations → Cardiologist
- **Neurological**: seizures, memory problems → Neurologist
- **Respiratory**: cough, shortness of breath → Internal Medicine
- **Emergency**: severe chest pain, difficulty breathing → Emergency Medicine

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB instance
2. Update environment variables for production
3. Deploy to platforms like Heroku, DigitalOcean, or AWS

### Frontend Deployment
1. Build the React application: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Telemedicine Integration**: Video consultation features
- **Mobile App**: Native mobile applications
- **AI Diagnostics**: Advanced AI-powered symptom analysis
- **Integration APIs**: Third-party medical system integrations
- **Advanced Analytics**: Machine learning insights
- **Multi-language Support**: Internationalization
- **Blockchain Records**: Secure medical record storage

---

**Built with ❤️ for better healthcare management**
