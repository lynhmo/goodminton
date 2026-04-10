import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from '@mui/material';
import { Add as AddIcon, CalendarToday as CalIcon } from '@mui/icons-material';
import { formatVND, formatDate } from '../../utils/format';
import { mockSessions } from '../../mocks/data';
import type { SessionStatus } from '../../types';

const statusMeta: Record<SessionStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Bản nháp', color: '#757575', bg: '#F5F5F5' },
  pending: { label: 'Chờ xử lý', color: '#E65100', bg: '#FFF3E0' },
  settled: { label: 'Hoàn tất', color: '#2E7D32', bg: '#E8F5E9' },
};

export const SessionsPage: FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5 }}>
        <Box>
          <Typography variant="h2">Lịch tập &amp; Thu chi</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Quản lý chi tiết buổi tập, điểm danh thành viên.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/sessions/new')}
          sx={{ flexShrink: 0, display: { xs: 'none', md: 'flex' } }}
        >
          Tạo buổi tập
        </Button>
      </Box>

      {/* Filter chips */}
      <Box sx={{ display: 'flex', gap: 1, mt: 2, mb: 2.5, overflowX: 'auto', pb: 0.5 }}>
        {['Tất cả', 'Bản nháp', 'Chờ xử lý', 'Hoàn tất'].map((label, i) => (
          <Chip
            key={label}
            label={label}
            onClick={() => {}}
            sx={{
              flexShrink: 0,
              bgcolor: i === 0 ? 'primary.main' : '#F5F5F5',
              color: i === 0 ? '#fff' : 'text.secondary',
              fontWeight: i === 0 ? 600 : 400,
              '&:hover': { opacity: 0.85 },
            }}
          />
        ))}
      </Box>

      {/* Session cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {mockSessions.map((session) => {
          const meta = statusMeta[session.status];
          return (
            <Card key={session.id}>
              <CardActionArea onClick={() => navigate(`/sessions/${session.id}`)}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: '#E8F5E9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <CalIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {formatDate(session.date)}
                        </Typography>
                        <Chip
                          label={meta.label}
                          size="small"
                          sx={{ bgcolor: meta.bg, color: meta.color, fontWeight: 600, height: 22 }}
                        />
                      </Box>

                      {session.note && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontSize: '0.8rem' }}>
                          {session.note}
                        </Typography>
                      )}

                      {session.status !== 'draft' && session.totalCost > 0 && (
                        <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                          <Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>
                              Tổng chi phí
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {formatVND(session.totalCost)}
                            </Typography>
                          </Box>
                          {session.attendeeCount > 0 && (
                            <Box>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>
                                Số người
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {session.attendeeCount} người
                              </Typography>
                            </Box>
                          )}
                          {session.perPerson > 0 && (
                            <Box>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>
                                Mỗi người
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                {formatVND(session.perPerson)}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}

                      {session.status === 'draft' && (
                        <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 500 }}>
                          Chưa điền đầy đủ thông tin
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
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
