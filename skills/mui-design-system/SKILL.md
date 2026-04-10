---
name: mui-design-system
description: Material UI (MUI) design system patterns — theme customization, component usage, responsive layout, and Material Design principles for React + TypeScript applications.
origin: badminton-app
---

# MUI Design System Patterns

Hướng dẫn thiết kế giao diện với Material UI (MUI) theo chuẩn Material Design cho ứng dụng Badminton.

## When to Activate

- Tạo hoặc customize MUI theme
- Xây dựng layout với MUI Grid/Container/Box
- Sử dụng MUI components (Button, TextField, Card, Dialog...)
- Thiết kế responsive UI
- Tạo design tokens (colors, spacing, typography)
- Dark/Light mode
- Tạo custom components dựa trên MUI

## Theme Configuration

### Base Theme Setup

```typescript
// src/theme/theme.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Design tokens
const tokens = {
  colors: {
    primary: {
      main: '#1976D2',      // Xanh dương chính
      light: '#42A5F5',
      dark: '#1565C0',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4CAF50',      // Xanh lá — badminton court green
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#FFFFFF',
    },
    accent: {
      shuttlecock: '#FFD700',  // Vàng cầu lông
      court: '#2E7D32',       // Xanh sân
      net: '#BDBDBD',         // Xám lưới
    },
    status: {
      available: '#4CAF50',
      occupied: '#F44336',
      maintenance: '#FF9800',
      pending: '#2196F3',
    },
  },
  spacing: {
    unit: 8,  // 8px base — MUI default
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: '50%',
  },
  shadows: {
    card: '0 2px 8px rgba(0,0,0,0.08)',
    cardHover: '0 4px 16px rgba(0,0,0,0.12)',
    dialog: '0 8px 32px rgba(0,0,0,0.16)',
  },
};

let theme = createTheme({
  palette: {
    primary: tokens.colors.primary,
    secondary: tokens.colors.secondary,
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',  // Không viết hoa tất cả
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: tokens.borderRadius.md,
  },
  components: {
    // Global component overrides
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.md,
          padding: '8px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: tokens.colors.primary.dark,
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.lg,
          boxShadow: tokens.shadows.card,
          transition: 'box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: tokens.shadows.cardHover,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: tokens.borderRadius.md,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: tokens.borderRadius.xl,
          boxShadow: tokens.shadows.dialog,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.sm,
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
        },
      },
      defaultProps: {
        color: 'default',
        elevation: 0,
      },
    },
  },
});

// Responsive font sizes
theme = responsiveFontSizes(theme);

export { theme, tokens };
```

### Dark Mode Support

```typescript
// src/theme/ThemeProvider.tsx
import { FC, ReactNode, createContext, useContext, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { useLocalStorage } from '../hooks/useLocalStorage';

type ThemeMode = 'light' | 'dark';

const ThemeModeContext = createContext<{
  mode: ThemeMode;
  toggleMode: () => void;
}>({ mode: 'light', toggleMode: () => {} });

export const useThemeMode = () => useContext(ThemeModeContext);

export const AppThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useLocalStorage<ThemeMode>('theme-mode', 'light');

  const toggleMode = () => setMode(prev => (prev === 'light' ? 'dark' : 'light'));

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#1976D2' },
          secondary: { main: '#4CAF50' },
          ...(mode === 'dark' && {
            background: {
              default: '#121212',
              paper: '#1E1E1E',
            },
          }),
        },
        // ...other theme options
      }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
};
```

## Layout Patterns

### App Shell Layout

```typescript
// src/components/layout/AppLayout.tsx
import { FC, ReactNode, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Box, IconButton, useTheme,
  useMediaQuery, Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  SportsTennis as CourtIcon,
  EventNote as BookingIcon,
  EmojiEvents as TournamentIcon,
  People as PlayersIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 260;

const menuItems = [
  { label: 'Tổng quan', icon: <DashboardIcon />, path: '/' },
  { label: 'Sân cầu', icon: <CourtIcon />, path: '/courts' },
  { label: 'Đặt sân', icon: <BookingIcon />, path: '/bookings' },
  { label: 'Giải đấu', icon: <TournamentIcon />, path: '/tournaments' },
  { label: 'Người chơi', icon: <PlayersIcon />, path: '/players' },
  { label: 'Cài đặt', icon: <SettingsIcon />, path: '/settings' },
];

export const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const navigate = useNavigate();
  const location = useLocation();

  const drawerContent = (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography variant="h5" fontWeight={700} color="primary">
          🏸 Badminton App
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setDrawerOpen(false);
            }}
            sx={{
              mx: 1,
              borderRadius: 2,
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': { color: 'inherit' },
                '&:hover': { bgcolor: 'primary.dark' },
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" onClick={() => setDrawerOpen(!drawerOpen)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap>
            {menuItems.find(i => i.path === location.pathname)?.label ?? 'Badminton App'}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: !isMobile && drawerOpen ? `${DRAWER_WIDTH}px` : 0,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};
```

### Responsive Grid Layout

```typescript
// ✅ GOOD: MUI Grid responsive layout
import { Grid, Card, CardContent, Typography } from '@mui/material';

<Grid container spacing={3}>
  {/* Stats cards - 4 columns on desktop, 2 on tablet, 1 on mobile */}
  {statsCards.map((stat) => (
    <Grid item xs={12} sm={6} md={3} key={stat.label}>
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
          <Typography variant="h4" fontWeight={700}>{stat.value}</Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}

  {/* Main content area + sidebar */}
  <Grid item xs={12} md={8}>
    {/* Main content */}
  </Grid>
  <Grid item xs={12} md={4}>
    {/* Sidebar */}
  </Grid>
</Grid>
```

## Component Patterns

### Data Table with MUI DataGrid

```typescript
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Chip, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Tên sân', flex: 1, minWidth: 150 },
  { field: 'type', headerName: 'Loại', width: 120 },
  {
    field: 'status',
    headerName: 'Trạng thái',
    width: 140,
    renderCell: (params: GridRenderCellParams) => {
      const colorMap: Record<string, 'success' | 'error' | 'warning'> = {
        available: 'success',
        occupied: 'error',
        maintenance: 'warning',
      };
      const labelMap: Record<string, string> = {
        available: 'Trống',
        occupied: 'Đang dùng',
        maintenance: 'Bảo trì',
      };
      return (
        <Chip
          label={labelMap[params.value] ?? params.value}
          color={colorMap[params.value] ?? 'default'}
          size="small"
        />
      );
    },
  },
  {
    field: 'pricePerHour',
    headerName: 'Giá/giờ',
    width: 120,
    valueFormatter: (params) => `${params.value?.toLocaleString('vi-VN')}đ`,
  },
  {
    field: 'actions',
    headerName: 'Thao tác',
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <>
        <Tooltip title="Sửa">
          <IconButton size="small" onClick={() => handleEdit(params.row)}>
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Xóa">
          <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)}>
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </>
    ),
  },
];

<DataGrid
  rows={courts}
  columns={columns}
  autoHeight
  pageSizeOptions={[10, 25, 50]}
  initialState={{
    pagination: { paginationModel: { pageSize: 10 } },
  }}
  disableRowSelectionOnClick
  sx={{
    border: 'none',
    '& .MuiDataGrid-cell': { borderColor: 'divider' },
    '& .MuiDataGrid-columnHeaders': {
      bgcolor: 'grey.50',
      borderBottom: 2,
      borderColor: 'divider',
    },
  }}
/>
```

### Form Dialog

```typescript
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, MenuItem,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const courtSchema = z.object({
  name: z.string().min(1, 'Nhập tên sân'),
  type: z.enum(['indoor', 'outdoor']),
  pricePerHour: z.number().min(0, 'Giá phải >= 0'),
  location: z.string().min(1, 'Nhập vị trí'),
});

type CourtFormData = z.infer<typeof courtSchema>;

interface CourtDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CourtFormData) => void;
  initialValues?: Partial<CourtFormData>;
}

export const CourtDialog: FC<CourtDialogProps> = ({ open, onClose, onSubmit, initialValues }) => {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<CourtFormData>({
    resolver: zodResolver(courtSchema),
    defaultValues: {
      name: '',
      type: 'indoor',
      pricePerHour: 0,
      location: '',
      ...initialValues,
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialValues ? 'Sửa sân' : 'Thêm sân mới'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên sân"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <TextField {...field} select label="Loại sân" fullWidth>
                  <MenuItem value="indoor">Trong nhà</MenuItem>
                  <MenuItem value="outdoor">Ngoài trời</MenuItem>
                </TextField>
              )}
            />
            <Controller
              name="pricePerHour"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Giá/giờ (VNĐ)"
                  error={!!errors.pricePerHour}
                  helperText={errors.pricePerHour?.message}
                  fullWidth
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Vị trí"
                  error={!!errors.location}
                  helperText={errors.location?.message}
                  fullWidth
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">Hủy</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {initialValues ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
```

### Notification Snackbar System

```typescript
import { createContext, useContext, useState, useCallback, FC, ReactNode } from 'react';
import { Snackbar, Alert, AlertProps } from '@mui/material';

interface Notification {
  id: string;
  message: string;
  severity: AlertProps['severity'];
}

interface NotificationContextValue {
  notify: (message: string, severity?: AlertProps['severity']) => void;
}

const NotificationContext = createContext<NotificationContextValue>({ notify: () => {} });

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((message: string, severity: AlertProps['severity'] = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, severity }]);
  }, []);

  const close = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notifications.map((n, index) => (
        <Snackbar
          key={n.id}
          open
          autoHideDuration={4000}
          onClose={() => close(n.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{ bottom: `${(index * 60) + 24}px !important` }}
        >
          <Alert severity={n.severity} onClose={() => close(n.id)} variant="filled">
            {n.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};
```

## Material Design Principles

### Elevation & Hierarchy

```
Elevation levels (Material Design):
- 0dp: Background
- 1dp: Card, Switch, Snackbar
- 2dp: Button (resting)
- 4dp: AppBar, Navigation Drawer
- 6dp: FAB (resting), Snackbar
- 8dp: Bottom Sheet, Side Sheet, Navigation Drawer, Menu
- 12dp: FAB (pressed)
- 16dp: Dialog
- 24dp: Picker
```

### Spacing System

```
4px grid system:
- xs: 4px   (0.5 spacing unit)
- sm: 8px   (1 spacing unit)
- md: 16px  (2 spacing units)
- lg: 24px  (3 spacing units)
- xl: 32px  (4 spacing units)
- 2xl: 48px (6 spacing units)

Usage in MUI sx:
- p: 1  → 8px
- p: 2  → 16px
- p: 3  → 24px
- gap: 2 → 16px
```

### Color Usage Rules

```
Primary: Main brand actions (CTA buttons, active nav, links)
Secondary: Supporting actions (secondary buttons, accents)
Error: Destructive actions, form errors, alerts
Warning: Cautions, "almost errors"
Info: Neutral info, tips
Success: Completed states, positive feedback

Text:
- text.primary: Main content (87% opacity or #212121)
- text.secondary: Supporting text (60% opacity or #757575)
- text.disabled: Disabled content (38% opacity or #9E9E9E)
```

## Responsive Design

### Breakpoints

```typescript
// MUI default breakpoints
// xs: 0px     — Mobile portrait
// sm: 600px   — Mobile landscape / small tablet
// md: 900px   — Tablet
// lg: 1200px  — Desktop
// xl: 1536px  — Large desktop

// Usage with sx prop
<Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: { xs: 2, md: 3 },
    p: { xs: 2, sm: 3, md: 4 },
  }}
/>

// Usage with useMediaQuery
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
```

## Accessibility

### Focus & ARIA

```typescript
// ✅ Accessible button with proper ARIA
<IconButton
  aria-label="Xóa sân"
  onClick={handleDelete}
  color="error"
>
  <DeleteIcon />
</IconButton>

// ✅ Accessible form field
<TextField
  id="court-name"
  label="Tên sân"
  aria-describedby="court-name-helper"
  helperText="Tên sân phải duy nhất"
/>

// ✅ Accessible dialog
<Dialog
  open={open}
  onClose={onClose}
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <DialogTitle id="dialog-title">Xác nhận xóa</DialogTitle>
  <DialogContent>
    <Typography id="dialog-description">
      Bạn có chắc muốn xóa sân này?
    </Typography>
  </DialogContent>
</Dialog>
```

## Checklist

- [ ] Theme đã customize với design tokens phù hợp
- [ ] Tất cả colors dùng từ theme palette, không hardcode hex
- [ ] Spacing sử dụng MUI spacing system (multiples of 8px)
- [ ] Typography sử dụng MUI variants (h1-h6, body1, body2...)
- [ ] Components responsive trên tất cả breakpoints
- [ ] Dark mode hoạt động chính xác
- [ ] Elevation/shadow phù hợp với Material Design guidelines
- [ ] Accessible: ARIA labels, focus visible, contrast ratio ≥ 4.5:1
- [ ] Form fields có label, helperText, error states
- [ ] Loading states dùng Skeleton hoặc CircularProgress
- [ ] Empty states hiển thị placeholder hữu ích
- [ ] Animations sử dụng MUI transitions, không quá 300ms
