import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const getId = (obj) => obj?.id || obj?._id || '';

const statusClass = (s) => {
  if (s === 'Accepted') return 'badge status-accepted';
  if (s === 'Rejected') return 'badge status-rejected';
  if (s === 'Under Review') return 'badge status-review';
  return 'badge status-pending';
};

export default function ViewApplications() {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [internshipTitle, setInternshipTitle] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, internRes] = await Promise.all([
          api.get(`/applications/internship/${internshipId}`),
          api.get(`/internships/${internshipId}`)
        ]);
        setApplications(appsRes.data);
        setInternshipTitle(internRes.data.title);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [internshipId]);

  const updateStatus = async (appId, newStatus) => {
    setUpdating(appId);
    try {
      const { data } = await api.patch(`/applications/${appId}/status`, { status: newStatus });
      setApplications(prev => prev.map(a => getId(a) === appId ? { ...a, status: data.status } : a));
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(null);
    }
  };

  const counts = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'Pending').length,
    review: applications.filter(a => a.status === 'Under Review').length,
    accepted: applications.filter(a => a.status === 'Accepted').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  return (
    <div className="page">
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/company/dashboard')}>← Back to Dashboard</button>
        </div>

        <div className="dashboard-header" style={{ background: 'linear-gradient(135deg, rgba(247,123,255,0.12), rgba(255,140,66,0.08))' }}>
          <div>
            <h2>{internshipTitle || 'Internship'}</h2>
            <div className="welcome-text">Review and manage applicants below</div>
          </div>
          <span className="badge badge-orange" style={{ fontSize: '0.9rem', padding: '0.4rem 1.2rem' }}>
            {counts.total} Applicant{counts.total !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Stats */}
        <div className="stats-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
          {[
            { label: 'Total', value: counts.total, color: 'var(--gradient-main)' },
            { label: 'Pending', value: counts.pending, color: 'linear-gradient(135deg, #ffb400, #ff8c42)' },
            { label: 'Reviewing', value: counts.review, color: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
            { label: 'Accepted', value: counts.accepted, color: 'linear-gradient(135deg, #00e9a3, #00b4d8)' },
            { label: 'Rejected', value: counts.rejected, color: 'linear-gradient(135deg, #ff4757, #ff6b81)' },
          ].map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="number" style={{ background: stat.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.8rem' }}>
                {stat.value}
              </div>
              <div className="label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="loading-container"><div className="spinner"></div><p>Loading applicants...</p></div>
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No applications yet</h3>
            <p>Students haven't applied to this internship yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {applications.map(app => (
              <div key={getId(app)} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  {/* Applicant Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.7rem', flexWrap: 'wrap' }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: 'var(--gradient-main)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem', fontWeight: 700, color: 'white',
                        fontFamily: 'var(--font-display)', flexShrink: 0
                      }}>
                        {app.student?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <h4 style={{ margin: 0 }}>{app.studentName}</h4>
                        <p style={{ fontSize: '0.82rem', margin: 0 }}>{app.studentEmail}</p>
                      </div>
                      <span className={statusClass(app.status)}>{app.status}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', marginBottom: '0.7rem' }}>
                      {app.student?.college && <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>🎓 {app.student.college}</span>}
                      {app.student?.degree && <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>📚 {app.student.degree}</span>}
                      {app.student?.phone && <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>📞 {app.student.phone}</span>}
                    </div>

                    {app.student?.skills?.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.7rem' }}>
                        {app.student.skills.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
                      </div>
                    )}

                    {app.coverLetter && (
                      <div style={{
                        padding: '0.8rem 1rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.83rem',
                        color: 'var(--text-secondary)',
                        borderLeft: '3px solid var(--accent-purple)',
                        maxHeight: '100px',
                        overflow: 'hidden'
                      }}>
                        <strong style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.3rem' }}>
                          Cover Letter
                        </strong>
                        {app.coverLetter}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                      Applied: {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>

                    {app.resumeUrl && (
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                        📄 Resume
                      </a>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => updateStatus(getId(app), 'Accepted')}
                        disabled={updating === getId(app) || app.status === 'Accepted'}
                      >
                        ✅ Accept
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => updateStatus(getId(app), 'Under Review')}
                        disabled={updating === getId(app) || app.status === 'Under Review'}
                        style={{ borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)' }}
                      >
                        🔎 Review
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => updateStatus(getId(app), 'Rejected')}
                        disabled={updating === getId(app) || app.status === 'Rejected'}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
