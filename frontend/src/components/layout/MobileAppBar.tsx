import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
} from '@mui/material';
import {
  Search as SearchIcon,
  NotificationsOutlined as BellIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials, getAvatarColor, getAvatarTextColor } from '../../utils/format';

export const MobileAppBar: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initials = user ? getInitials(user.displayName) : '?';
  const bgColor = user ? getAvatarColor(user.displayName) : '#E8F5E9';
  const textColor = user ? getAvatarTextColor(user.displayName) : '#2E7D32';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: '#FFFFFF', borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Toolbar sx={{ minHeight: 56, px: 2 }}>
        <Typography
          variant="body1"
          sx={{ flex: 1, fontWeight: 700, color: 'primary.main', fontSize: '1rem' }}
        >
          The Court &amp; Canvas
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="medium" sx={{ color: 'text.secondary' }}>
            <SearchIcon sx={{ fontSize: 22 }} />
          </IconButton>
          <IconButton size="medium" sx={{ color: 'text.secondary' }}>
            <BellIcon sx={{ fontSize: 22 }} />
          </IconButton>
          <IconButton size="small" onClick={() => navigate('/settings')} sx={{ ml: 0.5 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: bgColor,
                color: textColor,
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {initials}
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
