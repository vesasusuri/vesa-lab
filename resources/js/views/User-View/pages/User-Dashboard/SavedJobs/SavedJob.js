import React from 'react';
import UserDashboardLayout from '../../../components/dashboard/shared/UserDashboardLayout/UserDashboardLayout';
import SavedJobs from '../../../components/dashboard/pages/saved-jobs/SavedJobs';

const SavedJob = () => {
    return (
        <UserDashboardLayout>
            <SavedJobs/>
        </UserDashboardLayout>
    );
};

export default SavedJob;
