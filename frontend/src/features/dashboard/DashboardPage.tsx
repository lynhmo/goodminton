import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Divider,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccountBalanceWallet as WalletIcon,
  People as PeopleIcon,
  NotificationsActive as AlertIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { sessionsService } from '../../services/sessions.service';
import { membersService } from '../../services/members.service';
import { formatVND, formatDate, getInitials, getAvatarColor, getAvatarTextColor } from '../../utils/format';
import type { Session, GroupMember } from '../../types';

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: string;
  sub?: string;
}

const StatCard: FC<StatCardProps> = ({ icon, label, value, badge, sub }) => (
  <Card
    sx={{
      width: '100%',
      minWidth: 0,
    }}
  >
    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: '#E8F5E9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
          }}
        >
          {icon}
        </Box>
        {badge && (
          <Chip
            label={badge}
            size="small"
            sx={{ bgcolor: '#E8F5E9', color: 'primary.main', fontWeight: 500 }}
          />
        )}
      </Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem', fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', md: '1.5rem' }, mt: 0.25, overflowWrap: 'anywhere' }}>
        {value}
      </Typography>
      {sub && (
        <Typography variant="caption" sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          {sub}
        </Typography>
      )}
    </CardContent>
  </Card>
);

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export const DashboardPage: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      sessionsService.list(),
      membersService.list(),
    ])
      .then(([sessRes, memRes]) => {
        setSessions(sessRes.data);
        setMembers(memRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalMembers = members.length;
  const fixedMembers = members.filter((m) => m.type === 'fixed').length;
  const totalBalance = members.reduce((sum, m) => sum + m.balance, 0);
  const now = new Date();
  const sessionsThisMonth = sessions.filter((s) => {
    const d = new Date(s.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const nextSession = sessions.find((s) => s.status === 'pending');

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'flex-start' }, minWidth: 0 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h2" sx={{ mb: 0.5, overflowWrap: 'anywhere' }}>
            Chào mừng trở lại, {user?.displayName ?? 'Admin'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', overflowWrap: 'anywhere' }}>
            Dưới đây là tóm tắt hoạt động của câu lạc bộ hôm nay.
          </Typography>
        </Box>
        {/* Desktop: date display */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            THỜI GIAN
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long' })}
          </Typography>
        </Box>
      </Box>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <>
      {/* Stat Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
          gap: 2,
          mb: 3,
          minWidth: 0,
        }}
      >
        <StatCard
          icon={<CalendarIcon sx={{ fontSize: 20 }} />}
          label="Số buổi tập tháng này"
          value={`${sessionsThisMonth} buổi`}
          badge="Tháng này"
        />
        <StatCard
          icon={<WalletIcon sx={{ fontSize: 20 }} />}
          label="Số dư quỹ nhóm (VNĐ)"
          value={formatVND(totalBalance)}
          sub={totalBalance > 0 ? `Quỹ nhóm: ${formatVND(totalBalance)}` : undefined}
        />
        <StatCard
          icon={<PeopleIcon sx={{ fontSize: 20 }} />}
          label="Thành viên"
          value={`${totalMembers} người`}
          sub={`${fixedMembers} cố định`}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, minWidth: 0 }}>
        {/* Left column */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Next session banner */}
          {nextSession && (
            <Card
              sx={{
                bgcolor: 'primary.main',
                color: '#fff',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/sessions')}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <AlertIcon sx={{ fontSize: 20 }} />
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, opacity: 0.9 }}>
                    Thông báo quan trọng
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ color: '#fff', mb: 1 }}>
                  Buổi tập tiếp theo
                </Typography>
                <Box
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.15)',
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                    {formatDate(nextSession.date)} — {formatVND(nextSession.totalCost)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {nextSession.attendeeCount > 0 ? `${nextSession.attendeeCount} thành viên` : 'Chưa có điểm danh'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Recent activity */}
          <Card>
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
              <Box sx={{ px: 2, pt: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Hoạt động gần đây</Typography>
                <Button size="small" sx={{ minHeight: 32, fontSize: '0.8rem' }} onClick={() => navigate('/sessions')}>
                  Xem tất cả
                </Button>
              </Box>
              <Divider />
              <List disablePadding>
                {sessions.length === 0 ? (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Chưa có hoạt động nào.
                    </Typography>
                  </Box>
                ) : (
                  sessions.slice(0, 5).map((session, idx) => (
                    <Box key={session.id}>
                      <ListItem sx={{ px: 2, py: 1.5, alignItems: 'flex-start' }}>
                        <ListItemAvatar sx={{ minWidth: 44 }}>
                          <Avatar sx={{ width: 36, height: 36, bgcolor: '#E8F5E9', color: 'primary.main' }}>
                            <CalendarIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          sx={{ minWidth: 0 }}
                          primary={
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-start' }, gap: 0.5, minWidth: 0 }}>
                              <Typography variant="body2" sx={{ lineHeight: 1.4, minWidth: 0, overflowWrap: 'anywhere' }}>
                                Buổi tập {formatDate(session.date)}
                              </Typography>
                              <Chip
                                label={session.status === 'settled' ? 'Hoàn tất' : session.status === 'pending' ? 'Chờ xử lý' : 'Bản nháp'}
                                size="small"
                                sx={{ bgcolor: '#E8F5E9', color: 'primary.main' }}
                              />
                            </Box>
                          }
                          secondary={
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {session.attendeeCount} người — {formatVND(session.totalCost)}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {idx < Math.min(sessions.length, 5) - 1 && <Divider component="li" />}
                    </Box>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Right column — desktop only */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 2, width: 280, flexShrink: 0 }}>
          {/* Court status card */}
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Trạng thái sân hôm nay</Typography>
              {[
                { name: 'Sân A', status: 'Sân sáng', color: 'primary.main', fill: 85 },
                { name: 'Sân B', status: 'Đang bảo trì', color: 'warning.main', fill: 40 },
              ].map((court) => (
                <Box key={court.name} sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{court.name}</Typography>
                    <Typography variant="caption" sx={{ color: court.color, fontWeight: 600 }}>{court.status}</Typography>
                  </Box>
                  <Box sx={{ height: 6, bgcolor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ width: `${court.fill}%`, height: '100%', bgcolor: court.color, borderRadius: 3 }} />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Participation chart placeholder */}
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Tỷ lệ tham gia tuần này</Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 80 }}>
                {[60, 80, 45, 90, 70, 100, 55].map((h, i) => (
                  <Box
                    key={i}
                    sx={{
                      flex: 1,
                      height: `${h}%`,
                      bgcolor: i === 5 ? 'primary.main' : '#E8F5E9',
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
                  <Typography key={d} variant="caption" sx={{ color: 'text.secondary', flex: 1, textAlign: 'center' }}>
                    {d}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Button
            variant="contained"
            fullWidth
            startIcon={<AddIcon />}
            onClick={() => navigate('/sessions/new')}
          >
            Tạo buổi tập mới
          </Button>
        </Box>
      </Box>

      {/* Mobile FAB */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: 72,
          right: 16,
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/sessions/new')}
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            minWidth: 56,
            p: 0,
            boxShadow: '0 4px 12px rgba(46,125,50,0.4)',
          }}
        >
          <AddIcon />
        </Button>
      </Box>
      </>
      )}
    </Box>
  );
};
