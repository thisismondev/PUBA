'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, getUserRole, removeToken, removeUserRole } from '@/lib/api-client';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRoleState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const role = getUserRole();
    
    // Set both states together to avoid cascading
    const authenticated = !!(token && role);
    setIsAuthenticated(authenticated);
    setUserRoleState(authenticated ? role : null);
    setIsLoading(false);
  }, []);

  const logout = () => {
    removeToken();
    removeUserRole();
    setIsAuthenticated(false);
    setUserRoleState(null);
    router.push('/');
  };

  return {
    isAuthenticated,
    userRole,
    isLoading,
    logout,
  };
}
