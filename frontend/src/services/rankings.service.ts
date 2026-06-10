import { apiGet } from './api';
import type { RankingEntry } from '../types';

interface RawRankingRow {
  memberId: string;
  member: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
  sessionsAttended: number;
}

function mapRanking(raw: RawRankingRow, index: number): RankingEntry {
  return {
    rank: index + 1,
    memberId: raw.memberId,
    member: {
      id: raw.member.id,
      displayName: raw.member.displayName,
      username: '',
      phone: '',
      provider: 'local',
      status: 'active',
      createdAt: '',
      avatarUrl: raw.member.avatarUrl,
    },
    sessionCount: raw.sessionsAttended,
    attendanceRate: 0,
    totalSessions: raw.sessionsAttended,
  };
}

interface RankingsResponse {
  data: RawRankingRow[];
}

export const rankingsService = {
  list: async () => {
    const res = await apiGet<RankingsResponse>('/rankings');
    return { data: (res.data ?? []).map(mapRanking) };
  },
};
