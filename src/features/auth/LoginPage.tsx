import { useState } from 'react';
import type { FC } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  SportsTennis as BadmintonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

export const LoginPage: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
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
            Chào mừng trở lại
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Đăng nhập để quản lý lịch tập và sân đấu của bạn.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Fields */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Tên đăng nhập"
            placeholder="username@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ color: 'text.secondary', fontSize: '1rem' }}>@</Typography>
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ color: 'text.secondary', fontSize: '1rem' }}>🔒</Typography>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Remember me + forgot pw */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5, mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                sx={{ '&.Mui-checked': { color: 'primary.main' } }}
              />
            }
            label={<Typography variant="body2">Ghi nhớ đăng nhập</Typography>}
          />
          <Link component={RouterLink} to="/forgot-password" variant="body2" color="primary">
            Quên mật khẩu?
          </Link>
        </Box>

        {/* Submit */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>

        {/* Social divider */}
        <Divider sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
            Hoặc tiếp tục với
          </Typography>
        </Divider>

        {/* Social buttons */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
          <Button
            variant="outlined"
            fullWidth
            size="large"
            startIcon={
              <Box component="span" sx={{ fontSize: '1.1rem' }}>G</Box>
            }
            sx={{ borderColor: 'divider', color: 'text.primary', minHeight: 48 }}
          >
            Google
          </Button>
          <Button
            variant="outlined"
            fullWidth
            size="large"
            startIcon={
              <Box component="span" sx={{ fontSize: '1.1rem' }}>f</Box>
            }
            sx={{ borderColor: 'divider', color: 'text.primary', minHeight: 48 }}
          >
            Facebook
          </Button>
        </Box>

        {/* Register link */}
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Bạn chưa có tài khoản?{' '}
          <Link component={RouterLink} to="/register" color="primary" sx={{ fontWeight: 600 }}>
            Đăng ký ngay
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};
