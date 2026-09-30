import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { fetchApi } from '../api/client';

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  login: (email: string, password?: string, role?: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  token: null,
  login: async () => { throw new Error('Not implemented'); },
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
  hasRole: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('skilltrack_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore authenticated session on page reload
  useEffect(() => {
    async function restoreSession() {
      const storedToken = localStorage.getItem('skilltrack_token');
      const storedUser = localStorage.getItem('skilltrack_user');

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch {
          // parse error
        }
      }

      try {
        const profile = await fetchApi<User>('/api/auth/me');
        setCurrentUser(profile);
        localStorage.setItem('skilltrack_user', JSON.stringify(profile));
      } catch (err) {
        console.warn('Session expired or invalid token:', err);
        // Clear expired session
        localStorage.removeItem('skilltrack_token');
        localStorage.removeItem('skilltrack_user');
        setToken(null);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (identifierOrEmail: string, password?: string, role?: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await fetchApi<{ access_token: string; token_type: string; user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          identifier: identifierOrEmail,
          email: identifierOrEmail,
          password: password || '',
          role
        }),
      });

      const authToken = res.access_token;
      const user = res.user;

      localStorage.setItem('skilltrack_token', authToken);
      localStorage.setItem('skilltrack_user', JSON.stringify(user));
      setToken(authToken);
      setCurrentUser(user);

      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('skilltrack_token');
    localStorage.removeItem('skilltrack_user');
    setToken(null);
    setCurrentUser(null);
  };

  const hasRole = (...roles: UserRole[]): boolean => {
    if (!currentUser) return false;
    // Map 'provider' and 'training_provider' interchangeably
    return roles.some(r => {
      if (r === 'training_provider' && (currentUser.role === 'training_provider' || currentUser.role === 'provider')) return true;
      if (r === 'provider' && (currentUser.role === 'training_provider' || currentUser.role === 'provider')) return true;
      return currentUser.role === r;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        login,
        logout,
        isAuthenticated: !!currentUser && !!token,
        isLoading,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
