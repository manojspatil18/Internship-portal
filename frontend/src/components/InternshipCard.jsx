import { Link } from 'react-router-dom';

const typeColors = {
  'Remote': 'badge-green',
  'On-site': 'badge-blue',
  'Hybrid': 'badge-purple'
};

export default function InternshipCard({ internship, actionLabel, onAction, actionStyle = 'primary', showCompany = true }) {
  const initial = internship.companyName?.charAt(0).toUpperCase() || '?';

  return (
    <div className="internship-card">
      <div className="internship-card-top">
        <div className="company-info">
          <div className="company-avatar">{initial}</div>
          <div>
            <div className="internship-title">{internship.title}</div>
            {showCompany && <div className="company-name">{internship.companyName}</div>}
          </div>
        </div>
        <span className={`badge ${typeColors[internship.type] || 'badge-purple'}`}>
          {internship.type}
        </span>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {internship.description}
      </p>

      <div className="internship-meta">
        <span className="meta-item">📍 {internship.location}</span>
        <span className="meta-item">⏱️ {internship.duration}</span>
        <span className="meta-item">👥 {internship.openings} opening{internship.openings > 1 ? 's' : ''}</span>
        {internship.deadline && (
          <span className="meta-item">📅 {new Date(internship.deadline).toLocaleDateString()}</span>
        )}
      </div>

      {internship.skills?.length > 0 && (
        <div className="skills-row">
          {internship.skills.slice(0, 4).map((skill, i) => (
            <span key={i} className="skill-tag">{skill}</span>
          ))}
          {internship.skills.length > 4 && (
            <span className="skill-tag">+{internship.skills.length - 4}</span>
          )}
        </div>
      )}

      <div className="internship-footer">
        <div className="stipend">
          💰 {internship.stipend === 'Unpaid' ? 'Unpaid' : `₹${internship.stipend}/month`}
        </div>
        {actionLabel && (
          <button
            className={`btn btn-${actionStyle} btn-sm`}
            onClick={() => onAction(internship)}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
