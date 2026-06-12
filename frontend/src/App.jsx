import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import Register from './pages/Register';
import DocRegistration from './pages/DocRegistration';
import PatientPortal from './pages/PatientPortal';
import MyAppointments from './pages/MyAppointments';
import BookAppointment from './pages/BookAppointment';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import About from './pages/About';
import ChatSupport from './pages/ChatSupport';
import './App.css';

// Wraps the route tree and replays a page-enter transition on every navigation.
// The `key` forces the wrapper to remount whenever the path changes.
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div className="page-transition" key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-doctor" element={<DocRegistration />} />
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <ChatSupport />
            </ProtectedRoute>
          }
        />
        <Route
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
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="app-container">
          <AnimatedRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
