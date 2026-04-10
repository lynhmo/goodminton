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
  ListItemText,
  Typography,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import {
  formatVND,
  formatPhone,
  getInitials,
  getAvatarColor,
  getAvatarTextColor,
} from '../../utils/format';
import { mockGroupMembers, mockTransactions } from '../../mocks/data';

export const MemberDetailPage: FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();

  const groupMember = mockGroupMembers.find((gm) => gm.memberId === memberId);
  if (!groupMember) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Không tìm thấy thành viên.
        </Typography>
        <Button onClick={() => navigate('/members')} sx={{ mt: 2 }}>
          Quay lại danh sách
        </Button>
      </Box>
    );
  }

  const { member, type, balance, role } = groupMember;
  const isNeg = balance < 0;
  const transactions = mockTransactions.filter((t) => t.groupMemberId === groupMember.id);

  const typeLabel = {
    session_charge: 'Trừ tiền buổi tập',
    deposit: 'Nộp tiền quỹ',
    refund: 'Hoàn tiền',
    adjustment: 'Điều chỉnh',
  };

  return (
    <Box>
      {/* Back */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/members')}
        sx={{ mb: 2, color: 'text.secondary', minHeight: 40 }}
      >
        Danh sách thành viên
      </Button>

      {/* Header Card */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: getAvatarColor(member.displayName),
                color: getAvatarTextColor(member.displayName),
                fontSize: '1.5rem',
                fontWeight: 600,
              }}
            >
              {getInitials(member.displayName)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="h4">{member.displayName}</Typography>
                {role === 'admin' && (
                  <Chip label="Admin" size="small" sx={{ bgcolor: '#E8F5E9', color: 'primary.main' }} />
                )}
              </Box>
              <Chip
                label={type === 'fixed' ? 'Cố định' : 'Vãng lai'}
                size="small"
                sx={{
                  bgcolor: type === 'fixed' ? '#E8F5E9' : '#F5F5F5',
                  color: type === 'fixed' ? '#2E7D32' : '#757575',
                  border: type === 'fixed' ? 'none' : '1px solid #E0E0E0',
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2">{formatPhone(member.phone)}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 600, letterSpacing: 0.5 }}>
                Số dư
              </Typography>
              <Typography
                variant="h4"
                sx={{ color: isNeg ? 'error.main' : balance === 0 ? 'text.secondary' : 'primary.main', fontWeight: 700 }}
              >
                {isNeg ? '-' : ''}{formatVND(Math.abs(balance))}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Typography variant="h5" sx={{ mb: 1.5 }}>Lịch sử giao dịch</Typography>
      <Card>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          {transactions.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Chưa có giao dịch nào.
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {transactions.map((t, idx) => {
                const isPos = t.amount > 0;
                return (
                  <Box key={t.id}>
                    <ListItem sx={{ px: 2, py: 1.5 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {typeLabel[t.type]}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700, color: isPos ? 'primary.main' : 'error.main', flexShrink: 0, ml: 1 }}
                            >
                              {isPos ? '+' : ''}{formatVND(t.amount)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.25 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {t.note}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Số dư: {formatVND(t.balanceAfter)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {idx < transactions.length - 1 && <Divider component="li" />}
                  </Box>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
