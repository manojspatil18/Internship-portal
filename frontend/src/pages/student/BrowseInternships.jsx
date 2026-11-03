import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import InternshipCard from '../../components/InternshipCard';

export default function BrowseInternships() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [applyMsg, setApplyMsg] = useState('');
  const [applyError, setApplyError] = useState('');

  const fetchInternships = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get('/internships', { params });
      setInternships(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInternships(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInternships({ search, type: typeFilter });
  };

  const handleApply = (internship) => {
    setSelectedInternship(internship);
    setCoverLetter('');
    setResumeFile(null);
    setApplyMsg('');
    setApplyError('');
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    setApplying(true);
    setApplyError('');
    try {
      await api.post('/applications', {
        internshipId: selectedInternship._id || selectedInternship.id,
        coverLetter,
      });
      setApplyMsg('✅ Application submitted successfully!');
      setTimeout(() => {
        setSelectedInternship(null);
        navigate('/student/applications');
      }, 1500);
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to apply. Try again.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <div className="section-header mb-4">
          <div>
            <h2>🔍 Browse Internships</h2>
            <p style={{ marginTop: '0.3rem', fontSize: '0.88rem' }}>Find the perfect opportunity that matches your skills</p>
          </div>
          <span className="badge badge-purple">{internships.length} listings</span>
        </div>

        {/* Search Bar */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            className="form-input"
            placeholder="🔍 Search by role, company, or skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="form-select" style={{ width: 'auto' }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          <button className="btn btn-primary" type="submit">Search</button>
          <button className="btn btn-outline" type="button" onClick={() => { setSearch(''); setTypeFilter(''); fetchInternships(); }}>Clear</button>
        </form>

        {/* Listings */}
        {loading ? (
          <div className="loading-container"><div className="spinner"></div><p>Loading internships...</p></div>
        ) : internships.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No internships found</h3>
            <p>Try changing your search terms or check back later</p>
          </div>
        ) : (
          <div className="grid-2">
            {internships.map(internship => (
              <InternshipCard
                key={internship.id || internship._id}
                internship={internship}
                actionLabel="Apply Now"
                onAction={handleApply}
              />
            ))}
          </div>
        )}

        {/* Apply Modal */}
        {selectedInternship && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelectedInternship(null)}>
            <div className="modal">
              <div className="modal-header">
                <h3>Apply: {selectedInternship.title}</h3>
                <button className="modal-close" onClick={() => setSelectedInternship(null)}>✕</button>
              </div>

              <div style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 'var(--radius-md)', padding: '0.9rem 1.1rem', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.85rem' }}>
                  🏢 <strong style={{ color: 'var(--text-primary)' }}>{selectedInternship.companyName}</strong> •
                  📍 {selectedInternship.location} •
                  💰 {selectedInternship.stipend === 'Unpaid' ? 'Unpaid' : `₹${selectedInternship.stipend}/mo`}
                </p>
              </div>

              {applyMsg && <div className="alert alert-success mb-4">{applyMsg}</div>}
              {applyError && <div className="alert alert-error mb-4">{applyError}</div>}

              <form onSubmit={submitApplication} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div className="form-group">
                  <label className="form-label">Cover Letter</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Tell us why you're perfect for this role..."
                    value={coverLetter}
                    onChange={e => setCoverLetter(e.target.value)}
                    rows={5}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Resume (PDF)</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={e => setResumeFile(e.target.files[0])}
                    style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.04)', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Max 5MB PDF. Leave empty to use saved resume.</small>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setSelectedInternship(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={applying}>
                    {applying ? '⏳ Submitting...' : '🚀 Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
