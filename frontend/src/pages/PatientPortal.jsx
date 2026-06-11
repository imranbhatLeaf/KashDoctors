<<<<<<< HEAD
import React, { useEffect, useState, useMemo } from 'react';
=======
import React, { useEffect, useState } from 'react';
>>>>>>> origin/main
import axios from 'axios';
import DoctorCard from '../components/DoctorCard';
import SymptomChecker from '../components/SymptomChecker';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';

const PatientPortal = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, apptsRes] = await Promise.all([
          axios.get(`${API_URL}/doctors/all`),
          axios.get(`${API_URL}/appointments/my-appointments`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setDoctors(docsRes.data.data);
        const upcoming = apptsRes.data.data
          .filter(a => a.status === 'pending' || a.status === 'confirmed')
          .slice(0, 2);
        setAppointments(upcoming);
      } catch (err) {
        console.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
<<<<<<< HEAD
  }, [token, API_URL]);
=======
  }, [token]);
>>>>>>> origin/main

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleBookClick = (doctor) => {
    navigate(`/book-appointment/${doctor._id}`);
  };

  const handlePredictionResult = (speciality) => {
    setSelectedSpecialty(speciality);
    setTimeout(() => {
      document.getElementById('doctor-list')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

<<<<<<< HEAD
  const specialties = useMemo(() => {
    return ['All', ...new Set(doctors.map(d => d.specialization))];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchesName = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = selectedSpecialty === 'All' || doc.specialization === selectedSpecialty;
      return matchesName && matchesSpecialty;
    });
  }, [doctors, searchTerm, selectedSpecialty]);
=======
  const specialties = ['All', ...new Set(doctors.map(d => d.specialization))];

  const filteredDoctors = doctors.filter(doc => {
    const matchesName = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialization === selectedSpecialty;
    return matchesName && matchesSpecialty;
  });
>>>>>>> origin/main

  return (
    <Layout
      title={`Welcome, ${user?.name}`}
      actionLabel="My Appointments"
      onAction={() => navigate('/my-appointments')}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 22px' }}>

        {/* Success message */}
        {successMessage && (
          <div style={{
            padding: '16px 24px',
            backgroundColor: '#e6fffa',
            border: '1px solid #38b2ac',
            borderRadius: 'var(--rounded-lg)',
            color: '#2c7a7b',
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <p className="body-strong">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
            >
              &times;
            </button>
          </div>
        )}

        {/* Upcoming Appointments */}
        {appointments.length > 0 && (
          <div style={{ marginBottom: '60px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 className="display-sm">Upcoming Appointments</h3>
              <button
                className="button-dark-utility"
                onClick={() => navigate('/my-appointments')}
              >
                View All
              </button>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {appointments.map(appt => (
                <div key={appt._id} style={{
                  padding: '24px',
                  backgroundColor: 'var(--color-surface-pearl)',
                  border: '1px solid var(--color-hairline)',
                  borderRadius: 'var(--rounded-lg)',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0
                  }}>
                    🩺
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="body-strong">{appt.doctor?.name}</p>
                    <p className="caption" style={{ color: 'var(--color-ink-muted-80)' }}>
                      {appt.slotDate} • {appt.slotTime}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    padding: '4px 8px',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    borderRadius: '4px',
                    flexShrink: 0
                  }}>
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Symptom Checker ── */}
        <SymptomChecker onResult={handlePredictionResult} />

        {/* Find Your Specialist header */}
        <div id="doctor-list" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <h2 className="display-lg" style={{ marginBottom: '8px' }}>Find Your Specialist</h2>
            <p className="body" style={{ color: 'var(--color-ink-muted-80)' }}>
              {selectedSpecialty !== 'All'
                ? `Showing ${selectedSpecialty} doctors based on your symptoms.`
                : 'Search by name or filter by medical department.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search doctor by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 'var(--rounded-md)',
                border: '1px solid var(--color-hairline)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Specialty filter pills */}
        {!loading && (
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '16px',
            marginBottom: '32px',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}>
            {specialties.map(spec => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--rounded-pill)',
                  border: '1px solid var(--color-hairline)',
                  backgroundColor: selectedSpecialty === spec ? 'var(--color-primary)' : 'white',
                  color: selectedSpecialty === spec ? 'white' : 'var(--color-ink-muted-80)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                {spec}
              </button>
            ))}
          </div>
        )}

        {/* Doctor grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p className="body" style={{ color: 'var(--color-ink-muted-80)' }}>Loading doctors...</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {filteredDoctors.map((doc) => (
              <DoctorCard
                key={doc._id}
                doctor={doc}
                onBook={() => handleBookClick(doc)}
              />
            ))}
            {filteredDoctors.length === 0 && (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '60px 0'
              }}>
                <p className="body-strong">No doctors found matching your criteria.</p>
                <button
                  className="button-pill-outline"
                  style={{ marginTop: '16px' }}
                  onClick={() => { setSearchTerm(''); setSelectedSpecialty('All'); }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </Layout>
  );
};

export default PatientPortal;