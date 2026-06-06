import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { usePlatformAdmin } from '../../context/PlatformAdminContext';
import { isPublicPageEnabled } from '../../utils/publicPageAccess';

const UserViewLayout = () => {
  const { pathname } = useLocation();
  const { data } = usePlatformAdmin();
  const pageAllowed = isPublicPageEnabled(pathname, data.userViewPages);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!pageAllowed) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="user-view">
      <Outlet />
    </div>
  );
};

export default UserViewLayout;
