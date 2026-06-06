export function getHomePathForRole(role) {
  switch (role) {
    case 'hr':
      return '/hire-dashboard';
    case 'admin':
      return '/admin-dashboard';
    case 'candidate':
    default:
      return '/user-dashboard';
  }
}

export function persistUserToStorage(user) {
  if (!user) {
    return;
  }

  window.localStorage.setItem('user_name', user.name || '');
  window.localStorage.setItem('user_email', user.email || '');
  window.localStorage.setItem('user_role', user.role || 'candidate');

  if (user.role === 'hr' || user.role === 'admin') {
    window.localStorage.setItem('user_company', user.name || 'Your Company');
  }
}

export function clearUserFromStorage() {
  [
    'user_name',
    'user_email',
    'user_role',
    'user_company',
    'auth_token',
    'auth_token_expires_at',
    'name',
    'role',
  ].forEach((key) => window.localStorage.removeItem(key));
}
