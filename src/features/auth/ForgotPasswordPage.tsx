import { useState } from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Link,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  SportsTennis as BadmintonIcon,
} from '@mui/icons-material';

export const ForgotPasswordPage: FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSent(true);
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
        sx={{
          width: '100%',
          maxWidth: 400,
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
            Quên mật khẩu?
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Nhập email của bạn để nhận link đặt lại mật khẩu.
          </Typography>
        </Box>

        {sent ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Đã gửi link đặt lại mật khẩu tới <strong>{email}</strong>. Kiểm tra hộp thư của bạn.
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
            >
              {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
            </Button>
          </Box>
        )}

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Link
            component={RouterLink}
            to="/login"
            variant="body2"
            color="text.secondary"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            Quay lại đăng nhập
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
