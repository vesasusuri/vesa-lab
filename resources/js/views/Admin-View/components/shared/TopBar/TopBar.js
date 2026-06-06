import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiMenu } from 'react-icons/fi';
import '../../shared/AdminShared.scss';
import './TopBar.scss';

const names = {
  '/admin-dashboard': 'Admin Overview',
  '/admin-dashboard/content': 'Content',
  '/admin-dashboard/users': 'HR Profiles',
  '/admin-dashboard/logs': 'Activity Logs',
  '/admin-dashboard/settings': 'Platform Settings',
  '/admin-dashboard/team': 'Team Members',
  '/admin-dashboard/pricing': 'Pricing Plans',
};

const backLinks = {
  '/admin-dashboard/team': { label: 'About Us', path: '/admin-dashboard/content' },
  '/admin-dashboard/pricing': { label: 'Pricing', path: '/admin-dashboard/content' },
};

const TopBar = ({ onOpenSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const back = backLinks[location.pathname];

  return (
    <header className="admin-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="admin-topbar-hamburger" onClick={onOpenSidebar} aria-label="Open menu">
          <FiMenu />
        </button>
        {back && (
          <button className="admin-btn admin-btn-light" onClick={() => navigate(back.path)} style={{ padding: '6px 12px' }}>
            <FiArrowLeft />
          </button>
        )}
        <span className="admin-topbar-page">{names[location.pathname] || 'Admin Dashboard'}</span>
      </div>
      {location.pathname !== '/admin-dashboard/users' && (
        <button
          type="button"
          className="admin-btn admin-btn-accent admin-topbar-invite"
          onClick={() => navigate('/admin-dashboard/users')}
        >
          <FiMail />
          <span>Invite HR</span>
        </button>
      )}
    </header>
  );
};

export default TopBar;
