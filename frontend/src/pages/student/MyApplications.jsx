import { useEffect, useState } from 'react';
import api from '../../api/axios';

const statusClass = (s) => {
  if (s === 'Accepted') return 'badge status-accepted';
  if (s === 'Rejected') return 'badge status-rejected';
  if (s === 'Under Review') return 'badge status-review';
  return 'badge status-pending';
};

const statusIcon = (s) => {
  if (s === 'Accepted') return '✅';
  if (s === 'Rejected') return '❌';
  if (s === 'Under Review') return '🔎';
  return '⏳';
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/student/mine')
      .then(({ data }) => setApplications(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page">
      <div className="loading-container" style={{ paddingTop: '6rem' }}>
        <div className="spinner"></div>
        <p>Loading your applications...</p>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <div className="section-header mb-4">
          <div>
            <h2>📋 My Applications</h2>
            <p style={{ fontSize: '0.88rem', marginTop: '0.3rem' }}>Track the status of all your internship applications</p>
          </div>
          <span className="badge badge-purple">{applications.length} total</span>
        </div>

        {/* Status legend */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {['Pending', 'Under Review', 'Accepted', 'Rejected'].map(s => (
            <span key={s} className={statusClass(s)} style={{ padding: '0.3rem 0.9rem' }}>{statusIcon(s)} {s}</span>
          ))}
        </div>

        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No applications yet</h3>
            <p>You haven't applied to any internships. Start browsing!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {applications.map(app => (
              <div key={app._id} className="application-item">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <h4 style={{ margin: 0 }}>{app.internship?.title || 'Internship Deleted'}</h4>
                    <span className={statusClass(app.status)}>{statusIcon(app.status)} {app.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span className="meta-item" style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                      🏢 {app.internship?.companyName || 'N/A'}
                    </span>
                    <span className="meta-item" style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                      📍 {app.internship?.location || 'N/A'}
                    </span>
                    <span className="meta-item" style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                      ⏱️ {app.internship?.duration || 'N/A'}
                    </span>
                    <span className="meta-item" style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                      💰 {app.internship?.stipend === 'Unpaid' ? 'Unpaid' : app.internship?.stipend ? `₹${app.internship.stipend}/mo` : 'N/A'}
                    </span>
                  </div>

                  {app.coverLetter && (
                    <div style={{
                      marginTop: '0.7rem',
                      padding: '0.7rem 1rem',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      borderLeft: '3px solid var(--accent-purple)'
                    }}>
                      <strong style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cover Letter:</strong>
                      <div style={{ marginTop: '0.3rem', whiteSpace: 'pre-wrap', maxHeight: '80px', overflow: 'hidden' }}>
                        {app.coverLetter}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Applied</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  {app.resumeUrl && (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ marginTop: '0.5rem', display: 'inline-flex' }}
                    >
                      📄 Resume
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
