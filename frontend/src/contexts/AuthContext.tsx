import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { FC, ReactNode } from 'react';
import type { AuthUser } from '../types';
import { authService } from '../services/auth.service';
import { ApiError } from '../services/api';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  verifyPhone: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService.me()
      .then((res) => {
        setUser({
          id: res.user.id,
          displayName: res.user.displayName,
          username: res.user.username,
          email: res.user.email,
          phone: res.user.phone,
          phoneVerified: !!res.user.phone,
          role: res.user.role as AuthUser['role'],
          avatarUrl: res.user.avatarUrl,
        });
      })
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const res = await authService.login(identifier, password);
    setUser({
      id: res.user.id,
      displayName: res.user.displayName,
      username: res.user.username,
      email: res.user.email,
      phone: res.user.phone,
      phoneVerified: !!res.user.phone,
      role: res.user.role as AuthUser['role'],
    });
  }, []);

  const verifyPhone = useCallback(async (_phone: string, _otp: string) => {
    // Will be implemented when phone verification endpoint is ready
    throw new ApiError(501, 'Chức năng chưa khả dụng');
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, isLoading, login, verifyPhone, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
