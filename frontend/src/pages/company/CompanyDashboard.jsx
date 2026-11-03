import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchInternships = async () => {
    try {
      const { data } = await api.get('/internships/company/mine');
      setInternships(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInternships(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this internship? All related applications will be removed.')) return;
    setDeleting(id);
    try {
      await api.delete(`/internships/${id}`);
      setInternships(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const totalOpenings = internships.reduce((sum, i) => sum + (i.openings || 0), 0);

  return (
    <div className="page">
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div className="dashboard-header" style={{ background: 'linear-gradient(135deg, rgba(247,123,255,0.12), rgba(255,140,66,0.08))' }}>
          <div>
            <h2>Welcome, <span style={{ background: 'linear-gradient(135deg, #f77bff, #ff8c42)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name} 🏢</span></h2>
            <div className="welcome-text">Manage your internship listings and review applicants</div>
          </div>
          <button
            className="btn btn-primary btn-lg"
            style={{ background: 'linear-gradient(135deg, #f77bff, #ff8c42)', boxShadow: '0 4px 20px rgba(247,123,255,0.4)' }}
            onClick={() => navigate('/company/post')}
          >
            + Post Internship
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="number">{internships.length}</div>
            <div className="label">Active Listings</div>
          </div>
          <div className="stat-card">
            <div className="number" style={{ background: 'linear-gradient(135deg, #f77bff, #ff8c42)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {totalOpenings}
            </div>
            <div className="label">Total Openings</div>
          </div>
        </div>

        {/* Internship Listings */}
        <div className="section-header">
          <h3>📋 Your Internship Listings</h3>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/company/post')}>+ New Listing</button>
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner"></div><p>Loading your listings...</p></div>
        ) : internships.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No internships posted yet</h3>
            <p style={{ fontSize: '0.88rem', marginBottom: '1.5rem' }}>Start by posting your first internship to attract talented students.</p>
            <button
              className="btn btn-primary"
              style={{ background: 'linear-gradient(135deg, #f77bff, #ff8c42)' }}
              onClick={() => navigate('/company/post')}
            >
              Post Your First Internship
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {internships.map(internship => (
              <div key={getId(internship)} className="application-item">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <h4 style={{ margin: 0 }}>{internship.title}</h4>
                    <span className={`badge ${internship.type === 'Remote' ? 'badge-green' : internship.type === 'Hybrid' ? 'badge-purple' : 'badge-blue'}`}>
                      {internship.type}
                    </span>
                    {internship.isActive && <span className="badge badge-green">Active</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>📍 {internship.location}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>⏱️ {internship.duration}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>👥 {internship.openings} opening{internship.openings > 1 ? 's' : ''}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                      💰 {internship.stipend === 'Unpaid' ? 'Unpaid' : `₹${internship.stipend}/mo`}
                    </span>
                  </div>
                  {internship.skills?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.6rem' }}>
                      {internship.skills.slice(0, 5).map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ background: 'linear-gradient(135deg, #f77bff, #ff8c42)' }}
                    onClick={() => navigate(`/company/applications/${getId(internship)}`)}
                  >
                    👥 View Applicants
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(getId(internship))}
                    disabled={deleting === internship._id}
                  >
                    {deleting === internship._id ? '...' : '🗑️'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
