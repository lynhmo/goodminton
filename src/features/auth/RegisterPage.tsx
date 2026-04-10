import { useState } from 'react';
import type { FC } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Divider,
  Link,
  TextField,
  Typography,
  Alert,
  MenuItem,
} from '@mui/material';
import { SportsTennis as BadmintonIcon } from '@mui/icons-material';

export const RegisterPage: FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    inviteCode: '',
    memberType: 'fixed',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.displayName || !form.email || !form.password || !form.phone) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }
    if (form.password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (!/^0\d{9}$/.test(form.phone.replace(/\s/g, ''))) {
      setError('Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 0).');
      return;
    }

    setLoading(true);
    try {
      // Fake register — just redirect to login
      await new Promise((r) => setTimeout(r, 500));
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 440,
          bgcolor: 'background.paper',
          borderRadius: 3,
          p: { xs: 3, sm: 4 },
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <BadmintonIcon sx={{ color: '#fff', fontSize: 28 }} />
          </Box>
          <Typography variant="h2" sx={{ mb: 0.5 }}>
            Tạo tài khoản
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tham gia nhóm cầu lông của bạn ngay hôm nay.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Họ và tên *"
            placeholder="Nguyễn Văn An"
            value={form.displayName}
            onChange={handleChange('displayName')}
            autoComplete="name"
          />
          <TextField
            label="Email *"
            type="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={handleChange('email')}
            autoComplete="email"
          />
          <TextField
            label="Mật khẩu *"
            type="password"
            placeholder="Ít nhất 8 ký tự"
            value={form.password}
            onChange={handleChange('password')}
            autoComplete="new-password"
          />
          <TextField
            label="Xác nhận mật khẩu *"
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            autoComplete="new-password"
          />
          <TextField
            label="Số điện thoại *"
            placeholder="0912 345 678"
            value={form.phone}
            onChange={handleChange('phone')}
            autoComplete="tel"
          />
          <TextField
            label="Loại thành viên"
            select
            value={form.memberType}
            onChange={handleChange('memberType')}
          >
            <MenuItem value="fixed">Cố định</MenuItem>
            <MenuItem value="guest">Vãng lai</MenuItem>
          </TextField>
          <TextField
            label="Mã mời (không bắt buộc)"
            placeholder="Nhập mã từ trưởng nhóm"
            value={form.inviteCode}
            onChange={handleChange('inviteCode')}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </Button>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Đã có tài khoản?{' '}
          <Link component={RouterLink} to="/login" color="primary" sx={{ fontWeight: 600 }}>
            Đăng nhập
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};
