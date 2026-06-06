import React, { useState } from 'react';
import HireDashboardHeader from '../../components/pages/HireDashboardHeader/HireDashboardHeader';
import HireDashboardStats from '../../components/pages/HireDashboardStats/HireDashboardStats';
import HireDashboardApplications from '../../components/pages/HireDashboardApplications/HireDashboardApplications';
import HireDashboardListings from '../../components/pages/HireDashboardListings/HireDashboardListings';

const HireDashboard = () => {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <>
      <HireDashboardHeader />
      <HireDashboardStats setActiveTab={setActiveTab} />
      {}
      {}
    </>
  );
};

export default HireDashboard;
