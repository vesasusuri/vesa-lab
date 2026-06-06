import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import './components/shared/AdminShared.scss';
import TopBar from './components/shared/TopBar/TopBar';
import AdminSideBar from './components/shared/Sidebar/AdminSidebar';

const AdminViewLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <AdminSideBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-layout-content">
        <TopBar onOpenSidebar={() => setSidebarOpen(true)} />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminViewLayout;
