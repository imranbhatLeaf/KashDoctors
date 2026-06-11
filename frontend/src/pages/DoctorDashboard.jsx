import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const { user, token, logout } = useAuth();

  // Profile fields state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    specialization: user?.specialization || '',
    experience: user?.experience || '',
    fees: user?.fees || '',
    about: user?.about || '',
    certificationNo: user?.certificationNo || '',
    image: user?.image || '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.image || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return profileData.image;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post(
        `${API_URL}/doctors/upload-image`,
        formData,
        {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data.data;
    } catch (err) {
      console.error('Upload failed', err);
      throw new Error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        specialization: user.specialization || '',
        experience: user.experience || '',
        fees: user.fees || '',
        about: user.about || '',
        certificationNo: user.certificationNo || '',
        image: user.image || '',
      });
      setImagePreview(user.image || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`${API_URL}/appointments/doctor-appointments`, {
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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      let imageUrl = profileData.image;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      await axios.put(`${API_URL}/doctors/profile`, { ...profileData, image: imageUrl }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Profile updated successfully!');
      setTimeout(() => setShowProfileSetup(false), 2000);
    } catch (err) {
      setMessage(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.put(`${API_URL}/appointments/complete/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(appointments.map((a) => a._id === id ? { ...a, status: 'completed' } : a));
    } catch (err) {
      alert('Failed to complete appointment');
    }
  };

  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const recentAppointments = appointments.slice(0, 10); // Show recent 10

  // Render pending or rejected state
  if (user?.status === 'pending') {
    return (
      <Layout title={`Doctor Dashboard - Pending Approval`}>
        <div className="section-padding" style={{ maxWidth: '600px', margin: '80px auto', padding: '40px 22px', textAlign: 'center', backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-lg)', border: '1px solid var(--color-hairline)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '48px', marginBottom: '24px', display: 'block' }}>⏳</span>
          <h2 className="display-sm" style={{ marginBottom: '16px' }}>Account Pending Approval</h2>
          <p className="body" style={{ color: 'var(--color-ink-muted-80)', marginBottom: '24px', lineHeight: '1.6', fontSize: '15px' }}>
            Thank you for registering, <strong>{user.name}</strong>! Your application is currently under review by the administrator. 
            We will verify your medical license number (<strong>{user.certificationNo || 'Not Provided'}</strong>) and doctor profile information shortly.
          </p>
          <button className="button-dark-utility" onClick={logout} style={{ padding: '10px 24px' }}>Sign Out</button>
        </div>
      </Layout>
    );
  }

  if (user?.status === 'rejected') {
    return (
      <Layout title={`Doctor Dashboard - Access Denied`}>
        <div className="section-padding" style={{ maxWidth: '600px', margin: '80px auto', padding: '40px 22px', textAlign: 'center', backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-lg)', border: '1px solid var(--color-hairline)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '48px', marginBottom: '24px', display: 'block' }}>❌</span>
          <h2 className="display-sm" style={{ marginBottom: '16px', color: '#ff4d4f' }}>Application Disapproved</h2>
          <p className="body" style={{ color: 'var(--color-ink-muted-80)', marginBottom: '24px', lineHeight: '1.6', fontSize: '15px' }}>
            We regret to inform you that your doctor registration request has been disapproved. Please check that your details and medical certification are correct, or contact support for further inquiries.
          </p>
          <button className="button-dark-utility" onClick={logout} style={{ padding: '10px 24px' }}>Sign Out</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title={`Doctor Dashboard - ${user?.name}`} 
      actionLabel={showProfileSetup ? "Back to Dashboard" : "Setup Profile"}
      onAction={() => setShowProfileSetup(!showProfileSetup)}
    >
      <div className="section-padding" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 22px' }}>
        
        {showProfileSetup ? (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="display-sm" style={{ marginBottom: '32px' }}>Complete Your Professional Profile</h2>
            <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', backgroundColor: 'var(--color-canvas)', padding: '40px', borderRadius: 'var(--rounded-lg)', border: '1px solid var(--color-hairline)' }}>
              
              <div style={{ gridColumn: '1 / -1' }}>
                {message && <div style={{ padding: '12px', borderRadius: 'var(--rounded-md)', backgroundColor: message.includes('success') ? '#e6f4ea' : '#fce8e6', color: message.includes('success') ? '#1e7e34' : '#d93025', marginBottom: '24px' }}>{message}</div>}
              </div>

              {/* Image Upload Section */}
              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#f0f0f0', border: '1px solid var(--color-hairline)' }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: '#ccc' }}>
                      👤
                    </div>
                  )}
                </div>
                <div>
                  <label className="caption-strong" style={{ display: 'block', marginBottom: '8px' }}>Profile Picture</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ fontSize: '14px' }}
                  />
                  <p className="caption" style={{ color: 'var(--color-ink-muted-80)', marginTop: '4px' }}>Recommended: Square image, max 2MB</p>
                </div>
              </div>

              <div>
                <label className="caption-strong" style={{ display: 'block', marginBottom: '8px' }}>Full Name</label>
                <input 
                  type="text" 
                  value={profileData.name} 
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--rounded-md)', border: '1px solid var(--color-hairline)', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label className="caption-strong" style={{ display: 'block', marginBottom: '8px' }}>Phone Number</label>
                <input 
                  type="text" 
                  value={profileData.phone} 
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--rounded-md)', border: '1px solid var(--color-hairline)', outline: 'none' }}
                />
              </div>

              <div>
                <label className="caption-strong" style={{ display: 'block', marginBottom: '8px' }}>Specialization</label>
                <select 
                  value={profileData.specialization} 
                  onChange={(e) => setProfileData({...profileData, specialization: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--rounded-md)', border: '1px solid var(--color-hairline)', outline: 'none' }}
                >
                  <option value="">Select Specialization</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Pediatricians">Pediatricians</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Gastroenterologist">Gastroenterologist</option>
                </select>
              </div>

              <div>
                <label className="caption-strong" style={{ display: 'block', marginBottom: '8px' }}>Experience (Years)</label>
                <input 
                  type="number" 
                  value={profileData.experience} 
                  onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--rounded-md)', border: '1px solid var(--color-hairline)', outline: 'none' }}
                />
              </div>

              <div>
                <label className="caption-strong" style={{ display: 'block', marginBottom: '8px' }}>Consultation Fees ($)</label>
                <input 
                  type="number" 
                  value={profileData.fees} 
                  onChange={(e) => setProfileData({...profileData, fees: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--rounded-md)', border: '1px solid var(--color-hairline)', outline: 'none' }}
                />
              </div>

              <div>
                <label className="caption-strong" style={{ display: 'block', marginBottom: '8px' }}>Certification / License Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. MC-123456"
                  value={profileData.certificationNo} 
                  onChange={(e) => setProfileData({...profileData, certificationNo: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--rounded-md)', border: '1px solid var(--color-hairline)', outline: 'none' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label className="caption-strong" style={{ display: 'block', marginBottom: '8px' }}>Professional Bio / About</label>
                <textarea 
                  rows="4"
                  value={profileData.about} 
                  onChange={(e) => setProfileData({...profileData, about: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--rounded-md)', border: '1px solid var(--color-hairline)', outline: 'none', resize: 'none' }}
                  placeholder="Describe your medical background, education, and patient care philosophy..."
                />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" className="button-primary" style={{ flex: 1 }} disabled={saving || uploading}>
                  {uploading ? 'Uploading Image...' : saving ? 'Saving Profile...' : 'Save Profile Details'}
                </button>
                <button type="button" onClick={() => setShowProfileSetup(false)} className="button-dark-utility" style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Statistics Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '48px' }}>
              <div style={{ padding: '24px', backgroundColor: 'var(--color-surface-pearl)', borderRadius: 'var(--rounded-lg)', border: '1px solid var(--color-hairline)' }}>
                <p className="caption-strong" style={{ color: 'var(--color-ink-muted-80)' }}>Pending Requests</p>
                <p className="display-md">{pendingAppointments.length}</p>
              </div>
              <div style={{ padding: '24px', backgroundColor: 'var(--color-surface-pearl)', borderRadius: 'var(--rounded-lg)', border: '1px solid var(--color-hairline)' }}>
                <p className="caption-strong" style={{ color: 'var(--color-ink-muted-80)' }}>Today's Sessions</p>
                <p className="display-md">{appointments.filter(a => a.status === 'confirmed').length}</p>
              </div>
              <div style={{ padding: '24px', backgroundColor: 'var(--color-surface-pearl)', borderRadius: 'var(--rounded-lg)', border: '1px solid var(--color-hairline)' }}>
                <p className="caption-strong" style={{ color: 'var(--color-ink-muted-80)' }}>Completed</p>
                <p className="display-md">{appointments.filter(a => a.status === 'completed').length}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px' }}>
              
              {/* Main Appointment List */}
              <div>
                <h2 className="display-sm" style={{ marginBottom: '24px' }}>Upcoming Appointments</h2>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {appointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled').map((appt) => (
                      <div key={appt._id} style={{ 
                        padding: '20px 24px', 
                        backgroundColor: 'var(--color-canvas)', 
                        border: '1px solid var(--color-hairline)', 
                        borderRadius: 'var(--rounded-md)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'transform 0.2s',
                        cursor: 'default'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <p className="body-strong">{appt.patient?.name}</p>
                            {appt.status === 'pending' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff4d4f' }}></span>}
                          </div>
                          <p className="caption" style={{ color: 'var(--color-ink-muted-80)' }}>{appt.slotDate} at {appt.slotTime} • <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>{appt.paymentMethod === 'pay_on_visit' ? 'Pay on Visit' : 'Online'}</span></p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span className="caption-strong" style={{ 
                            padding: '4px 12px', 
                            borderRadius: 'var(--rounded-pill)', 
                            backgroundColor: appt.status === 'pending' ? '#fff1f0' : '#e6f7ff',
                            color: appt.status === 'pending' ? '#cf1322' : '#096dd9',
                            fontSize: '11px'
                          }}>
                            {appt.status.toUpperCase()}
                          </span>
                          {appt.status === 'pending' && (
                            <button className="button-primary" style={{ fontSize: '12px', padding: '6px 16px' }} onClick={() => handleComplete(appt._id)}>Mark Completed</button>
                          )}
                        </div>
                      </div>
                    ))}
                    {appointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled').length === 0 && (
                      <div style={{ padding: '48px', textAlign: 'center', backgroundColor: 'var(--color-surface-pearl)', borderRadius: 'var(--rounded-lg)', border: '1px dashed var(--color-hairline)' }}>
                        <p className="body-strong" style={{ color: 'var(--color-ink-muted-80)' }}>No active appointments</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Activity Sidebar */}
              <div>
                <h3 className="display-xs" style={{ marginBottom: '24px' }}>Recent Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {recentAppointments.map(appt => (
                    <div key={appt._id} style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: appt.status === 'completed' ? '#52c41a' : appt.status === 'cancelled' ? '#ff4d4f' : '#1890ff', marginTop: '6px' }}></div>
                      <div>
                        <p className="caption-strong">{appt.status === 'completed' ? 'Session Completed' : appt.status === 'cancelled' ? 'Appointment Cancelled' : 'New Appointment'}</p>
                        <p className="caption" style={{ color: 'var(--color-ink-muted-80)' }}>{appt.patient?.name} - {appt.slotDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
