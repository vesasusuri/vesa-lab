import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchHrApplications, updateHrApplicationStatus } from '../../api/hrApi';

export const HireDashboardContext = createContext(null);

export const HireDashboardProvider = ({ children }) => {
  const [apps, setApps]               = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [listingsVersion, setListingsVersion] = useState(0);
  const [hiresVersion,    setHiresVersion]    = useState(0);
  const [jobFilter, setJobFilter]             = useState(null); 

  const refreshListings = () => setListingsVersion((v) => v + 1);
  const refreshHires    = () => setHiresVersion((v) => v + 1);
  const clearJobFilter  = () => setJobFilter(null);

  const loadApps = useCallback(async () => {
    setAppsLoading(true);
    try {
      const data = await fetchHrApplications();
      setApps(data);
    } catch {
      setApps([]);
    } finally {
      setAppsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  const changeAppStatus = useCallback(async (id, status) => {
    const prev = apps.find((a) => a.id === id);
    const wasHired = prev?.status === 'Hired';
    const willBeHired = status.toLowerCase() === 'hired';

    setApps((prev) =>
      prev.map((a) => a.id === id ? { ...a, status: status.charAt(0).toUpperCase() + status.slice(1) } : a)
    );
    try {
      await updateHrApplicationStatus(id, status.toLowerCase());
      if (wasHired || willBeHired) refreshHires();
    } catch {
      loadApps();
    }
  }, [apps, loadApps]);

  const shortlistedCandidates = useMemo(
    () => apps.filter((a) => a.status === 'Shortlisted'),
    [apps]
  );

  return (
    <HireDashboardContext.Provider value={{
      apps,
      setApps,
      appsLoading,
      loadApps,
      changeAppStatus,
      shortlistedCandidates,
      listingsVersion,
      refreshListings,
      hiresVersion,
      refreshHires,
      jobFilter,
      setJobFilter,
      clearJobFilter,
    }}
    >
      {children}
    </HireDashboardContext.Provider>
  );
};

export const useHireDashboard = () => useContext(HireDashboardContext);
