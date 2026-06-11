import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useAuth();

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/doctors/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleApprove = async (id) => {
    try {
      await axios.put(`${API_URL}/doctors/admin/status/${id}`, { status: 'approved' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(u => u._id === id ? { ...u, status: 'approved' } : u));
    } catch (err) {
      alert('Failed to approve doctor');
    }
  };

  const handleDisapprove = async (id) => {
    try {
      await axios.put(`${API_URL}/doctors/admin/status/${id}`, { status: 'rejected' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(u => u._id === id ? { ...u, status: 'rejected' } : u));
    } catch (err) {
      alert('Failed to disapprove doctor');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) return;
    try {
      await axios.delete(`${API_URL}/doctors/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert('Failed to delete doctor');
    }
  };

  const pendingDoctors = users.filter(u => u.status === 'pending');
  const managedDoctors = users.filter(u => u.status !== 'pending');

  return (
    <Layout 
      title="Admin Control Center" 
      actionLabel="Sign Out" 
      onAction={logout}
    >
      <div className="section-padding" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 22px' }}>
        
        {/* Header Statistics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          <div style={{ padding: '24px', backgroundColor: 'var(--color-surface-pearl)', borderRadius: 'var(--rounded-lg)', border: '1px solid var(--color-hairline)' }}>
            <p className="caption-strong" style={{ color: 'var(--color-ink-muted-80)' }}>Total Applications</p>
            <p className="display-md">{users.length}</p>
          </div>
          <div style={{ padding: '24px', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--rounded-lg)', border: '1px solid rgba(239, 68, 68, 0.16)' }}>
            <p className="caption-strong" style={{ color: 'var(--color-danger, #ef4444)' }}>Pending Approval</p>
            <p className="display-md" style={{ color: 'var(--color-danger, #ef4444)' }}>{pendingDoctors.length}</p>
          </div>
          <div style={{ padding: '24px', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: 'var(--rounded-lg)', border: '1px solid rgba(16, 185, 129, 0.16)' }}>
            <p className="caption-strong" style={{ color: 'var(--color-success, #10b981)' }}>Approved Specialists</p>
            <p className="display-md" style={{ color: 'var(--color-success, #10b981)' }}>{users.filter(u => u.status === 'approved').length}</p>
          </div>
        </div>

        {/* Section 1: Pending Approvals */}
        <div style={{ marginBottom: '56px' }}>
          <h3 className="display-sm" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>Approval Requests</span>
            {pendingDoctors.length > 0 && (
              <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'var(--color-danger, #ef4444)', color: '#fff', borderRadius: '10px' }}>
                {pendingDoctors.length} New
              </span>
            )}
          </h3>

          {loading ? (
            <p>Loading application requests...</p>
          ) : pendingDoctors.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--color-surface-pearl)', borderRadius: 'var(--rounded-lg)', border: '1px dashed var(--color-hairline)' }}>
              <p className="body-strong" style={{ color: 'var(--color-ink-muted-80)' }}>No pending approval requests</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
              {pendingDoctors.map(doc => (
                <div 
                  key={doc._id} 
                  style={{ 
                    backgroundColor: 'var(--color-canvas)', 
                    border: '1px solid var(--color-hairline)', 
                    borderRadius: 'var(--rounded-lg)', 
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                      <div>
                        <h4 className="body-strong" style={{ fontSize: '18px', margin: 0 }}>{doc.name}</h4>
                        <p className="caption" style={{ color: 'var(--color-ink-muted-80)' }}>{doc.email} • {doc.phone || 'No phone'}</p>
                      </div>
                      <span style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: 'rgba(99, 102, 241, 0.08)', color: 'var(--color-primary)', borderRadius: 'var(--rounded-sm)', fontWeight: '600' }}>
                        {doc.specialization}
                      </span>
                    </div>

                    <div style={{ backgroundColor: 'var(--color-surface-pearl)', padding: '12px', borderRadius: 'var(--rounded-sm)', marginBottom: '16px' }}>
                      <p className="caption" style={{ margin: '0 0 4px 0' }}><strong>License / Certification No:</strong></p>
                      <code style={{ fontSize: '14px', color: 'var(--color-text-dark)', fontWeight: '600' }}>{doc.certificationNo || 'N/A'}</code>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <p className="caption" style={{ margin: '0 0 4px 0' }}><strong>Experience:</strong> {doc.experience} Years • <strong>Fees:</strong> ${doc.fees}</p>
                      <p className="caption" style={{ margin: 0, fontStyle: 'italic', color: 'var(--color-ink-muted-80)', lineHeight: '1.4' }}>"{doc.about || 'No bio provided'}"</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <button 
                      onClick={() => handleApprove(doc._id)} 
                      style={{ 
                        flex: 1, 
                        padding: '10px', 
                        backgroundColor: '#10b981', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: 'var(--rounded-sm)', 
                        fontWeight: '600', 
                        cursor: 'pointer' 
                      }}
                    >
                      Approve Doctor
                    </button>
                    <button 
                      onClick={() => handleDisapprove(doc._id)} 
                      style={{ 
                        flex: 1, 
                        padding: '10px', 
                        backgroundColor: 'transparent', 
                        color: '#ef4444', 
                        border: '1px solid #ef4444', 
                        borderRadius: 'var(--rounded-sm)', 
                        fontWeight: '600', 
                        cursor: 'pointer' 
                      }}
                    >
                      Disapprove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Active & Managed Doctors */}
        <div>
          <h3 className="display-sm" style={{ marginBottom: '24px' }}>All Registered Doctors</h3>

          {loading ? (
            <p>Loading doctors database...</p>
          ) : managedDoctors.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--color-surface-pearl)', borderRadius: 'var(--rounded-lg)', border: '1px dashed var(--color-hairline)' }}>
              <p className="body-strong" style={{ color: 'var(--color-ink-muted-80)' }}>No active specialists registered in system</p>
            </div>
          ) : (
            <div style={{ backgroundColor: 'var(--color-canvas)', border: '1px solid var(--color-hairline)', borderRadius: 'var(--rounded-lg)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-canvas-parchment)', textAlign: 'left' }}>
                    <th style={{ padding: '16px' }}>Name</th>
                    <th style={{ padding: '16px' }}>Specialty & License</th>
                    <th style={{ padding: '16px' }}>Contact Info</th>
                    <th style={{ padding: '16px' }}>Status</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managedDoctors.map((doc) => (
                    <tr key={doc._id} style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                      <td style={{ padding: '16px' }}>
                        <p className="body-strong" style={{ margin: 0 }}>{doc.name}</p>
                        <p className="caption" style={{ margin: 0, color: 'var(--color-ink-muted-80)' }}>Exp: {doc.experience} Years</p>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <p className="body" style={{ margin: 0, fontSize: '14px' }}>{doc.specialization}</p>
                        <code style={{ fontSize: '12px' }}>{doc.certificationNo || 'No License'}</code>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <p className="body" style={{ margin: 0, fontSize: '14px' }}>{doc.email}</p>
                        <p className="caption" style={{ margin: 0, color: 'var(--color-ink-muted-80)' }}>{doc.phone || 'No Phone'}</p>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ 
                          fontSize: '11px', 
                          padding: '4px 10px', 
                          borderRadius: '12px',
                          fontWeight: '600',
                          backgroundColor: doc.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: doc.status === 'approved' ? '#10b981' : '#ef4444'
                        }}>
                          {doc.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          {doc.status === 'rejected' && (
                            <button 
                              onClick={() => handleApprove(doc._id)} 
                              className="button-dark-utility" 
                              style={{ fontSize: '12px', padding: '6px 12px', borderColor: '#10b981', color: '#10b981' }}
                            >
                              Re-Approve
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(doc._id)} 
                            className="button-dark-utility" 
                            style={{ fontSize: '12px', padding: '6px 12px', borderColor: '#ef4444', color: '#ef4444' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default AdminDashboard;
