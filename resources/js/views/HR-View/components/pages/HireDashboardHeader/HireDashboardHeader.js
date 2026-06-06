import React from 'react';
import './HireDashboardHeader.scss';

const HireDashboardHeader = () => {
  const company = localStorage.getItem('user_company') || 'Your Company';

  return (
    <section className="hire-dashboard-header-section">
      <div className="hire-header-text">
        <h1>Welcome, <span className="hire-accent">{company}</span></h1>
        <p>Here's what's happening with your job postings today.</p>
      </div>
    </section>
  );
};

export default HireDashboardHeader;
