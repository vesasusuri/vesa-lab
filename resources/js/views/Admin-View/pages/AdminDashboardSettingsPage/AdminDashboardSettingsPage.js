import React from 'react';
import AdminSideBar from '../../components/shared/Sidebar/AdminSidebar';
import AdminDashboardSettings from '../../components/pages/AdminDashboardSettings/AdminDashboardSettings';
const AdminDashboardSettingsPage = () => {
    return (
        <div>
            <AdminSideBar/>
            <AdminDashboardSettings />
        </div>
    );
};

export default AdminDashboardSettingsPage;