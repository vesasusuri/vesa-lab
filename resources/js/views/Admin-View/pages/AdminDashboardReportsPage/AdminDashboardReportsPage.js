import React from 'react';
import AdminSideBar from '../../components/shared/Sidebar/AdminSidebar';
import Stats from '../../components/shared/Reports/Stats';
import BarData from '../../components/shared/Reports/BarData';
import Applied from '../../components/shared/Reports/Applied';
const AdminDashboardReportsPage = () => {
    return (
        <div>
            <AdminSideBar/>
             <Stats/>
             <BarData/>
             <Applied/>
        </div>
    );
};

export default AdminDashboardReportsPage;