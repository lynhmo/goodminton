import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
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
import { mockSessions, mockGroupMembers, mockGroup } from '../../mocks/data';
import { formatVND, getInitials, getAvatarColor, getAvatarTextColor } from '../../utils/format';

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
      minWidth: { xs: 200, md: 'auto' },
      flex: { xs: '0 0 auto', md: '1 1 0' },
      scrollSnapAlign: 'start',
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
      <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.375rem', md: '1.5rem' }, mt: 0.25 }}>
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

  const totalMembers = mockGroupMembers.length;
  const fixedMembers = mockGroupMembers.filter((m) => m.type === 'fixed').length;
  const totalBalance = mockGroupMembers.reduce((sum, m) => sum + m.balance, 0);
  const sessionsThisMonth = mockSessions.filter((s) => {
    const d = new Date(s.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const nextSession = mockSessions.find((s) => s.status === 'pending');

  // Recent activity items (simulated)
  const recentActivities = [
    {
      id: 'a1',
      avatar: mockGroupMembers[1].member,
      text: `${mockGroupMembers[1].member.displayName} vừa nộp tiền quỹ tháng 5`,
      time: '10 phút trước',
      amount: '+200.000đ',
      amountColor: 'primary.main',
    },
    {
      id: 'a2',
      avatar: null,
      text: 'Buổi tập sáng Thứ 7 đã hoàn thành',
      time: 'Hôm qua, 11:30',
      badge: '12 Người',
    },
    {
      id: 'a3',
      avatar: mockGroupMembers[4].member,
      text: `${mockGroupMembers[4].member.displayName} đã cập nhật lịch tập mới`,
      time: '2 giờ trước',
    },
  ];

  return (
    <Box>
      {/* Welcome Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h2" sx={{ mb: 0.5 }}>
            Chào mừng trở lại, {user?.displayName ?? 'Admin'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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

      {/* Stat Cards — horizontal scroll on mobile, row on desktop */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          overflowX: { xs: 'auto', md: 'visible' },
          scrollSnapType: { xs: 'x mandatory', md: 'none' },
          pb: { xs: 1, md: 0 },
          mx: { xs: -2, md: 0 },
          px: { xs: 2, md: 0 },
          '&::-webkit-scrollbar': { height: 4 },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 2 },
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
          sub="↑ +15% so với tháng trước"
        />
        <StatCard
          icon={<PeopleIcon sx={{ fontSize: 20 }} />}
          label="Thành viên"
          value={`${totalMembers} người`}
          sub={`${fixedMembers} cố định`}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Left column */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                    {mockGroup.schedule?.split('—').pop()?.trim() ?? 'Thứ 3, 19:00 tại Sân A'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Đã có 8 thành viên đăng ký
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
                {recentActivities.map((activity, idx) => (
                  <Box key={activity.id}>
                    <ListItem sx={{ px: 2, py: 1.5, alignItems: 'flex-start' }}>
                      <ListItemAvatar sx={{ minWidth: 44 }}>
                        {activity.avatar ? (
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: getAvatarColor(activity.avatar.displayName),
                              color: getAvatarTextColor(activity.avatar.displayName),
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            {getInitials(activity.avatar.displayName)}
                          </Avatar>
                        ) : (
                          <Avatar sx={{ width: 36, height: 36, bgcolor: '#E8F5E9', color: 'primary.main' }}>
                            <CalendarIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                        )}
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                            <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                              {activity.text}
                            </Typography>
                            {activity.amount && (
                              <Typography variant="body2" sx={{ color: activity.amountColor, fontWeight: 600, flexShrink: 0 }}>
                                {activity.amount}
                              </Typography>
                            )}
                            {activity.badge && (
                              <Chip
                                label={activity.badge}
                                size="small"
                                sx={{ bgcolor: '#E8F5E9', color: 'primary.main' }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {activity.time}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {idx < recentActivities.length - 1 && <Divider component="li" />}
                  </Box>
                ))}
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
    </Box>
  );
};
