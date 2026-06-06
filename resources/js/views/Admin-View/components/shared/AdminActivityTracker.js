import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePlatformAdmin } from '../../../../context/PlatformAdminContext';

const pageNames = {
  '/': 'Home',
  '/about-us': 'About Us',
  '/companies': 'Companies',
  '/jobs': 'Jobs',
  '/contact-us': 'Contact Us',
  '/pricing': 'Pricing',
  '/login': 'Login',
  '/signup': 'Signup',
  '/dashboard': 'Candidate Dashboard',
  '/profile': 'Profile',
  '/messages': 'Messages',
  '/resume': 'Resume',
  '/hire-dashboard': 'HR Overview',
  '/admin-dashboard': 'Admin Overview',
  '/admin-dashboard/content': 'Content',
  '/admin-dashboard/users': 'HR Profiles',
  '/admin-dashboard/logs': 'Logs',
  '/admin-dashboard/settings': 'Platform Settings',
};

const getActor = () => {
  if (typeof window === 'undefined') return { actor: 'Guest User', role: 'Guest' };
  const name = window.localStorage.getItem('user_name') || window.localStorage.getItem('name');
  const role = window.localStorage.getItem('user_role') || window.localStorage.getItem('role');

  return {
    actor: name || 'Guest User',
    role: role || 'Guest',
  };
};

const AdminActivityTracker = () => {
  const location = useLocation();
  const { addActivityLog } = usePlatformAdmin();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const { actor, role } = getActor();
    const path = `${location.pathname}${location.search}`;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    addActivityLog({
      actor,
      role,
      action: 'Viewed page',
      page: pageNames[location.pathname] || 'Page',
      path,
      device: isMobile ? 'Mobile' : 'Desktop',
      time: new Date().toLocaleString(),
    });
  }, [location.pathname, location.search]);

  return null;
};

export default AdminActivityTracker;
