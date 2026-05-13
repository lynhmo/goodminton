import { useState } from 'react';
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
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle,
  Cancel,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { formatVND, formatDate, getInitials, getAvatarColor, getAvatarTextColor, calcPerPerson } from '../../utils/format';
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

  // Editable shuttlecock qty — only used when pending
  const [shuttlecockQty, setShuttlecockQty] = useState(session.shuttlecockQty);
  const isPending = session.status === 'pending';

  // Derived cost calculations
  const shuttlecockCost = shuttlecockQty * session.shuttlecockPrice;
  const totalCost = session.courtFee + shuttlecockCost;
  const perPerson = calcPerPerson(totalCost, session.attendeeCount, 1000);
  const remainder = session.attendeeCount > 0 ? totalCost - perPerson * session.attendeeCount : 0;

  // Use computed values when pending, original values otherwise
  const displayValues = isPending
    ? { shuttlecockQty, shuttlecockCost, totalCost, perPerson, remainder }
    : {
        shuttlecockQty: session.shuttlecockQty,
        shuttlecockCost: session.shuttlecockCost,
        totalCost: session.totalCost,
        perPerson: session.perPerson,
        remainder: session.remainder,
      };

  const handleQtyChange = (value: number) => {
    const clamped = Math.max(0, value);
    setShuttlecockQty(clamped);
  };

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

          {/* Shuttlecock qty editor — only when pending */}
          {isPending && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                bgcolor: 'action.hover',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.65rem',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  letterSpacing: 0.4,
                  mb: 1,
                  display: 'block',
                }}
              >
                Số quả cầu đã dùng
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={() => handleQtyChange(shuttlecockQty - 1)}
                  disabled={shuttlecockQty <= 0}
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  type="number"
                  value={shuttlecockQty}
                  onChange={(e) => handleQtyChange(Number(e.target.value))}
                  sx={{
                    width: 80,
                    '& .MuiOutlinedInput-root': {
                      height: 48,
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      textAlign: 'center',
                    },
                    '& input': {
                      textAlign: 'center',
                      fontSize: '1.25rem',
                      padding: '8px',
                    },
                  }}
                  slotProps={{ htmlInput: { min: 0 } }}
                />
                <IconButton
                  onClick={() => handleQtyChange(shuttlecockQty + 1)}
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <AddIcon />
                </IconButton>
                <Typography variant="body2" sx={{ color: 'text.secondary', ml: 0.5 }}>
                  × {formatVND(session.shuttlecockPrice)}/quả
                </Typography>
              </Box>
              {shuttlecockCost > 0 && (
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 600, color: 'primary.main' }}>
                  Tiền cầu: {formatVND(shuttlecockCost)}
                </Typography>
              )}
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {[
              { label: 'Tiền sân', value: formatVND(session.courtFee) },
              ...(!isPending
                ? [{ label: 'Số quả cầu', value: `${displayValues.shuttlecockQty} quả` }]
                : []),
              { label: 'Tiền cầu', value: formatVND(displayValues.shuttlecockCost) },
              { label: 'Tổng chi phí', value: formatVND(displayValues.totalCost), highlight: true },
              { label: 'Số người', value: `${session.attendeeCount} người` },
              { label: 'Mỗi người', value: formatVND(displayValues.perPerson), highlight: true },
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

          {displayValues.remainder > 0 && (
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Phần dư vào quỹ nhóm: <strong>{formatVND(displayValues.remainder)}</strong>
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
      {isPending && (
        <Button variant="contained" fullWidth size="large" sx={{ mt: 3 }}>
          Xác nhận &amp; Trừ tiền
        </Button>
      )}
    </Box>
  );
};
