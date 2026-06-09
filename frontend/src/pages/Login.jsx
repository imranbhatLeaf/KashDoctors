import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import GlobalNav from '../components/GlobalNav';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <>
      <GlobalNav />
      <div className="section-padding" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 44px)' }}>
        <div style={{ maxWidth: '400px', width: '100%', padding: '40px', backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-lg)', border: '1px solid var(--color-hairline)' }}>
          <h2 className="display-md" style={{ marginBottom: '24px', textAlign: 'center' }}>Sign In</h2>
          {error && <p style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label className="body-strong" style={{ display: 'block', marginBottom: '8px' }}>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--color-hairline)', fontSize: '17px' }}
                required 
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label className="body-strong" style={{ display: 'block', marginBottom: '8px' }}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--color-hairline)', fontSize: '17px' }}
                required 
              />
            </div>
            <button type="submit" className="button-primary" style={{ width: '100%', marginBottom: '16px' }}>Sign In</button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '14px' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Register</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
