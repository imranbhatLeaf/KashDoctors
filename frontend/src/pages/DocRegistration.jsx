import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import GlobalNav from '../components/GlobalNav';

const DocRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'doctor'
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
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <>
      <GlobalNav />
      <div className="section-padding" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 44px)' }}>
        <div style={{ maxWidth: '500px', width: '100%', padding: '40px', backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-lg)', border: '1px solid var(--color-hairline)' }}>
          <h2 className="display-md" style={{ marginBottom: '8px', textAlign: 'center' }}>Register as a Doctor</h2>
          <p className="body-secondary" style={{ marginBottom: '24px', textAlign: 'center' }}>Start your journey with us</p>
          
          {error && <p style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label className="body-strong" style={{ display: 'block', marginBottom: '8px' }}>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--color-hairline)', fontSize: '17px' }} placeholder="Dr. John Doe" required />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="body-strong" style={{ display: 'block', marginBottom: '8px' }}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--color-hairline)', fontSize: '17px' }} placeholder="doctor@example.com" required />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="body-strong" style={{ display: 'block', marginBottom: '8px' }}>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--color-hairline)', fontSize: '17px' }} placeholder="+91 XXXXX XXXXX" required />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="body-strong" style={{ display: 'block', marginBottom: '8px' }}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--color-hairline)', fontSize: '17px' }} required />
            </div>

            <button type="submit" className="button-primary" style={{ width: '100%', marginBottom: '16px' }}>Register</button>
          </form>
          
          <p style={{ textAlign: 'center', fontSize: '14px' }}>
            Are you a patient? <Link to="/register" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Register here</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default DocRegistration;
