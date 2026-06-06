import React from 'react';
import UserDashboardLayout from '../../../components/dashboard/shared/UserDashboardLayout/UserDashboardLayout';
import DashboardMain from '../../../components/dashboard/pages/dashboard/Dashboard';

const DashboardPage = () => {
    return (
        <UserDashboardLayout>
            <DashboardMain />
        </UserDashboardLayout>
    );
};

export default DashboardPage;
