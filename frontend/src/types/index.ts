// ─── Domain Types ────────────────────────────────────────────────────────────

export type MemberType = 'fixed' | 'guest';
export type MemberRole = 'admin' | 'member';
export type MemberStatus = 'active' | 'inactive';
export type SessionStatus = 'draft' | 'pending' | 'settled';
export type TransactionType = 'session_charge' | 'deposit' | 'refund' | 'adjustment';

// ─── Member ───────────────────────────────────────────────────────────────────

export interface Member {
  id: string;
  displayName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  provider: 'local' | 'google' | 'facebook';
  status: MemberStatus;
  createdAt: string;
}

export interface GroupMember {
  id: string;
  memberId: string;
  groupId: string;
  role: MemberRole;
  type: MemberType;
  balance: number;
  status: MemberStatus;
  member: Member;
}

// ─── Session ──────────────────────────────────────────────────────────────────

export interface Session {
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
  status: SessionStatus;
  note?: string;
  createdBy: string;
  createdAt: string;
  attendances: Attendance[];
}

export interface Attendance {
  id: string;
  sessionId: string;
  memberId: string;
  isPresent: boolean;
  amountCharged: number;
  member: Member;
}

// ─── Transaction ──────────────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  groupMemberId: string;
  sessionId?: string;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  note?: string;
  createdAt: string;
}

// ─── Rankings ─────────────────────────────────────────────────────────────────

export interface RankingEntry {
  rank: number;
  memberId: string;
  member: Member;
  sessionCount: number;
  attendanceRate: number;
  totalSessions: number;
}

// ─── Group ────────────────────────────────────────────────────────────────────

export interface Group {
  id: string;
  name: string;
  inviteCode: string;
  defaultCourtFee: number;
  defaultShuttlecockPrice: number;
  roundingRule: number; // e.g. 1000 = round down to nearest 1000
  schedule?: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  role: MemberRole;
  avatarUrl?: string;
}
