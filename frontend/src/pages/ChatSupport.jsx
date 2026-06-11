import React from 'react';
import Layout from '../components/Layout';
import MedicalChat from '../components/MedicalChat';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChatSupport = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAction = () => {
    if (user) {
      if (user.role === 'patient') navigate('/patient-portal');
      else if (user.role === 'doctor') navigate('/doctor-dashboard');
      else navigate('/admin-dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <Layout 
      title="Medical AI Assistant" 
      actionLabel={user ? "Dashboard" : "Sign In"} 
      onAction={handleAction}
    >
      <section className="section-padding">
        <div className="container narrow">
          <div className="page-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 className="display-lg">Consult our AI</h1>
            <p className="lead">Ask anything about symptoms, medicines, or general health concerns.</p>
          </div>
          
          <MedicalChat />
          
          <div style={{ marginTop: '30px', textAlign: 'center', opacity: 0.7 }}>
            <p className="body-text-small">
              Note: This AI uses a medical knowledge base. Always consult a real doctor for critical decisions.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ChatSupport;
