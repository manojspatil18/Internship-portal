import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function CompanyLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/company/login', form);
      login(data.user, data.token);
      navigate('/company/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <div className="icon" style={{ background: 'linear-gradient(135deg, #f77bff, #ff8c42)' }}>🏢</div>
          <h2>Company Login</h2>
          <p style={{ marginTop: '0.4rem', fontSize: '0.88rem' }}>Manage your internships and find talent</p>
        </div>

        {error && <div className="alert alert-error mb-4">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Work Email</label>
            <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="hr@company.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
          </div>
          <button
            className="btn btn-primary btn-full btn-lg"
            type="submit"
            disabled={loading}
            style={{ background: 'linear-gradient(135deg, #f77bff, #ff8c42)', boxShadow: '0 4px 20px rgba(247,123,255,0.4)' }}
          >
            {loading ? '⏳ Signing in...' : '🔑 Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <button onClick={() => navigate('/company/register')}>Register your company</button>
          {' '}|{' '}
          <button onClick={() => navigate('/')}>← Home</button>
        </div>
      </div>
    </div>
  );
}
