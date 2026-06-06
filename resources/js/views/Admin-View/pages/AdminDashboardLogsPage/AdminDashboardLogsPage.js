import React from 'react';
import AdminSideBar from '../../components/shared/Sidebar/AdminSidebar';
import AdminDashboardLogs from '../../components/pages/AdminDashboardLogs/AdminDashboardLogs';
const AdminDashboardLogsPage = () => {
    return (
        <div>
            <AdminSideBar/>
            <AdminDashboardLogs />
        </div>
    );
};

export default AdminDashboardLogsPage;