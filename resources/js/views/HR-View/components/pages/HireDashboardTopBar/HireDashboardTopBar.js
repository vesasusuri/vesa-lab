import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './HireDashboardTopBar.scss';
import PostJobModal from '../PostJobModal/PostJobModal';
import { useHireDashboard } from '../../../HireDashboardContext';

const PAGE_NAMES = {
  '/hire-dashboard':                  'Overview',
  '/hire-dashboard/applications':     'Applications',
  '/hire-dashboard/listings':         'Active Listings',
  '/hire-dashboard/interviews':       'Interviews',
  '/hire-dashboard/hires':            'Hires',
  '/hire-dashboard/analytics':        'Analytics',
  '/hire-dashboard/messages':         'Messages',
  '/hire-dashboard/team':             'Team',
  '/hire-dashboard/settings':         'Settings',
};

const HireDashboardTopBar = ({ onOpenSidebar }) => {
  const { refreshListings } = useHireDashboard();
  const location   = useLocation();
  const [showPostJob,  setShowPostJob]  = useState(false);
  const pageName = PAGE_NAMES[location.pathname] || 'Dashboard';

  return (
    <>
      <div className="hire-topbar">
        <button className="hire-topbar-hamburger" onClick={onOpenSidebar} aria-label="Open menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <span className="hire-topbar-page">{pageName}</span>

        <div className="hire-topbar-right">
          {}
          <button className="hire-topbar-post-btn" onClick={() => setShowPostJob(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Post a Job
          </button>
        </div>
      </div>

      {showPostJob && (
        <PostJobModal
          onClose={() => setShowPostJob(false)}
          onPosted={refreshListings}
        />
      )}
    </>
  );
};

export default HireDashboardTopBar;
