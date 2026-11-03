import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🎯 InternHub
      </Link>

      <div className="navbar-links">
        {!user ? (
          <>
            <Link to="/student/login" className="nav-link">Student Login</Link>
            <Link to="/company/login" className="nav-link">Company Login</Link>
          </>
        ) : user.role === 'student' ? (
          <>
            <Link to="/student/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/student/internships" className="nav-link">Browse</Link>
            <Link to="/student/applications" className="nav-link">My Applications</Link>
            <span style={{ marginLeft: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Hi, {user.name.split(' ')[0]}
            </span>
            <button className="btn btn-outline btn-sm" onClick={handleLogout} style={{ marginLeft: '0.5rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/company/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/company/post" className="nav-link">Post Internship</Link>
            <span style={{ marginLeft: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {user.name}
            </span>
            <button className="btn btn-outline btn-sm" onClick={handleLogout} style={{ marginLeft: '0.5rem' }}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
