import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      // Pass username as email to backend login function
      const role = await login(username, password);
      if (role === 'admin') {
        navigate('/');
      } else {
        setError('Unauthorized access role.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid administrator credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showSubNav={false} showFooter={false}>
      <div 
        className="section-padding" 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '90vh',
          background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.05), transparent), radial-gradient(circle at bottom left, rgba(16, 185, 129, 0.03), transparent)'
        }}
      >
        <div 
          style={{ 
            maxWidth: '440px', 
            width: '100%', 
            padding: '40px', 
            backgroundColor: 'var(--color-canvas)', 
            borderRadius: 'var(--rounded-lg)', 
            border: '1px solid var(--color-hairline)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span 
              style={{ 
                display: 'inline-block', 
                padding: '6px 12px', 
                backgroundColor: 'rgba(239, 68, 68, 0.08)', 
                color: 'var(--color-danger, #ef4444)', 
                borderRadius: '9999px', 
                fontSize: '12px', 
                fontWeight: '600',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '16px',
                border: '1px solid rgba(239, 68, 68, 0.16)'
              }}
            >
              Secure Area
            </span>
            <h2 className="display-md" style={{ marginBottom: '8px', color: 'var(--color-text-dark)' }}>Admin Portal</h2>
            <p className="body-muted" style={{ fontSize: '14px' }}>Please sign in to access the system overview dashboard.</p>
          </div>

          {error && (
            <div 
              style={{ 
                padding: '12px 16px', 
                backgroundColor: 'rgba(239, 68, 68, 0.05)', 
                borderLeft: '4px solid var(--color-danger, #ef4444)', 
                borderRadius: 'var(--rounded-sm)',
                marginBottom: '24px',
                color: 'var(--color-danger, #ef4444)',
                fontSize: '14px'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label className="body-strong" style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  borderRadius: 'var(--rounded-sm)', 
                  border: '1px solid var(--color-hairline)', 
                  fontSize: '16px',
                  backgroundColor: 'var(--color-canvas)',
                  color: 'var(--color-text-dark)',
                  transition: 'border-color 0.2s'
                }}
                placeholder="Enter admin username"
                required 
              />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label className="body-strong" style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  borderRadius: 'var(--rounded-sm)', 
                  border: '1px solid var(--color-hairline)', 
                  fontSize: '16px',
                  backgroundColor: 'var(--color-canvas)',
                  color: 'var(--color-text-dark)',
                  transition: 'border-color 0.2s'
                }}
                placeholder="••••••••"
                required 
              />
            </div>
            <button 
              type="submit" 
              className="button-primary" 
              disabled={isLoading}
              style={{ 
                width: '100%', 
                padding: '14px',
                fontWeight: '600',
                fontSize: '16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
