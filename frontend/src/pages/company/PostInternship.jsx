import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function PostInternship() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', location: '', type: 'Remote',
    stipend: '', duration: '', skills: '', openings: 1, deadline: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const skillsArray = form.skills.split(',').map(s => s.trim()).filter(Boolean);
      await api.post('/internships', {
        ...form,
        skills: skillsArray,
        openings: parseInt(form.openings),
        companyName: user?.name,
        deadline: form.deadline || null
      });
      setSuccess('✅ Internship posted successfully!');
      setTimeout(() => navigate('/company/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post internship.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '750px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/company/dashboard')}>← Back</button>
          <h2 style={{ marginTop: '1rem' }}>📝 Post New Internship</h2>
          <p style={{ marginTop: '0.3rem', fontSize: '0.88rem' }}>Fill in the details to attract the right candidates</p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          {success && <div className="alert alert-success mb-4">{success}</div>}
          {error && <div className="alert alert-error mb-4">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div className="form-group">
              <label className="form-label">Internship Title *</label>
              <input className="form-input" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Frontend Developer Intern" required />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange}
                placeholder="Describe the role, responsibilities, and what the intern will learn..." required rows={5} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Location *</label>
                <input className="form-input" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bangalore / Remote" required />
              </div>
              <div className="form-group">
                <label className="form-label">Work Type</label>
                <select className="form-select" name="type" value={form.type} onChange={handleChange}>
                  <option>Remote</option>
                  <option>On-site</option>
                  <option>Hybrid</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Duration *</label>
                <input className="form-input" name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 3 months" required />
              </div>
              <div className="form-group">
                <label className="form-label">Stipend (₹/month)</label>
                <input className="form-input" name="stipend" value={form.stipend} onChange={handleChange} placeholder="e.g. 10000 or Unpaid" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Number of Openings</label>
                <input className="form-input" type="number" name="openings" value={form.openings} onChange={handleChange} min={1} max={50} />
              </div>
              <div className="form-group">
                <label className="form-label">Application Deadline</label>
                <input className="form-input" type="date" name="deadline" value={form.deadline} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Required Skills</label>
              <input className="form-input" name="skills" value={form.skills} onChange={handleChange}
                placeholder="e.g. React, Node.js, MongoDB (comma-separated)" />
              <small style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                Separate multiple skills with commas
              </small>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-outline" onClick={() => navigate('/company/dashboard')}>Cancel</button>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                style={{ background: 'linear-gradient(135deg, #f77bff, #ff8c42)' }}
              >
                {loading ? '⏳ Posting...' : '🚀 Post Internship'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
