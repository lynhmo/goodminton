import { apiGet, apiPost, apiPatch, apiDelete } from './api';
import type { Session, Attendance } from '../types';

interface RawAttendance {
  id: string;
  isPresent: boolean;
  amountCharged: number;
  members?: { id: string; displayName: string; avatarUrl?: string };
  member?: { id: string; displayName: string; avatarUrl?: string };
}

interface RawSession {
  id: string;
  groupId: string;
  date: string;
  courtFee: number;
  shuttlecockQty: number;
  shuttlecockPrice: number;
  shuttlecockCost: number;
  totalCost: number;
  perPerson: number;
  attendeeCount: number;
  remainder: number;
  status: string;
  note?: string;
  createdBy: string;
  createdAt: string;
  attendance?: RawAttendance[];
  attendances?: RawAttendance[];
}

function mapAttendance(sessionId: string, raw: RawAttendance): Attendance {
  const memberData = raw.members ?? raw.member;
  return {
    id: raw.id,
    sessionId,
    memberId: memberData?.id ?? '',
    isPresent: raw.isPresent,
    amountCharged: raw.amountCharged ?? 0,
    member: {
      id: memberData?.id ?? '',
      displayName: memberData?.displayName ?? '',
      username: '',
      phone: '',
      provider: 'local',
      status: 'active',
      createdAt: '',
      avatarUrl: memberData?.avatarUrl,
    },
  };
}

function mapSession(raw: RawSession): Session {
  const atts = (raw.attendance ?? raw.attendances ?? []) as RawAttendance[];
  return {
    id: raw.id,
    groupId: raw.groupId,
    date: raw.date,
    courtFee: raw.courtFee,
    shuttlecockQty: raw.shuttlecockQty ?? 0,
    shuttlecockPrice: raw.shuttlecockPrice ?? 0,
    shuttlecockCost: raw.shuttlecockCost ?? 0,
    totalCost: raw.totalCost ?? 0,
    perPerson: raw.perPerson ?? 0,
    attendeeCount: raw.attendeeCount ?? 0,
    remainder: raw.remainder ?? 0,
    status: raw.status as Session['status'],
    note: raw.note,
    createdBy: raw.createdBy ?? '',
    createdAt: raw.createdAt ?? '',
    attendances: atts.map((a: RawAttendance) => mapAttendance(raw.id, a)),
  };
}

interface SessionsListResponse {
  data: RawSession[];
}

interface SessionDetailResponse {
  data: RawSession;
}

export interface CreateSessionPayload {
  date: string;
  courtFee: number;
  shuttlecockQty?: number;
  shuttlecockPrice?: number;
  note?: string;
}

interface SettleResponse {
  success: boolean;
  perPerson: number;
  remainder: number;
  attendeeCount: number;
}

export const sessionsService = {
  list: async () => {
    const res = await apiGet<SessionsListResponse>('/sessions');
    return { data: (res.data ?? []).map(mapSession) };
  },

  getById: async (id: string) => {
    const res = await apiGet<SessionDetailResponse>(`/sessions/${id}`);
    return { data: mapSession(res.data) };
  },

  create: (data: CreateSessionPayload) =>
    apiPost<{ data: RawSession }>('/sessions', data),

  update: (id: string, data: Record<string, unknown>) =>
    apiPatch<{ data: RawSession }>(`/sessions/${id}`, data),

  settle: (id: string) =>
    apiPost<SettleResponse>(`/sessions/${id}/settle`),

  revert: (id: string) =>
    apiPost<{ success: boolean }>(`/sessions/${id}/revert`),

  delete: (id: string) =>
    apiDelete<{ success: boolean }>(`/sessions/${id}`),
};
