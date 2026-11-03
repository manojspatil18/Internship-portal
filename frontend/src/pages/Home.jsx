import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    // Redirect logged in users
    setTimeout(() => navigate(user.role === 'student' ? '/student/dashboard' : '/company/dashboard'), 100);
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />
        <div className="hero-content page-enter">
          <h1 className="hero-title">
            Find Your Perfect <span className="gradient-text">Internship</span>
            <br />or Hire Top Talent
          </h1>
          <p className="hero-subtitle">
            Connect students with companies for transformative internship experiences.
            Build your career or grow your team.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/student/login')}>
              🎓 I'm a Student
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/company/login')}>
              🏢 I'm a Recruiter
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Internships</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">200+</div>
              <div className="stat-label">Companies</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Students</div>
            </div>
          </div>
        </div>
      </div>

      {/* Choose Your Role Section */}
      <div style={{ padding: '5rem 1.5rem', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="text-center mb-4" style={{ marginBottom: '3rem' }}>
            <h2>Choose Your Role</h2>
            <p style={{ marginTop: '0.5rem' }}>Two dedicated interfaces for a seamless experience</p>
          </div>

          <div className="role-cards">
            <div className="role-card student-card" onClick={() => navigate('/student/register')}>
              <div className="role-icon">🎓</div>
              <h3>I'm a Student</h3>
              <p>Find internships, apply with resume, and track your application status in real-time.</p>
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                  {['Browse internship listings', 'Apply with cover letter & resume', 'Track application status'].map((f, i) => (
                    <div key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ color: 'var(--accent-green)' }}>✓</span> {f}
                    </div>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary btn-full" style={{ marginTop: '1.5rem' }}>Get Started →</button>
            </div>

            <div className="role-card company-card" onClick={() => navigate('/company/register')}>
              <div className="role-icon">🏢</div>
              <h3>I'm a Recruiter</h3>
              <p>Post internship openings, review applications, and shortlist the best candidates for your team.</p>
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                  {['Post internship listings', 'View & filter applicants', 'Accept or reject candidates'].map((f, i) => (
                    <div key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ color: 'var(--accent-green)' }}>✓</span> {f}
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="btn btn-full"
                style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, #f77bff, #ff8c42)', color: 'white', border: 'none', padding: '0.75rem 1.75rem', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-main)', fontSize: '0.9rem' }}
              >
                Get Started →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div style={{ padding: '4rem 1.5rem', background: 'var(--bg-primary)' }}>
        <div className="container text-center">
          <h2 style={{ marginBottom: '0.5rem' }}>Built with <span className="gradient-text">MERN Stack</span></h2>
          <p style={{ marginBottom: '3rem', fontSize: '0.9rem' }}>Full-stack web application using modern technologies</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { icon: '🍃', name: 'MongoDB', desc: 'Database', color: '#00ed64' },
              { icon: '⚡', name: 'Express.js', desc: 'Backend', color: '#f77bff' },
              { icon: '⚛️', name: 'React.js', desc: 'Frontend', color: '#4facfe' },
              { icon: '🟢', name: 'Node.js', desc: 'Runtime', color: '#00e9a3' },
            ].map((tech, i) => (
              <div key={i} className="glass-card" style={{ padding: '1.5rem 2rem', textAlign: 'center', minWidth: '140px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{tech.icon}</div>
                <div style={{ fontWeight: 700, color: tech.color, fontFamily: 'var(--font-display)' }}>{tech.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        padding: '1.5rem',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        🎯 InternHub — Student Internship Portal
      </footer>
    </div>
  );
}
