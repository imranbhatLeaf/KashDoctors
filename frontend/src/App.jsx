import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import Register from './pages/Register';
import DocRegistration from './pages/DocRegistration';
<<<<<<< HEAD
import ChatSupport from './pages/ChatSupport';
=======
>>>>>>> origin/main
import PatientPortal from './pages/PatientPortal';
import MyAppointments from './pages/MyAppointments';
import BookAppointment from './pages/BookAppointment';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-doctor" element={<DocRegistration />} />
            <Route 
<<<<<<< HEAD
              path="/chat" 
              element={
                <ProtectedRoute>
                  <ChatSupport />
                </ProtectedRoute>
              } 
            />
            <Route 
=======
>>>>>>> origin/main
              path="/patient-portal" 
              element={
                <ProtectedRoute role="patient">
                  <PatientPortal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/book-appointment/:docId" 
              element={
                <ProtectedRoute role="patient">
                  <BookAppointment />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-appointments" 
              element={
                <ProtectedRoute role="patient">
                  <MyAppointments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor-dashboard" 
              element={
                <ProtectedRoute role="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
