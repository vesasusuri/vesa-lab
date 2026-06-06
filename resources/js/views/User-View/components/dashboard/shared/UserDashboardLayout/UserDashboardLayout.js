import React from 'react';
import UserDashboardSidebar from '../UserDashboardSidebar/UserDashboardSidebar';
import './UserDashboardLayout.scss';

export default function UserDashboardLayout({ children }) {
  return (
    <div className="user-dashboard-layout">
      <UserDashboardSidebar />
      <main className="user-dashboard-layout__content">
        {children}
      </main>
    </div>
  );
}
