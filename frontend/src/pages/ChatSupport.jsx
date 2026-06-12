import React from 'react';
import Layout from '../components/Layout';
import MedicalChat from '../components/MedicalChat';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bot, Stethoscope, ShieldCheck, MessageSquareHeart } from 'lucide-react';
import './ChatSupport.css';

const ChatSupport = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = location.state?.prefill || null;

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
      title="AI Assistant"
      actionLabel={user ? "Dashboard" : "Sign In"}
      onAction={handleAction}
    >
      <section className="ai-assistant-section section-padding">
        <div className="container">

          {/* Hero header */}
          <div className="ai-hero">
            <div className="ai-hero-badge">
              <Bot size={16} strokeWidth={2.5} />
              <span>Powered by KashDoc AI</span>
            </div>
            <h1 className="display-lg ai-hero-title">
              Consult our <span className="text-gradient">AI Assistant</span>
            </h1>
            <p className="lead ai-hero-sub">
              Describe how you feel and get clear, helpful guidance — plus a direct
              link to the right specialist in our network.
            </p>
          </div>

          {/* Two-column layout: info rail + chat */}
          <div className="ai-layout">

            <aside className="ai-rail">
              <div className="ai-feature">
                <div className="ai-feature-icon"><MessageSquareHeart size={20} /></div>
                <div>
                  <h4 className="ai-feature-title">Ask anything</h4>
                  <p className="ai-feature-text">Symptoms, medicines, or general health questions.</p>
                </div>
              </div>
              <div className="ai-feature">
                <div className="ai-feature-icon"><Stethoscope size={20} /></div>
                <div>
                  <h4 className="ai-feature-title">Find the right doctor</h4>
                  <p className="ai-feature-text">When a condition is identified, jump straight to matching specialists.</p>
                </div>
              </div>
              <div className="ai-feature">
                <div className="ai-feature-icon"><ShieldCheck size={20} /></div>
                <div>
                  <h4 className="ai-feature-title">Private &amp; secure</h4>
                  <p className="ai-feature-text">Your conversation stays within your session.</p>
                </div>
              </div>

              <div className="ai-disclaimer-card">
                This AI uses a medical knowledge base for information only.
                Always consult a qualified doctor for critical decisions.
              </div>
            </aside>

            <div className="ai-chat-wrap">
              <MedicalChat initialPrompt={prefill} />
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ChatSupport;
