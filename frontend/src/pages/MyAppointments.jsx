import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`${API_URL}/appointments/my-appointments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(res.data.data);
      } catch (err) {
        console.error('Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAppointments();
  }, [token]);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await axios.put(`${API_URL}/appointments/cancel/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(appointments.map((a) => a._id === id ? { ...a, status: 'cancelled' } : a));
      } catch (err) {
        alert('Failed to cancel appointment');
      }
    }
  };

  return (
    <Layout title="My Appointments" actionLabel="Find Doctors" onAction={() => navigate('/patient-portal')}>
      <div className="section-padding" style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 22px' }}>
        <h2 className="display-sm" style={{ marginBottom: '32px' }}>Booking History</h2>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {appointments.map((appt) => (
              <div key={appt._id} style={{ 
                padding: '24px', 
                backgroundColor: 'var(--color-canvas)', 
                border: '1px solid var(--color-hairline)', 
                borderRadius: 'var(--rounded-lg)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '16px', 
                    backgroundColor: 'var(--color-surface-pearl)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '28px'
                  }}>
                    {appt.doctor?.specialization?.includes('Heart') ? '❤️' : '🩺'}
                  </div>
                  <div>
                    <p className="body-strong" style={{ fontSize: '18px' }}>{appt.doctor?.name}</p>
                    <p className="caption-strong" style={{ color: 'var(--color-primary)', marginBottom: '4px' }}>{appt.doctor?.specialization}</p>
                    <p className="caption" style={{ color: 'var(--color-ink-muted-80)' }}>
                      {appt.slotDate.split('_').join(' ')} • {appt.slotTime}
                    </p>
                    <p className="caption-strong" style={{ color: 'var(--color-ink-muted-80)', marginTop: '4px', fontSize: '11px' }}>
                      Payment: {appt.paymentMethod === 'pay_on_visit' ? 'Pay on Visit' : 'Online'}
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p className="caption-strong" style={{ 
                      padding: '6px 16px', 
                      borderRadius: 'var(--rounded-pill)', 
                      backgroundColor: appt.status === 'cancelled' ? '#fff1f0' : appt.status === 'completed' ? '#f6ffed' : '#e6f7ff',
                      color: appt.status === 'cancelled' ? '#cf1322' : appt.status === 'completed' ? '#389e0d' : '#096dd9',
                      fontSize: '12px',
                      display: 'inline-block'
                    }}>
                      {appt.status.toUpperCase()}
                    </p>
                  </div>
                  
                  {appt.status === 'pending' && (
                    <button 
                      className="button-dark-utility" 
                      style={{ 
                        fontSize: '13px', 
                        color: '#ff4d4f', 
                        borderColor: '#ffa3a3',
                        padding: '8px 16px'
                      }} 
                      onClick={() => handleCancel(appt._id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
            {appointments.length === 0 && (
              <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--color-ink-muted-80)' }}>
                <p className="display-xs">No appointments found</p>
                <p className="body" style={{ marginTop: '8px' }}>Start by finding a specialist for your needs.</p>
                <button className="button-primary" style={{ marginTop: '24px' }} onClick={() => navigate('/patient-portal')}>Browse Doctors</button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyAppointments;
