import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../context/AuthContext';
import { FiActivity, FiFileText, FiGrid, FiLogOut, FiMail, FiSettings, FiUsers, FiX } from 'react-icons/fi';
import '../../shared/AdminShared.scss';
import './AdminSidebar.scss';

const mainNav = [
  { label: 'Overview', path: '/admin-dashboard', icon: FiGrid },
  { label: 'Content', path: '/admin-dashboard/content', icon: FiFileText },
  { label: 'HR Profiles', path: '/admin-dashboard/users', icon: FiUsers },
  { label: 'Logs', path: '/admin-dashboard/logs', icon: FiActivity },
  { label: 'Messages', path: '/admin-dashboard/messages', icon: FiMail },
];

const bottomNav = [
  { label: 'Settings', path: '/admin-dashboard/settings', icon: FiSettings },
];

const AdminSideBar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {open && <div className="admin-sidebar-overlay" onClick={onClose} />}
      <aside className={`admin-sidebar${open ? ' open' : ''}`}>
        <div className="admin-sidebar-top">
          <div className="admin-brand" onClick={() => navigate('/admin-dashboard')}>
            <div>
              <span>BEE HIRED</span>
              <small>Admin Console</small>
            </div>
            <button className="admin-sidebar-close" onClick={(e) => { e.stopPropagation(); onClose(); }}>
              <FiX />
            </button>
          </div>
          <nav className="admin-nav">
            {mainNav.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  className={`admin-nav-item${location.pathname === item.path ? ' active' : ''}`}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                >
                  <span className="admin-icon-badge"><Icon /></span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="admin-sidebar-divider" />
          <nav className="admin-nav">
            {bottomNav.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  className={`admin-nav-item${location.pathname === item.path ? ' active' : ''}`}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                >
                  <span className="admin-icon-badge"><Icon /></span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-user">
            <div className="admin-sidebar-avatar">AD</div>
            <div className="admin-sidebar-user-info">
              <span className="admin-sidebar-user-name">{user?.name || 'Platform Admin'}</span>
              <span className="admin-sidebar-user-role">{user?.email || 'Admin Console'}</span>
            </div>
          </div>
          <button className="admin-sidebar-signout" type="button" onClick={handleSignOut}>
            <FiLogOut />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSideBar;
