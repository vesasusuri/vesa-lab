import React from 'react';
import './HireDashboardSidebar.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../../context/AuthContext';
import { useHireDashboard } from '../../../HireDashboardContext';

const mainNav = [
  {
    label: 'Overview', path: '/hire-dashboard',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  },
  {
    label: 'Applications', path: '/hire-dashboard/applications', badgeKey: 'applications',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  },
  {
    label: 'Active Listings', path: '/hire-dashboard/listings',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>,
  },
  {
    label: 'Interviews', path: '/hire-dashboard/interviews',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    label: 'Hires', path: '/hire-dashboard/hires',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>,
  },
  {
    label: 'Analytics', path: '/hire-dashboard/analytics',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  },
  {
    label: 'Messages', path: '/hire-dashboard/messages', badgeKey: 'messages',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  },
];

const bottomNav = [
  {
    label: 'Team', path: '/hire-dashboard/team',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    label: 'Settings', path: '/hire-dashboard/settings',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  },
];

const HireDashboardSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { apps } = useHireDashboard();
  const company = localStorage.getItem('user_company') || user?.company || 'Your Company';

const reviewingCount = apps.filter((a) => a.status === 'Reviewing').length;
  const badges = {
    applications: reviewingCount || null,
    messages:     null,
  };
  const initials = company.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {open && <div className="hire-sidebar-overlay" onClick={onClose} />}

      <aside className={`hire-sidebar${open ? ' open' : ''}`}>
        <div className="hire-sidebar-top">

          <div className="hire-sidebar-brand" onClick={() => handleNav('/')} style={{ cursor: 'pointer' }}>
            <div className="hire-sidebar-brand-text">
              <span className="hire-sidebar-app">BEE HIRED</span>
              <span className="hire-sidebar-company">{company}</span>
            </div>
            <button className="hire-sidebar-close" onClick={(e) => { e.stopPropagation(); onClose(); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <nav className="hire-sidebar-nav">
            {mainNav.map((item) => (
              <button
                key={item.path}
                className={`hire-nav-item${location.pathname === item.path ? ' active' : ''}`}
                onClick={() => handleNav(item.path)}
              >
                <span className="hire-nav-icon">{item.icon}</span>
                <span className="hire-nav-label">{item.label}</span>
                {item.badgeKey && badges[item.badgeKey] ? <span className="hire-nav-badge">{badges[item.badgeKey]}</span> : null}
              </button>
            ))}
          </nav>

          <div className="hire-sidebar-divider" />

          <nav className="hire-sidebar-nav">
            {bottomNav.map((item) => (
              <button
                key={item.path}
                className={`hire-nav-item${location.pathname === item.path ? ' active' : ''}`}
                onClick={() => handleNav(item.path)}
              >
                <span className="hire-nav-icon">{item.icon}</span>
                <span className="hire-nav-label">{item.label}</span>
              </button>
            ))}
            <button
              className="hire-nav-item hire-nav-home"
              onClick={() => handleNav('/')}
            >
              <span className="hire-nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </span>
              <span className="hire-nav-label">Home</span>
            </button>
          </nav>
        </div>

        <div className="hire-sidebar-bottom">
          <div className="hire-sidebar-user">
            <div className="hire-sidebar-avatar">{initials}</div>
            <div className="hire-sidebar-user-info">
              <span className="hire-sidebar-user-name">{user?.name || 'Hiring Team'}</span>
              <span className="hire-sidebar-user-role">{user?.email || ''}</span>
            </div>
          </div>
          <button className="hire-sidebar-signout" type="button" onClick={handleSignOut}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default HireDashboardSidebar;