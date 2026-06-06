import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from '../NotificationBell/NotificationBell';
import { useAuth } from '../../../../../../context/AuthContext';
import './UserDashboardSidebar.scss';

const mainNav = [
  {
    label: 'Overview',
    path: '/user-dashboard/dashboard',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  },
  {
    label: 'Resume',
    path: '/user-dashboard/resume',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>,
  },
  {
    label: 'Profile',
    path: '/user-dashboard/profile',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>,
  },
  {
    label: 'Applied Jobs',
    path: '/user-dashboard/applied-jobs',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M9 14l2 2 4-4"/></svg>,
  },
  {
    label: 'Saved Jobs',
    path: '/user-dashboard/saved-jobs',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  },
  {
    label: 'Interviews',
    path: '/user-dashboard/interviews',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    label: 'Messages',
    path: '/user-dashboard/messages',
    badge: 3,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  },
];

const bottomNav = [
  {
    label: 'Home',
    path: '/',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>,
  },
];

export default function UserDashboardSidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const showNotifications = user?.role === 'candidate' || !user?.role;
  const displayName = user?.name || localStorage.getItem('user_name') || 'Candidate';
  const initials = displayName.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase();

  const handleNav = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path || (path === '/user-dashboard/interviews' && location.pathname.startsWith('/user-dashboard/interviews/'));

  return (
    <>
      {!open && (
        <div className="user-dashboard-mobile-bar">
          <button className="user-dashboard-hamburger" onClick={() => setOpen(true)} aria-label="Open dashboard menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          {showNotifications && (
            <div className="user-dashboard-mobile-bar__notif">
              <NotificationBell variant="sidebar" />
            </div>
          )}
        </div>
      )}

      {open && <div className="user-dashboard-sidebar-overlay" onClick={() => setOpen(false)} />}

      <aside className={`user-dashboard-sidebar${open ? ' open' : ''}`}>
        <div className="user-dashboard-sidebar__top">
          <div className="user-dashboard-sidebar__brand" onClick={() => handleNav('/')}>
            <div className="user-dashboard-sidebar__brand-text">
              <span className="user-dashboard-sidebar__app">BEE HIRED</span>
              <span className="user-dashboard-sidebar__section">Candidate Dashboard</span>
            </div>
            <button className="user-dashboard-sidebar__close" onClick={(event) => { event.stopPropagation(); setOpen(false); }} aria-label="Close dashboard menu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {showNotifications && (
            <div className="user-dashboard-sidebar__notif-row">
              <span className="user-dashboard-sidebar__notif-label">Notifications</span>
              <NotificationBell variant="sidebar" />
            </div>
          )}

          <nav className="user-dashboard-sidebar__nav">
            {mainNav.map((item) => (
              <button
                key={item.path}
                className={`user-dashboard-sidebar__nav-item${isActive(item.path) ? ' active' : ''}`}
                onClick={() => handleNav(item.path)}
              >
                <span className="user-dashboard-sidebar__nav-icon">{item.icon}</span>
                <span className="user-dashboard-sidebar__nav-label">{item.label}</span>
                {item.badge && <span className="user-dashboard-sidebar__nav-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>

          <div className="user-dashboard-sidebar__divider" />

          <nav className="user-dashboard-sidebar__nav">
            {bottomNav.map((item) => (
              <button
                key={item.path}
                className={`user-dashboard-sidebar__nav-item${isActive(item.path) ? ' active' : ''}`}
                onClick={() => handleNav(item.path)}
              >
                <span className="user-dashboard-sidebar__nav-icon">{item.icon}</span>
                <span className="user-dashboard-sidebar__nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="user-dashboard-sidebar__bottom">
          <div className="user-dashboard-sidebar__user">
            <div className="user-dashboard-sidebar__avatar">{initials}</div>
            <div className="user-dashboard-sidebar__user-info">
              <span className="user-dashboard-sidebar__user-name">{displayName}</span>
              <span className="user-dashboard-sidebar__user-role">{user?.email || 'Candidate'}</span>
            </div>
          </div>
          <button className="user-dashboard-sidebar__signout" type="button" onClick={handleSignOut}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
