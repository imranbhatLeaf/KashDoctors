import React, { useState, useEffect } from 'react';
import DoctorCard from '../components/DoctorCard';
import Hero from '../components/Hero';
import SpecialtyGrid from '../components/SpecialtyGrid';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';
import Layout from '../components/Layout';

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
    <Layout 
      title="Get the best doctors around you" 
      actionLabel={user ? "Dashboard" : "Book Now"} 
      onAction={handleAction}
    >
      <Hero />

      <SpecialtyGrid />

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
    </Layout>
  );
};

export default Home;
