import React from 'react';
import UserDashboardLayout from '../../../components/dashboard/shared/UserDashboardLayout/UserDashboardLayout';
import Interviews from "../../../components/dashboard/shared/Interviews/Interviews";

const Interview = () => {
    return (
        <UserDashboardLayout>
            <Interviews />
        </UserDashboardLayout>
    );
};

export default Interview;
