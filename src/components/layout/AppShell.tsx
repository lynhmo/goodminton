import type { FC, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { Sidebar } from './Sidebar';
import { MobileAppBar } from './MobileAppBar';

const NAV_ITEMS = [
  { label: 'Tổng quan', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Thành viên', icon: <PeopleIcon />, path: '/members' },
  { label: 'Lịch tập', icon: <CalendarIcon />, path: '/sessions' },
  { label: 'Xếp hạng', icon: <TrophyIcon />, path: '/rankings' },
];

interface AppShellProps {
  children: ReactNode;
}

export const AppShell: FC<AppShellProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = NAV_ITEMS.findIndex((item) =>
    location.pathname.startsWith(item.path),
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Desktop Sidebar — visible md+ */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, width: 240, flexShrink: 0 }}>
        <Sidebar currentPath={location.pathname} onNavigate={navigate} />
      </Box>

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: '100vh',
        }}
      >
        {/* Mobile AppBar — visible xs only */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <MobileAppBar />
        </Box>

        {/* Page content */}
        <Box
          sx={{
            flex: 1,
            px: { xs: 2, md: 3 },
            pt: { xs: 2, md: 3 },
            pb: { xs: 10, md: 3 }, // extra bottom padding for BottomNav on mobile
            maxWidth: { md: 1200 },
            width: '100%',
            mx: { md: 'auto' },
          }}
        >
          {children}
        </Box>

        {/* Mobile BottomNav — visible xs only */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <Paper
            elevation={0}
            sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }}
          >
            <BottomNavigation
              value={currentTab}
              onChange={(_e, newValue: number) => navigate(NAV_ITEMS[newValue].path)}
            >
              {NAV_ITEMS.map((item) => (
                <BottomNavigationAction
                  key={item.path}
                  label={item.label}
                  icon={item.icon}
                  sx={{
                    '&.Mui-selected': {
                      color: 'primary.main',
                    },
                  }}
                />
              ))}
            </BottomNavigation>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};
