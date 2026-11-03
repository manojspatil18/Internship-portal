import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/applications/student/mine');
        const total = data.length;
        const pending = data.filter(a => a.status === 'Pending' || a.status === 'Under Review').length;
        const accepted = data.filter(a => a.status === 'Accepted').length;
        const rejected = data.filter(a => a.status === 'Rejected').length;
        setStats({ total, pending, accepted, rejected });
        setRecentApps(data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusClass = (s) => {
    if (s === 'Accepted') return 'badge status-accepted';
    if (s === 'Rejected') return 'badge status-rejected';
    if (s === 'Under Review') return 'badge status-review';
    return 'badge status-pending';
  };

  return (
    <div className="page">
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h2>Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}! 👋</span></h2>
            <div className="welcome-text">Track your internship journey from here</div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/student/internships')}>
            🔍 Browse Internships
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="number">{stats.total}</div>
            <div className="label">Total Applied</div>
          </div>
          <div className="stat-card">
            <div className="number" style={{ background: 'linear-gradient(135deg, #ffb400, #ff8c42)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.pending}</div>
            <div className="label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="number" style={{ background: 'linear-gradient(135deg, #00e9a3, #00b4d8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.accepted}</div>
            <div className="label">Accepted 🎉</div>
          </div>
          <div className="stat-card">
            <div className="number" style={{ background: 'linear-gradient(135deg, #ff4757, #ff6b81)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.rejected}</div>
            <div className="label">Rejected</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section-header">
          <h3>⚡ Quick Actions</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { icon: '🔍', label: 'Browse Internships', desc: 'Find new opportunities', path: '/student/internships', color: 'var(--accent-purple)' },
            { icon: '📋', label: 'My Applications', desc: 'Track your applications', path: '/student/applications', color: 'var(--accent-blue)' },
          ].map((action, i) => (
            <div key={i} className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => navigate(action.path)}>
              <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>{action.icon}</div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.3rem', color: action.color }}>{action.label}</h4>
              <p style={{ fontSize: '0.82rem' }}>{action.desc}</p>
            </div>
          ))}
        </div>

        {/* Recent Applications */}
        {loading ? (
          <div className="loading-container"><div className="spinner"></div><span>Loading...</span></div>
        ) : (
          <>
            <div className="section-header">
              <h3>📌 Recent Applications</h3>
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/student/applications')}>View All</button>
            </div>
            {recentApps.length === 0 ? (
              <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌟</div>
                <h3 style={{ marginBottom: '0.5rem' }}>No applications yet!</h3>
                <p style={{ fontSize: '0.88rem', marginBottom: '1.5rem' }}>Start exploring internships and apply to your dream roles.</p>
                <button className="btn btn-primary" onClick={() => navigate('/student/internships')}>Browse Internships</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {recentApps.map(app => (
                  <div key={app._id} className="application-item">
                    <div className="application-item-info">
                      <h4>{app.internship?.title || 'Internship'}</h4>
                      <p>{app.internship?.companyName} • {app.internship?.location}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                      <span className={statusClass(app.status)}>{app.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
