import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';

const DocRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'doctor',
    certificationNo: '',
    specialization: '',
    experience: '',
    fees: '',
    about: ''
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
    <Layout showSubNav={false} showFooter={false}>
      <div className="section-padding" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', padding: '40px 0' }}>
        <div style={{ maxWidth: '600px', width: '100%', padding: '40px', backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-lg)', border: '1px solid var(--color-hairline)' }}>
          <h2 className="display-md" style={{ marginBottom: '8px', textAlign: 'center' }}>Register as a Doctor</h2>
          <p className="body-secondary" style={{ marginBottom: '24px', textAlign: 'center' }}>Start your journey with us</p>
          
          {error && <p style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="body-strong" style={{ display: 'block', marginBottom: '8px' }}>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--color-hairline)', fontSize: '16px' }} placeholder="Dr. John Doe" required />
              </div>

              <div>
                <label className="body-strong" style={{ display: 'block', marginBottom: '8px' }}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--color-hairline)', fontSize: '16px' }} placeholder="doctor@example.com" required />
              </div>

              <div>
                <label className="body-strong" style={{ display: 'block', marginBottom: '8px' }}>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--color-hairline)', fontSize: '16px' }} placeholder="+91 XXXXX XXXXX" required />
              </div>

              <div>
                <label className="body-strong" style={{ display: 'block', marginBottom: '8px' }}>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--color-hairline)', fontSize: '16px' }} required />
              </div>

              <div>
                <label className="body-strong" style={{ display: 'block', marginBottom: '8px' }}>License / Certification No.</label>
                <input type="text" name="certificationNo" value={formData.certificationNo} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--color-hairline)', fontSize: '16px' }} placeholder="e.g. MC-12345" required />
              </div>

              <div>
                <label className="body-strong" style={{ display: 'block', marginBottom: '8px' }}>Specialization</label>
                <select name="specialization" value={formData.specialization} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--color-hairline)', fontSize: '16px', backgroundColor: 'var(--color-canvas)' }} required>
                  <option value="">Select Specialty</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Pediatricians">Pediatricians</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Gastroenterologist">Gastroenterologist</option>
                </select>
              </div>

              <div>
                <label className="body-strong" style={{ display: 'block', marginBottom: '8px' }}>Experience (Years)</label>
                <input type="number" name="experience" value={formData.experience} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--color-hairline)', fontSize: '16px' }} placeholder="e.g. 5" min="0" required />
              </div>

              <div>
                <label className="body-strong" style={{ display: 'block', marginBottom: '8px' }}>Consultation Fees ($)</label>
                <input type="number" name="fees" value={formData.fees} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--color-hairline)', fontSize: '16px' }} placeholder="e.g. 50" min="0" required />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label className="body-strong" style={{ display: 'block', marginBottom: '8px' }}>Professional Bio / About</label>
                <textarea name="about" value={formData.about} onChange={handleChange} rows="3" style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--color-hairline)', fontSize: '16px', resize: 'none' }} placeholder="Describe your credentials..." required />
              </div>
            </div>

            <button type="submit" className="button-primary" style={{ width: '100%', marginBottom: '16px' }}>Register as Doctor</button>
          </form>
          
          <p style={{ textAlign: 'center', fontSize: '14px' }}>
            Are you a patient? <Link to="/register" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Register here</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default DocRegistration;
