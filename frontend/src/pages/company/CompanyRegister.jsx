import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function CompanyRegister() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: '', email: '', password: '', website: '', industry: '', location: '', description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/company/register', form);
      login(data.user, data.token);
      navigate('/company/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '560px' }}>
        <div className="auth-card-header">
          <div className="icon" style={{ background: 'linear-gradient(135deg, #f77bff, #ff8c42)' }}>🏢</div>
          <h2>Company Registration</h2>
          <p style={{ marginTop: '0.4rem', fontSize: '0.88rem' }}>Post internships and find talented students</p>
        </div>

        {error && <div className="alert alert-error mb-4">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input className="form-input" name="companyName" value={form.companyName} onChange={handleChange} placeholder="Acme Corp" required />
            </div>
            <div className="form-group">
              <label className="form-label">Industry</label>
              <select className="form-select" name="industry" value={form.industry} onChange={handleChange}>
                <option value="">Select Industry</option>
                <option>Technology</option>
                <option>Finance</option>
                <option>Healthcare</option>
                <option>Education</option>
                <option>E-commerce</option>
                <option>Marketing</option>
                <option>Consulting</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Work Email *</label>
            <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="hr@company.com" required />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input className="form-input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required minLength={6} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Website</label>
              <input className="form-input" name="website" value={form.website} onChange={handleChange} placeholder="https://yourcompany.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" name="location" value={form.location} onChange={handleChange} placeholder="Bangalore, India" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Company Description</label>
            <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} placeholder="Tell students about your company..." rows={3} style={{ minHeight: '80px' }} />
          </div>

          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}
            style={{ background: 'linear-gradient(135deg, #f77bff, #ff8c42)', boxShadow: '0 4px 20px rgba(247,123,255,0.4)' }}>
            {loading ? '⏳ Creating Account...' : '🚀 Register Company'}
          </button>
        </form>

        <div className="auth-footer">
          Already registered?{' '}
          <button onClick={() => navigate('/company/login')}>Sign in</button>
          {' '}|{' '}
          <button onClick={() => navigate('/')}>← Home</button>
        </div>
      </div>
    </div>
  );
}
