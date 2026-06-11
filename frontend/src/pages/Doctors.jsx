import React, { useState, useEffect, useMemo } from 'react';
import DoctorCard from '../components/DoctorCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import './Doctors.css';

const Doctors = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(location.state?.specialty || 'All');

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${API_URL}/doctors/all`);
        const json = await response.json();
        if (json.success) {
          setDoctors(json.data);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [API_URL]);

  const categories = useMemo(() => {
    return ['All', ...new Set(doctors.map(doc => doc.specialization))];
  }, [doctors]);

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
      navigate('/');
    }
  };

  const filteredDoctors = useMemo(() => {
    return selectedCategory === 'All' 
      ? doctors 
      : doctors.filter(doc => doc.specialization === selectedCategory);
  }, [doctors, selectedCategory]);

  return (
    <Layout 
      title="Find your specialist" 
      actionLabel={user ? "Dashboard" : "Home"} 
      onAction={handleAction}
    >
      <section className="section-padding doctors-list-section">
        <div className="container">
          <div className="page-header">
            <h1 className="display-lg">All Specialists</h1>
            <p className="lead">Browse through our network of qualified professionals.</p>
          </div>

          {!loading && (
            <div className="category-filter">
              <div className="filter-label">Filter by Specialization</div>
              <div className="category-pills">
                {categories.map(category => (
                  <button 
                    key={category}
                    className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="doctors-grid">
            {loading ? (
              <div className="no-results"><h3>Loading specialists...</h3></div>
            ) : filteredDoctors.length > 0 ? (
              filteredDoctors.map(doctor => (
                <DoctorCard key={doctor._id} doctor={doctor} onBook={handleBook} />
              ))
            ) : (
              <div className="no-results">
                <h3>No specialists found in this category.</h3>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Doctors;
