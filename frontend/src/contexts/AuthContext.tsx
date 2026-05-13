import { createContext, useContext, useState } from 'react';
import type { FC, ReactNode } from 'react';
import type { AuthUser } from '../types';
import { mockAuthUser } from '../mocks/data';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  verifyPhone: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (identifier: string, _password: string) => {
    // Fake auth — accept any credentials
    const normalized = identifier.trim();
    const isEmail = normalized.includes('@');
    setUser({
      ...mockAuthUser,
      email: isEmail ? normalized : mockAuthUser.email,
      phoneVerified: true,
    });
  };

  const verifyPhone = async (phone: string, otp: string) => {
    if (otp !== '123456') throw new Error('Invalid OTP');
    setUser((current) => current ? { ...current, phone: phone.replace(/\s/g, ''), phoneVerified: true } : current);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, verifyPhone, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
