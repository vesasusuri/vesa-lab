import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { HireDashboardProvider } from './HireDashboardContext';
import HireDashboardSidebar from './components/pages/HireDashboardSidebar/HireDashboardSidebar';
import HireDashboardTopBar from './components/pages/HireDashboardTopBar/HireDashboardTopBar';

const HRViewLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <HireDashboardProvider>
      <div className="hire-layout">
        <HireDashboardSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="hire-layout-content">
          <HireDashboardTopBar onOpenSidebar={() => setSidebarOpen(true)} />
          <Outlet />
        </div>
      </div>
    </HireDashboardProvider>
  );
};

export default HRViewLayout;
