import { apiGet, apiPost, apiPatch, apiDelete } from './api';
import type { GroupMember } from '../types';

interface RawGroupMember {
  id: string;
  role: string;
  type: string;
  balance: number;
  status: string;
  joinedAt?: string;
  members?: {
    id: string;
    username: string;
    email?: string;
    displayName: string;
    phone: string;
    avatarUrl?: string;
  };
  member?: {
    id: string;
    username: string;
    email?: string;
    displayName: string;
    phone: string;
    avatarUrl?: string;
  };
}

function mapGroupMember(raw: RawGroupMember): GroupMember {
  const m = raw.members ?? raw.member;
  return {
    id: raw.id,
    memberId: m?.id ?? '',
    groupId: '',
    role: (raw.role === 'super_admin' ? 'admin' : raw.role) as GroupMember['role'],
    type: raw.type as GroupMember['type'],
    balance: raw.balance ?? 0,
    status: raw.status as GroupMember['status'],
    member: {
      id: m?.id ?? '',
      displayName: m?.displayName ?? '',
      username: m?.username ?? '',
      email: m?.email,
      phone: m?.phone ?? '',
      avatarUrl: m?.avatarUrl,
      provider: 'local',
      status: 'active',
      createdAt: '',
    },
  };
}

interface MembersListResponse {
  data: RawGroupMember[];
}

interface MemberDetailResponse {
  data: RawGroupMember;
}

interface AdjustBalancePayload {
  amount: number;
  note?: string;
}

export const membersService = {
  list: async () => {
    const res = await apiGet<MembersListResponse>('/members');
    return { data: (res.data ?? []).map(mapGroupMember) };
  },

  getById: async (id: string) => {
    const res = await apiGet<MemberDetailResponse>(`/members/${id}`);
    return { data: mapGroupMember(res.data) };
  },

  add: (data: { identifier: string; role?: string; type?: string }) =>
    apiPost<{ data: RawGroupMember }>('/members', data),

  adjustBalance: (id: string, data: AdjustBalancePayload) =>
    apiPatch<{ balance: number }>(`/members/${id}/balance`, data),

  remove: (id: string) =>
    apiDelete<{ success: boolean }>(`/members/${id}`),
};
