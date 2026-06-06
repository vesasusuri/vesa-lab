import React from 'react';
import AdminSideBar from '../../components/shared/Sidebar/AdminSidebar';
import AdminDashboardOverview from '../../components/pages/AdminDashboardOverview/AdminDashboardOverview';
const AdminDashboardOverviewPage = () => {
    return (
        <div >
            <AdminSideBar/>
            <AdminDashboardOverview />
        </div>
    );
};

export default AdminDashboardOverviewPage;