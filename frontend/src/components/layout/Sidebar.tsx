import type { FC } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  EmojiEvents as TrophyIcon,
  Settings as SettingsIcon,
  HelpOutlined as HelpIcon,
  PersonAdd as PersonAddIcon,
  SportsTennis as BadmintonIcon,
} from '@mui/icons-material';

const NAV_ITEMS = [
  { label: 'Tổng quan', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Thành viên', icon: <PeopleIcon />, path: '/members' },
  { label: 'Lịch tập & Thu chi', icon: <CalendarIcon />, path: '/sessions' },
  { label: 'Bảng xếp hạng', icon: <TrophyIcon />, path: '/rankings' },
  { label: 'Cài đặt', icon: <SettingsIcon />, path: '/settings' },
];

interface SidebarProps {
  currentPath: string;
  onNavigate: NavigateFunction;
}

export const Sidebar: FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        position: 'sticky',
        top: 0,
        bgcolor: '#F8F9FA',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        pt: 2,
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 2, pb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BadmintonIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2, color: 'text.primary' }}>
            The Court &amp; Canvas
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            Precision Motion
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Nav items */}
      <List sx={{ flex: 1, px: 1, pt: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = currentPath.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              selected={isActive}
              onClick={() => onNavigate(item.path)}
              sx={{
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: '#E8F5E9',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                  '&:hover': { bgcolor: '#D7EDD9' },
                },
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: isActive ? 'primary.main' : 'text.secondary',
                  '& .MuiSvgIcon-root': { fontSize: 20 },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    style: {
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 400,
                    },
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />

      {/* CTA + Help */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          fullWidth
          size="medium"
          onClick={() => onNavigate('/members')}
        >
          Thêm Thành Viên
        </Button>
        <Button
          variant="text"
          startIcon={<HelpIcon />}
          fullWidth
          size="small"
          sx={{ color: 'text.secondary', minHeight: 36 }}
        >
          Hỗ trợ
        </Button>
      </Box>
    </Box>
  );
};
