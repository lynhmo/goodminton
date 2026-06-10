import { apiGet, apiPost } from './api';

export interface LoginResponse {
  user: {
    id: string;
    username: string;
    email?: string;
    displayName: string;
    phone: string;
    role: string;
    groupId: string;
  };
}

export interface AuthMeResponse {
  user: {
    id: string;
    username: string;
    email?: string;
    displayName: string;
    phone: string;
    avatarUrl?: string;
    status: string;
    role: string;
    groupId: string;
  };
}

export const authService = {
  login: (identifier: string, password: string) =>
    apiPost<LoginResponse>('/auth/login', { identifier, password }),

  register: (data: {
    username: string;
    password: string;
    displayName: string;
    phone: string;
    email?: string;
    inviteCode?: string;
    type?: 'fixed' | 'guest';
  }) => apiPost<{ user: Record<string, unknown> }>('/auth/register', data),

  logout: () => apiPost<{ success: boolean }>('/auth/logout'),

  me: () => apiGet<AuthMeResponse>('/auth/me'),
};
