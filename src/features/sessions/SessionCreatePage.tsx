import { useState, useMemo } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  Switch,
  TextField,
  Typography,
  IconButton,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  SelectAll as SelectAllIcon,
} from '@mui/icons-material';
import { mockGroupMembers } from '../../mocks/data';
import {
  formatVND,
  getInitials,
  getAvatarColor,
  getAvatarTextColor,
  calcPerPerson,
} from '../../utils/format';

// ─── Section Card wrapper ─────────────────────────────────────────────────────

const SectionCard: FC<{ title: string; icon?: string; children: React.ReactNode }> = ({
  title,
  icon,
  children,
}) => (
  <Card sx={{ mb: 2 }}>
    <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        {icon && (
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              bgcolor: '#E8F5E9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
            }}
          >
            {icon}
          </Box>
        )}
        <Typography variant="h6">{title}</Typography>
      </Box>
      {children}
    </CardContent>
  </Card>
);

// ─── Session Create Page ──────────────────────────────────────────────────────

export const SessionCreatePage: FC = () => {
  const navigate = useNavigate();

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [courtFee, setCourtFee] = useState('450000');
  const [shuttlecockQty, setShuttlecockQty] = useState('12');
  const [shuttlecockPrice, setShuttlecockPrice] = useState('25000');
  const [search, setSearch] = useState('');
  const [attendance, setAttendance] = useState<Record<string, boolean>>(
    Object.fromEntries(mockGroupMembers.map((gm) => [gm.id, gm.type === 'fixed']))
  );
  const [saved, setSaved] = useState(false);

  // Derived calculations
  const courtFeeNum = Number(courtFee) || 0;
  const shuttlecockQtyNum = Number(shuttlecockQty) || 0;
  const shuttlecockPriceNum = Number(shuttlecockPrice) || 0;
  const shuttlecockCost = shuttlecockQtyNum * shuttlecockPriceNum;
  const totalCost = courtFeeNum + shuttlecockCost;
  const presentCount = Object.values(attendance).filter(Boolean).length;
  const perPerson = calcPerPerson(totalCost, presentCount, 1000);
  const remainder = totalCost - perPerson * presentCount;

  const filteredMembers = useMemo(
    () =>
      mockGroupMembers.filter((gm) =>
        gm.member.displayName.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const toggleMember = (id: string) =>
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));

  const selectAllFixed = () =>
    setAttendance((prev) =>
      Object.fromEntries(
        mockGroupMembers.map((gm) => [gm.id, gm.type === 'fixed' || prev[gm.id]])
      )
    );

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => navigate('/sessions'), 800);
  };

  return (
    <Box sx={{ pb: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <IconButton onClick={() => navigate('/sessions')} sx={{ color: 'text.secondary' }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h2">Lịch tập &amp; Thu chi</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Quản lý chi tiết buổi tập, điểm danh thành viên và tự động hoá việc tính toán chi phí sân bãi linh hoạt.
          </Typography>
        </Box>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Đã lưu buổi tập thành công!
        </Alert>
      )}

      {/* Section 1: Thông tin buổi tập */}
      <SectionCard title="Thông tin buổi tập" icon="📅">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Chọn ngày tập"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            slotProps={{ htmlInput: { max: new Date().toISOString().split('T')[0] }, inputLabel: { shrink: true } }}
          />
          <TextField
            label="Ghi chú (không bắt buộc)"
            placeholder="Ví dụ: Buổi tập thường lệ thứ 3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            multiline
            rows={2}
          />
        </Box>
      </SectionCard>

      {/* Section 2: Chi phí */}
      <SectionCard title="Chi phí" icon="💰">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Tiền sân (VNĐ)"
            type="number"
            value={courtFee}
            onChange={(e) => setCourtFee(e.target.value)}
            slotProps={{ input: { endAdornment: <InputAdornment position="end">VNĐ</InputAdornment> }, htmlInput: { min: 0, step: 50000 } }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Số quả cầu đã dùng"
              type="number"
              value={shuttlecockQty}
              onChange={(e) => setShuttlecockQty(e.target.value)}
              slotProps={{ htmlInput: { min: 0 } }}
            />
            <TextField
              label="Giá mỗi quả (VNĐ)"
              type="number"
              value={shuttlecockPrice}
              onChange={(e) => setShuttlecockPrice(e.target.value)}
              slotProps={{ input: { endAdornment: <InputAdornment position="end">VNĐ</InputAdornment> }, htmlInput: { min: 0, step: 1000 } }}
            />
          </Box>

          {/* Auto-calc summary */}
          {totalCost > 0 && (
            <Box
              sx={{
                bgcolor: '#F8F9FA',
                borderRadius: 2,
                p: 1.5,
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Tiền cầu
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatVND(shuttlecockCost)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Tổng chi phí
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{formatVND(totalCost)}</Typography>
              </Box>
            </Box>
          )}
        </Box>
      </SectionCard>

      {/* Section 3: Điểm danh */}
      <SectionCard title={`Điểm danh (${presentCount}/${mockGroupMembers.length})`} icon="✅">
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Tìm thành viên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, '& .MuiOutlinedInput-root': { minHeight: 40 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            variant="outlined"
            size="small"
            startIcon={<SelectAllIcon />}
            onClick={selectAllFixed}
            sx={{ flexShrink: 0, borderColor: 'divider', color: 'text.secondary', fontSize: '0.75rem', minHeight: 40 }}
          >
            Chọn tất cả CĐ
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {filteredMembers.map((gm, idx) => {
            const isPresent = attendance[gm.id] ?? false;
            return (
              <Box key={gm.id}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: 1.25,
                    gap: 1.5,
                    cursor: 'pointer',
                    opacity: isPresent ? 1 : 0.6,
                  }}
                  onClick={() => toggleMember(gm.id)}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: getAvatarColor(gm.member.displayName),
                      color: getAvatarTextColor(gm.member.displayName),
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(gm.member.displayName)}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.3 }} noWrap>
                      {gm.member.displayName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {gm.type === 'fixed' ? 'Thành viên nòng cốt' : 'Khách mời'}
                    </Typography>
                  </Box>
                  <Switch
                    checked={isPresent}
                    onChange={() => toggleMember(gm.id)}
                    color="primary"
                    size="medium"
                    onClick={(e) => e.stopPropagation()}
                  />
                </Box>
                {idx < filteredMembers.length - 1 && <Divider />}
              </Box>
            );
          })}
        </Box>

        <Button
          variant="text"
          startIcon={<span>👤+</span>}
          fullWidth
          sx={{ mt: 1, color: 'primary.main', minHeight: 44, fontSize: '0.875rem' }}
        >
          Thêm khách ngoài danh sách
        </Button>
      </SectionCard>

      {/* Section 4: Kết quả (sticky summary) */}
      <Card
        sx={{
          bgcolor: '#F8FBF8',
          border: '2px solid',
          borderColor: 'primary.light',
          mb: 2,
        }}
      >
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Typography variant="h6" sx={{ mb: 1.5, color: 'primary.main' }}>
            TỔNG KẾT DỰ KIẾN
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
            Số tiền mỗi người = (Tiền sân + Tiền cầu) / Tổng người đi
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>
                Tổng
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>{formatVND(totalCost)}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>
                Số người
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>{presentCount} người</Typography>
            </Box>
            {remainder > 0 && (
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Dư vào quỹ
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.secondary' }}>{formatVND(remainder)}</Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ mb: 1.5 }} />

          <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 600, letterSpacing: 0.5 }}>
            Số tiền phải đóng
          </Typography>
          <Typography
            variant="h2"
            sx={{
              color: 'primary.main',
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.5rem' },
              letterSpacing: -0.5,
            }}
          >
            {presentCount > 0 ? formatVND(perPerson) : '—'}
          </Typography>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          size="large"
          onClick={() => navigate('/sessions')}
          sx={{ borderColor: 'divider', color: 'text.secondary' }}
        >
          Lưu bản nháp
        </Button>
        <Button
          variant="contained"
          fullWidth
          size="large"
          disabled={presentCount === 0 || totalCost === 0 || saved}
          onClick={handleSave}
        >
          Lưu buổi tập
        </Button>
      </Box>
    </Box>
  );
};
