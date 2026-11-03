import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import StudentLogin from './pages/student/StudentLogin';
import StudentRegister from './pages/student/StudentRegister';
import StudentDashboard from './pages/student/StudentDashboard';
import BrowseInternships from './pages/student/BrowseInternships';
import MyApplications from './pages/student/MyApplications';
import CompanyLogin from './pages/company/CompanyLogin';
import CompanyRegister from './pages/company/CompanyRegister';
import CompanyDashboard from './pages/company/CompanyDashboard';
import PostInternship from './pages/company/PostInternship';
import ViewApplications from './pages/company/ViewApplications';

// Protected Route Component
function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-container" style={{ paddingTop: '6rem' }}><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />

        {/* Student Auth */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />

        {/* Student Protected */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/student/internships" element={
          <ProtectedRoute role="student"><BrowseInternships /></ProtectedRoute>
        } />
        <Route path="/student/applications" element={
          <ProtectedRoute role="student"><MyApplications /></ProtectedRoute>
        } />

        {/* Company Auth */}
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/company/register" element={<CompanyRegister />} />

        {/* Company Protected */}
        <Route path="/company/dashboard" element={
          <ProtectedRoute role="company"><CompanyDashboard /></ProtectedRoute>
        } />
        <Route path="/company/post" element={
          <ProtectedRoute role="company"><PostInternship /></ProtectedRoute>
        } />
        <Route path="/company/applications/:internshipId" element={
          <ProtectedRoute role="company"><ViewApplications /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
