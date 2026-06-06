import React from 'react';
import UserDashboardLayout from '../../../components/dashboard/shared/UserDashboardLayout/UserDashboardLayout';
import AppliedJobs from '../../../components/dashboard/pages/applied-jobs/AppliedJobs';

const AppliedJob = () => {
    return (
        <UserDashboardLayout>
            <AppliedJobs/>
        </UserDashboardLayout>
    );
};

export default AppliedJob;
