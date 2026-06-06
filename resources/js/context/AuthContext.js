import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as authApi from '../api/authApi';
import { clearUserFromStorage, persistUserToStorage } from '../utils/authRedirect';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const applyUser = useCallback((nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      persistUserToStorage(nextUser);
    } else {
      clearUserFromStorage();
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await authApi.getCurrentUser();
      applyUser(data.user);
      return data.user;
    } catch {
      applyUser(null);
      return null;
    }
  }, [applyUser]);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        const data = await authApi.bootstrapAuth();
        if (!cancelled) {
          applyUser(data?.user ?? null);
        }
      } catch {
        if (!cancelled) {
          applyUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [applyUser]);

  useEffect(() => {
    const handleTokenCleared = () => applyUser(null);

    window.addEventListener('auth:token-cleared', handleTokenCleared);

    return () => {
      window.removeEventListener('auth:token-cleared', handleTokenCleared);
    };
  }, [applyUser]);

  const login = useCallback(async (payload) => {
    const data = await authApi.login(payload);
    
    if (data.first_login) {
      return data;
    }
    applyUser(data.user);
    return data;
  }, [applyUser]);

  const register = useCallback(async (payload) => {
    const data = await authApi.register(payload);
    applyUser(data.user);
    return data.user;
  }, [applyUser]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      applyUser(null);
    }
  }, [applyUser]);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    refreshUser,
  }), [user, loading, login, register, logout, refreshUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
