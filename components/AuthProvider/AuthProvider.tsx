'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { checkSession, getMe } from '@/lib/api/clientApi';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const initAuth = async () => {
      const setUser = useAuthStore.getState().setUser;
      const clearIsAuthenticated =
        useAuthStore.getState().clearIsAuthenticated;

      try {
        const isAuthenticated = await checkSession();

        if (!isAuthenticated) {
          clearIsAuthenticated();
          return;
        }

        const user = await getMe();
        setUser(user);
      } catch {
        clearIsAuthenticated();
      }
    };

    initAuth();
  }, []);

  return <>{children}</>;
}