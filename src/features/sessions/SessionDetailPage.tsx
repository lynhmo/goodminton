import type { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, CheckCircle, Cancel } from '@mui/icons-material';
import { formatVND, formatDate, getInitials, getAvatarColor, getAvatarTextColor } from '../../utils/format';
import { mockSessions } from '../../mocks/data';
import type { SessionStatus } from '../../types';

const statusMeta: Record<SessionStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Bản nháp', color: '#757575', bg: '#F5F5F5' },
  pending: { label: 'Chờ xử lý', color: '#E65100', bg: '#FFF3E0' },
  settled: { label: 'Hoàn tất', color: '#2E7D32', bg: '#E8F5E9' },
};

export const SessionDetailPage: FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const session = mockSessions.find((s) => s.id === sessionId);

  if (!session) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>Không tìm thấy buổi tập.</Typography>
        <Button onClick={() => navigate('/sessions')} sx={{ mt: 2 }}>Quay lại</Button>
      </Box>
    );
  }

  const meta = statusMeta[session.status];
  const allMembers = mockSessions.find((s) => s.id === 's1')?.attendances ?? [];

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/sessions')}
        sx={{ mb: 2, color: 'text.secondary', minHeight: 40 }}
      >
        Danh sách buổi tập
      </Button>

      {/* Session Info Card */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h4">{formatDate(session.date)}</Typography>
            <Chip label={meta.label} sx={{ bgcolor: meta.bg, color: meta.color, fontWeight: 600 }} />
          </Box>

          {session.note && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{session.note}</Typography>
          )}

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {[
              { label: 'Tiền sân', value: formatVND(session.courtFee) },
              { label: 'Số quả cầu', value: `${session.shuttlecockQty} quả` },
              { label: 'Tiền cầu', value: formatVND(session.shuttlecockCost) },
              { label: 'Tổng chi phí', value: formatVND(session.totalCost), highlight: true },
              { label: 'Số người', value: `${session.attendeeCount} người` },
              { label: 'Mỗi người', value: formatVND(session.perPerson), highlight: true },
            ].map(({ label, value, highlight }) => (
              <Box key={label}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.4 }}>
                  {label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: highlight ? 700 : 500, color: highlight ? 'primary.main' : 'text.primary' }}>
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>

          {session.remainder > 0 && (
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Phần dư vào quỹ nhóm: <strong>{formatVND(session.remainder)}</strong>
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Attendances */}
      <Typography variant="h5" sx={{ mb: 1.5 }}>
        Điểm danh ({session.attendeeCount}/{allMembers.length + 2} thành viên)
      </Typography>
      <Card>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          {session.attendances.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Chưa điểm danh.</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {session.attendances.map((att, idx) => (
                <Box key={att.id}>
                  <ListItem sx={{ px: 2, py: 1.25 }}>
                    <ListItemAvatar sx={{ minWidth: 44 }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: getAvatarColor(att.member.displayName),
                          color: getAvatarTextColor(att.member.displayName),
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {getInitials(att.member.displayName)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={att.member.displayName}
                      slotProps={{ primary: { variant: 'body2', fontWeight: 500 } as object }}
                      secondary={
                        att.isPresent && att.amountCharged > 0
                          ? `Trừ: ${formatVND(att.amountCharged)}`
                          : undefined
                      }
                    />
                    {att.isPresent ? (
                      <CheckCircle sx={{ color: 'primary.main', fontSize: 20 }} />
                    ) : (
                      <Cancel sx={{ color: 'text.disabled', fontSize: 20 }} />
                    )}
                  </ListItem>
                  {idx < session.attendances.length - 1 && <Divider component="li" />}
                </Box>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Action for pending session */}
      {session.status === 'pending' && (
        <Button variant="contained" fullWidth size="large" sx={{ mt: 3 }}>
          Xác nhận &amp; Trừ tiền
        </Button>
      )}
    </Box>
  );
};
