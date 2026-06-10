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
      <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' }, width: 240, flexShrink: 0 }}>
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
          maxWidth: '100%',
          overflowX: 'hidden',
        }}
      >
        {/* Mobile AppBar — visible below md */}
        <Box sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }}>
          <MobileAppBar />
        </Box>

        {/* Page content */}
        <Box
          sx={{
            flex: 1,
            px: { xs: 2, sm: 2, md: 3 },
            pt: { xs: 2, sm: 2, md: 3 },
            pb: { xs: 'calc(64px + env(safe-area-inset-bottom, 0px))', sm: 'calc(64px + env(safe-area-inset-bottom, 0px))', md: 3 },
            maxWidth: { md: 1200 },
            width: '100%',
            boxSizing: 'border-box',
            overflowX: 'hidden',
            mx: { md: 'auto' },
          }}
        >
          {children}
        </Box>

        {/* Mobile BottomNav — visible below md */}
        <Box sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }}>
          <Paper
            elevation={0}
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              width: '100%',
              maxWidth: '100vw',
              overflowX: 'hidden',
              zIndex: 1100,
              pb: 'env(safe-area-inset-bottom, 0px)',
            }}
          >
            <BottomNavigation
              value={currentTab}
              onChange={(_e, newValue: number) => navigate(NAV_ITEMS[newValue].path)}
              sx={{ height: 64, width: '100%', maxWidth: '100%', overflowX: 'hidden' }}
            >
              {NAV_ITEMS.map((item) => (
                <BottomNavigationAction
                  key={item.path}
                  label={item.label}
                  icon={item.icon}
                  disableRipple
                  showLabel
                  sx={{
                    flex: '1 1 0',
                    minWidth: 0,
                    maxWidth: 'none',
                    px: 0.5,
                    pt: 0.75,
                    pb: 0.5,
                    border: 0,
                    outline: 'none',
                    '& .MuiBottomNavigationAction-label': {
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      opacity: 1,
                      fontSize: '0.75rem',
                      lineHeight: 1.2,
                      transform: 'none',
                    },
                    '&:focus': {
                      outline: 'none',
                    },
                    '&:focus-visible': {
                      outline: '2px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: 2,
                    },
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
