import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GlobalNav from '../components/GlobalNav';
import SubNavFrosted from '../components/SubNavFrosted';
import { useAuth } from '../context/AuthContext';

const BookAppointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // Generate next 7 days
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    days.push({
      fullDate: d.toLocaleDateString('en-GB').split('/').join('_'), // DD_MM_YYYY
      displayDate: d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
    });
  }

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`${API_URL}/doctors/${docId}`);
        setDoctor(res.data.data);
        setSelectedDate(days[0].fullDate);

      } catch (err) {
        setError('Failed to load doctor details');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [docId]);

  const handleBook = async () => {
    if (!selectedTime) {
      setError('Please select a time slot');
      return;
    }

    setBookingLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/appointments`, 
        { docId, slotDate: selectedDate, slotTime: selectedTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/patient-portal', { state: { message: 'Appointment booked successfully!' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!doctor) return <div>Doctor not found.</div>;

  return (
    <>
      <GlobalNav />
      <SubNavFrosted title="Book Appointment" actionLabel="Back" onAction={() => navigate(-1)} />
      
      <div className="section-padding" style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 22px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '48px', alignItems: 'start' }}>
          
          {/* Doctor Info Card */}
          <div style={{ 
            backgroundColor: 'var(--color-canvas)', 
            border: '1px solid var(--color-hairline)', 
            borderRadius: 'var(--rounded-lg)',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--color-surface-pearl)', 
              margin: '0 auto 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              color: 'var(--color-primary)'
            }}>
              {doctor.name.charAt(0)}
            </div>
            <h2 className="display-sm" style={{ marginBottom: '8px' }}>{doctor.name}</h2>
            <p className="body-strong" style={{ color: 'var(--color-primary)', marginBottom: '16px' }}>{doctor.specialization}</p>
            <p className="caption" style={{ color: 'var(--color-ink-muted-80)', marginBottom: '24px' }}>
              {doctor.experience} years experience • {doctor.degree}
            </p>
            <div style={{ borderTop: '1px solid var(--color-hairline)', paddingTop: '24px' }}>
              <p className="caption-strong">Consultation Fee</p>
              <p className="display-xs">${doctor.fees}</p>
            </div>
          </div>

          {/* Booking Options */}
          <div>
            <h3 className="display-xs" style={{ marginBottom: '24px' }}>Select Preferred Slot</h3>
            
            {error && (
              <div style={{ 
                padding: '12px 16px', 
                backgroundColor: '#fff1f1', 
                border: '1px solid #ffa3a3', 
                borderRadius: 'var(--rounded-md)', 
                color: '#d32f2f',
                marginBottom: '24px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '32px' }}>
              <label className="body-strong" style={{ display: 'block', marginBottom: '12px' }}>1. Choose Date</label>
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                {days.map(day => (
                  <button 
                    key={day.fullDate}
                    onClick={() => setSelectedDate(day.fullDate)}
                    style={{ 
                      flexShrink: 0,
                      padding: '12px 20px', 
                      borderRadius: 'var(--rounded-md)', 
                      border: selectedDate === day.fullDate ? '2px solid var(--color-primary)' : '1px solid var(--color-hairline)',
                      backgroundColor: selectedDate === day.fullDate ? 'var(--color-surface-pearl)' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <p className="caption-strong" style={{ color: selectedDate === day.fullDate ? 'var(--color-primary)' : 'inherit' }}>
                      {day.displayDate}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '48px' }}>
              <label className="body-strong" style={{ display: 'block', marginBottom: '12px' }}>2. Choose Time</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                {timeSlots.map(slot => (
                  <button 
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    style={{ 
                      padding: '12px', 
                      borderRadius: 'var(--rounded-md)', 
                      border: selectedTime === slot ? '2px solid var(--color-primary)' : '1px solid var(--color-hairline)',
                      backgroundColor: selectedTime === slot ? 'var(--color-surface-pearl)' : 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: selectedTime === slot ? '600' : '400',
                      color: selectedTime === slot ? 'var(--color-primary)' : 'inherit',
                      transition: 'all 0.2s'
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '48px' }}>
              <label className="body-strong" style={{ display: 'block', marginBottom: '12px' }}>3. Payment Method</label>
              <div style={{ 
                padding: '16px 20px', 
                borderRadius: 'var(--rounded-md)', 
                border: '2px solid var(--color-primary)', 
                backgroundColor: 'var(--color-surface-pearl)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p className="caption-strong" style={{ color: 'var(--color-primary)' }}>Pay on Visit</p>
                  <p className="caption" style={{ color: 'var(--color-ink-muted-80)' }}>Pay after your consultation at the clinic</p>
                </div>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '50%', 
                  border: '6px solid var(--color-primary)',
                  backgroundColor: 'white'
                }}></div>
              </div>
            </div>

            <button 
              className="button-primary" 
              style={{ width: '100%', padding: '16px', fontSize: '16px' }}
              onClick={handleBook}
              disabled={bookingLoading}
            >
              {bookingLoading ? 'Processing...' : 'Confirm and Book Appointment'}
            </button>
            <p className="caption" style={{ textAlign: 'center', marginTop: '16px', color: 'var(--color-ink-muted-80)' }}>
              No payment required at this step. Pay at the clinic.
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default BookAppointment;
