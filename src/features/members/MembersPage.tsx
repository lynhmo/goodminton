import { useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Pagination,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  Paper,
  TextField,
  Typography,
  Button,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as KebabIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import {
  formatVND,
  formatPhone,
  getInitials,
  getAvatarColor,
  getAvatarTextColor,
} from '../../utils/format';
import { mockGroupMembers } from '../../mocks/data';
import type { GroupMember } from '../../types';
import { AddMemberDialog } from './AddMemberDialog';
import type { MemberFormData } from './AddMemberDialog';

const ITEMS_PER_PAGE = 6;

// ─── Member Avatar ────────────────────────────────────────────────────────────

const MemberAvatar: FC<{ name: string; size?: number }> = ({ name, size = 40 }) => (
  <Avatar
    sx={{
      width: size,
      height: size,
      bgcolor: getAvatarColor(name),
      color: getAvatarTextColor(name),
      fontSize: size * 0.35,
      fontWeight: 600,
    }}
  >
    {getInitials(name)}
  </Avatar>
);

// ─── Mobile Card ──────────────────────────────────────────────────────────────

interface MemberCardProps {
  groupMember: GroupMember;
  onEdit: (gm: GroupMember) => void;
  onDelete: (gm: GroupMember) => void;
}

const MemberCard: FC<MemberCardProps> = ({ groupMember, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { member, type, balance, role } = groupMember;
  const isFixed = type === 'fixed';
  const isNegative = balance < 0;
  const isCritical = balance < -200000;

  return (
    <Card sx={{ mb: 1.5 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Row 1: Avatar + Name + Kebab */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ position: 'relative' }}>
            <MemberAvatar name={member.displayName} size={40} />
            {role === 'admin' && (
              <CheckIcon
                sx={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  fontSize: 14,
                  color: 'primary.main',
                  bgcolor: '#fff',
                  borderRadius: '50%',
                }}
              />
            )}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, lineHeight: 1.3 }} noWrap>
              {member.displayName}
            </Typography>
          </Box>
          <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 'auto' }}>
            <KebabIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Row 2: Type chip */}
        <Box sx={{ mt: 0.75, ml: '52px' }}>
          <Chip
            label={isFixed ? 'CỐ ĐỊNH' : 'VÃNG LAI'}
            size="small"
            sx={{
              bgcolor: isFixed ? '#E8F5E9' : '#F5F5F5',
              color: isFixed ? '#2E7D32' : '#757575',
              border: isFixed ? 'none' : '1px solid #E0E0E0',
              fontSize: '0.65rem',
              fontWeight: 600,
              height: 20,
              letterSpacing: 0.3,
            }}
          />
        </Box>

        {/* Row 3: Phone + Balance */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.25, ml: '52px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
            <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
              {formatPhone(member.phone)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.3, fontWeight: 600, display: 'block' }}>
              Số dư
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                fontSize: '0.875rem',
                color: isNegative ? 'error.main' : 'primary.main',
              }}
            >
              {formatVND(Math.abs(balance))}{isNegative ? ' 🔴' : ''}
            </Typography>
          </Box>
        </Box>

        {isCritical && (
          <Alert severity="warning" icon={false} sx={{ mt: 1, py: 0.5, px: 1.5, fontSize: '0.75rem' }}>
            Số dư âm quá 200.000 VNĐ — cần nộp tiền!
          </Alert>
        )}
      </CardContent>

      {/* Kebab Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => { setAnchorEl(null); onEdit(groupMember); }}
          sx={{ minHeight: 48, fontSize: '0.9rem' }}
        >
          Sửa thông tin
        </MenuItem>
        <MenuItem
          onClick={() => { setAnchorEl(null); onDelete(groupMember); }}
          sx={{ minHeight: 48, fontSize: '0.9rem', color: 'error.main' }}
        >
          Xóa thành viên
        </MenuItem>
      </Menu>
    </Card>
  );
};

// ─── Members Page ─────────────────────────────────────────────────────────────

export const MembersPage: FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();

  const [members, setMembers] = useState<GroupMember[]>(mockGroupMembers);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<GroupMember | null>(null);

  const filtered = members.filter((gm) =>
    gm.member.displayName.toLowerCase().includes(search.toLowerCase()) ||
    gm.member.phone.includes(search)
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const fixedCount = members.filter((m) => m.type === 'fixed').length;
  const guestCount = members.filter((m) => m.type === 'guest').length;

  const handleSave = (data: MemberFormData) => {
    if (editTarget) {
      setMembers((prev) =>
        prev.map((gm) =>
          gm.id === editTarget.id
            ? {
                ...gm,
                type: data.type,
                balance: data.initialBalance,
                member: { ...gm.member, displayName: data.displayName, phone: data.phone },
              }
            : gm
        )
      );
    } else {
      const newGm: GroupMember = {
        id: `gm-${Date.now()}`,
        memberId: `m-${Date.now()}`,
        groupId: 'g1',
        role: 'member',
        type: data.type,
        balance: data.initialBalance,
        status: 'active',
        member: {
          id: `m-${Date.now()}`,
          displayName: data.displayName,
          phone: data.phone,
          email: '',
          provider: 'local',
          status: 'active',
          createdAt: new Date().toISOString(),
        },
      };
      setMembers((prev) => [newGm, ...prev]);
    }
    setEditTarget(null);
  };

  const handleEdit = (gm: GroupMember) => {
    setEditTarget(gm);
    setDialogOpen(true);
  };

  const handleDelete = (gm: GroupMember) => {
    setMembers((prev) => prev.filter((m) => m.id !== gm.id));
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h2">Thành viên</Typography>
        {isDesktop && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => { setEditTarget(null); setDialogOpen(true); }}
          >
            Thêm mới
          </Button>
        )}
      </Box>

      {/* Search + sub-header */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {filtered.length} thành viên
        </Typography>
        <Box sx={{ flex: 1, minWidth: 200, maxWidth: { md: 320 } }}>
          <TextField
            size="small"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ '& .MuiOutlinedInput-root': { minHeight: 40 } }}
          />
        </Box>
        {!isDesktop && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
            onClick={() => { setEditTarget(null); setDialogOpen(true); }}
            sx={{ minHeight: 40 }}
          >
            Thêm mới
          </Button>
        )}
      </Box>

      {/* Stat chips */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, overflowX: 'auto', pb: 0.5 }}>
        {[
          { label: `Tổng cộng ${members.length}`, active: true },
          { label: `Cố định ${fixedCount}`, active: false },
          { label: `Vãng lai ${guestCount}`, active: false },
        ].map((chip) => (
          <Chip
            key={chip.label}
            label={chip.label}
            sx={{
              bgcolor: chip.active ? 'primary.main' : '#F5F5F5',
              color: chip.active ? '#fff' : 'text.secondary',
              fontWeight: 500,
              height: 30,
              fontSize: '0.8rem',
              flexShrink: 0,
            }}
          />
        ))}
      </Box>

      {/* Mobile: Card list / Desktop: Table */}
      {!isDesktop ? (
        <Box>
          {paged.map((gm) => (
            <MemberCard
              key={gm.id}
              groupMember={gm}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#FAFAFA' }}>
                {['Thành viên', 'Loại', 'Số điện thoại', 'Số dư', 'Trạng thái', ''].map((h) => (
                  <TableCell
                    key={h}
                    sx={{ fontWeight: 600, fontSize: '0.8rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, py: 1.5 }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paged.map((gm) => {
                const isNeg = gm.balance < 0;
                return (
                  <TableRow
                    key={gm.id}
                    hover
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#F5F5F5' } }}
                    onClick={() => navigate(`/members/${gm.memberId}`)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <MemberAvatar name={gm.member.displayName} size={36} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {gm.member.displayName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={gm.type === 'fixed' ? 'Cố định' : 'Vãng lai'}
                        size="small"
                        sx={{
                          bgcolor: gm.type === 'fixed' ? '#E8F5E9' : '#F5F5F5',
                          color: gm.type === 'fixed' ? '#2E7D32' : '#757575',
                          border: gm.type === 'fixed' ? 'none' : '1px solid #E0E0E0',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {formatPhone(gm.member.phone)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: gm.balance === 0 ? 'text.secondary' : isNeg ? 'error.main' : 'primary.main' }}
                      >
                        {isNeg ? '-' : ''}{formatVND(Math.abs(gm.balance))}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={gm.status === 'active' ? 'Hoạt động' : 'Không HĐ'}
                        size="small"
                        sx={{
                          bgcolor: gm.status === 'active' ? '#E8F5E9' : '#FFEBEE',
                          color: gm.status === 'active' ? '#2E7D32' : '#F44336',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ width: 80 }}>
                      <Box sx={{ display: 'flex', gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
                        <Button size="small" sx={{ minWidth: 0, minHeight: 0, px: 1, fontSize: '0.75rem' }} onClick={() => handleEdit(gm)}>
                          Sửa
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3, flexDirection: 'column', gap: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Hiển thị {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} trên {filtered.length} thành viên
          </Typography>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_e, val) => setPage(val)}
            color="primary"
            size="small"
          />
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <AddMemberDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditTarget(null); }}
        onSave={handleSave}
        mode={editTarget ? 'edit' : 'add'}
        initialData={
          editTarget
            ? {
                displayName: editTarget.member.displayName,
                phone: editTarget.member.phone,
                type: editTarget.type,
                initialBalance: editTarget.balance,
              }
            : undefined
        }
      />
    </Box>
  );
};
