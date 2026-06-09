import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import GlobalNav from '../components/GlobalNav';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Hardcode role to 'patient' to ensure it goes to the Patient collection
      await register({ ...formData, role: 'patient' });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <>
      <GlobalNav />
      <div className="section-padding" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 44px)' }}>
        <div style={{ maxWidth: '500px', width: '100%', padding: '40px', backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-lg)', border: '1px solid var(--color-hairline)' }}>
          <h2 className="display-md" style={{ marginBottom: '8px', textAlign: 'center' }}>Patient Registration</h2>
          <p className="body-secondary" style={{ marginBottom: '24px', textAlign: 'center' }}>Join as a patient to book appointments</p>
          
          {error && <p style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label className="body-strong" style={{ display: 'block', marginBottom: '8px' }}>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--color-hairline)', fontSize: '17px' }} placeholder="John Doe" required />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label className="body-strong" style={{ display: 'block', marginBottom: '8px' }}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--color-hairline)', fontSize: '17px' }} placeholder="john@example.com" required />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label className="body-strong" style={{ display: 'block', marginBottom: '8px' }}>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--color-hairline)', fontSize: '17px' }} placeholder="+91 XXXXX XXXXX" required />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label className="body-strong" style={{ display: 'block', marginBottom: '8px' }}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--color-hairline)', fontSize: '17px' }} required />
            </div>

            <button type="submit" className="button-primary" style={{ width: '100%', marginTop: '8px', marginBottom: '16px' }}>Register as Patient</button>
          </form>
          
          <p style={{ textAlign: 'center', fontSize: '14px', marginBottom: '8px' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Sign In</Link>
          </p>
          
          <div style={{ borderTop: '1px solid var(--color-hairline)', marginTop: '16px', paddingTop: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: 'var(--color-secondary)' }}>
              Are you a doctor? <Link to="/register-doctor" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 'bold' }}>Register as a Doctor</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
