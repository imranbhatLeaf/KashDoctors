import React, { useState, useEffect } from 'react';
import GlobalNav from '../components/GlobalNav';
import SubNavFrosted from '../components/SubNavFrosted';
import DoctorCard from '../components/DoctorCard';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroImg from '../assets/heroimg.jpeg';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [popularDoctors, setPopularDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${API_URL}/doctors/all`);
        const json = await response.json();
        if (json.success) {
          const popular = json.data.filter(doc => doc.isPopular).slice(0, 3);
          setPopularDoctors(popular);
        }
      } catch (error) {
        console.error('Error fetching popular doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleBook = (id) => {
    if (user && user.role === 'patient') {
      navigate(`/book-appointment/${id}`);
    } else {
      navigate('/login');
    }
  };

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
    <div className="home-page">
      <GlobalNav />
      <SubNavFrosted 
        title="Get the best doctors around you" 
        actionLabel={user ? "Dashboard" : "Book Now"} 
        onAction={handleAction} 
      />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">Healthcare for Srinagar</div>
            <h1 className="hero-title">
              Your Health, <span className="text-gradient">Simplified.</span>
            </h1>
            <p className="hero-lead">
              Connect with the best doctors in Srinagar in seconds. Experience healthcare that's modern, accessible, and designed for your life.
            </p>
            <div className="hero-actions">
              <Link to="/doctors" className="button-primary-elevated">Find a Doctor</Link>
              <Link to="/register" className="button-secondary-outline">Learn More</Link>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="visual-background-glow"></div>
            <div className="image-wrapper">
              <img 
                src={heroImg} 
                alt="Medical Professional" 
                className="hero-main-image"
              />
              <div className="floating-card-top">
                <div className="pulse-dot"></div>
                <span>In Srinagar</span>
              </div>
              <div className="floating-card-bottom">
                <div className="card-avatar">👨‍⚕️</div>
                <div className="card-text">
                  <strong>Dr. Anthony</strong>
                  <span>Available Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Find by Speciality Section */}
      <section className="section-padding speciality-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="display-lg">Find by Speciality</h2>
            <p className="lead" style={{ maxWidth: '600px', margin: '16px auto 0' }}>
              Simply browse through our extensive list of trusted doctors, scheduled your appointment hassle-free.
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '24px',
            padding: '0 20px'
          }}>
            {[
              { name: 'General Physician', icon: '🩺' },
              { name: 'Gynecologist', icon: '🤰' },
              { name: 'Dermatologist', icon: '✨' },
              { name: 'Pediatricians', icon: '👶' },
              { name: 'Neurologist', icon: '🧠' },
              { name: 'Gastroenterologist', icon: '🍕' }
            ].map(spec => (
              <div 
                key={spec.name}
                onClick={() => navigate('/doctors', { state: { specialty: spec.name } })}
                className="speciality-card"
                style={{ 
                  padding: '32px 16px', 
                  textAlign: 'center', 
                  backgroundColor: 'var(--color-canvas)', 
                  border: '1px solid var(--color-hairline)', 
                  borderRadius: 'var(--rounded-lg)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--color-hairline)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '40px' }}>{spec.icon}</div>
                <p className="caption-strong" style={{ fontSize: '14px' }}>{spec.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section / Top Doctors Grid */}
      <section id="doctors" className="section-padding doctors-preview-section">
        <div className="container">
          <div className="section-header">
            <h2 className="display-lg">Top Specialists</h2>
            <p className="lead">Our most highly rated professionals in Srinagar.</p>
          </div>
          
          <div className="doctors-grid">
            {popularDoctors.map(doctor => (
              <DoctorCard key={doctor._id} doctor={doctor} onBook={handleBook} />
            ))}
          </div>

          <div className="view-all-container">
            <button 
              className="button-pill-outline" 
              onClick={() => navigate('/doctors')}
            >
              See All Doctors
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section section-padding">
        <div className="container narrow">
          <h2 className="display-lg">Built for Privacy.</h2>
          <p className="body-text-large">
            Your medical data is encrypted and secure. We believe privacy is a fundamental human right, and it's at the core of everything we build.
          </p>
          <div className="about-actions">
            <Link to="/register" className="button-primary-elevated">Get Started</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <p className="fine-print">© 2026 KashDoc Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
