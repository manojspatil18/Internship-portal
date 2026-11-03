import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function StudentRegister() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', college: '', degree: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/student/register', form);
      login(data.user, data.token);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <div className="icon">🎓</div>
          <h2>Student Registration</h2>
          <p style={{ marginTop: '0.4rem', fontSize: '0.88rem' }}>Create your account to find internships</p>
        </div>

        {error && <div className="alert alert-error mb-4">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@college.edu" required />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input className="form-input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required minLength={6} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">College</label>
              <input className="form-input" name="college" value={form.college} onChange={handleChange} placeholder="Your College" />
            </div>
            <div className="form-group">
              <label className="form-label">Degree</label>
              <input className="form-input" name="degree" value={form.degree} onChange={handleChange} placeholder="B.Tech CSE" />
            </div>
          </div>

          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
            {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <button onClick={() => navigate('/student/login')}>Sign in</button>
          {' '}|{' '}
          <button onClick={() => navigate('/')}>← Home</button>
        </div>
      </div>
    </div>
  );
}
