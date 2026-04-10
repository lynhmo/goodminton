---
name: react-typescript-patterns
description: React + TypeScript development patterns for building type-safe, scalable UI components with hooks, context, and modern React features.
origin: badminton-app
---

# React + TypeScript Development Patterns

Chuẩn mực phát triển giao diện với React và TypeScript cho ứng dụng Badminton.

## When to Activate

- Tạo mới hoặc chỉnh sửa React components
- Quản lý state với hooks (useState, useReducer, useContext)
- Tạo custom hooks
- Thiết kế type-safe props và interfaces
- Tối ưu performance (memoization, lazy loading)
- Xử lý forms, validation, và data fetching
- Routing và navigation

## Project Convention

- **Language**: TypeScript strict mode
- **UI Library**: MUI (Material UI) v5+
- **State Management**: React Context + useReducer cho global state, useState cho local state
- **Data Fetching**: React Query (TanStack Query) hoặc SWR
- **Form Management**: React Hook Form + Zod validation
- **Routing**: React Router v6+
- **Styling**: MUI sx prop + styled-components khi cần custom

## Component Architecture

### Folder Structure

```
src/
├── components/          # Shared/reusable components
│   ├── common/          # Button, Input, Card, Modal...
│   ├── layout/          # Header, Sidebar, Footer, PageContainer
│   └── feedback/        # Snackbar, Alert, Loading, ErrorBoundary
├── features/            # Feature-based modules
│   ├── courts/          # Sân cầu lông
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── bookings/        # Đặt sân
│   ├── players/         # Quản lý người chơi
│   ├── matches/         # Trận đấu
│   ├── tournaments/     # Giải đấu
│   └── dashboard/       # Tổng quan
├── hooks/               # Global custom hooks
├── services/            # API services
├── types/               # Shared TypeScript types
├── utils/               # Utility functions
├── theme/               # MUI theme customization
└── App.tsx
```

### Component Template

```typescript
// ✅ GOOD: Type-safe functional component
import { FC, memo } from 'react';
import { Box, Typography } from '@mui/material';

interface CourtCardProps {
  courtId: string;
  name: string;
  status: 'available' | 'occupied' | 'maintenance';
  onSelect?: (courtId: string) => void;
}

export const CourtCard: FC<CourtCardProps> = memo(({ courtId, name, status, onSelect }) => {
  const statusColor = {
    available: 'success.main',
    occupied: 'error.main',
    maintenance: 'warning.main',
  } as const;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        cursor: onSelect ? 'pointer' : 'default',
        '&:hover': onSelect ? { bgcolor: 'action.hover' } : {},
      }}
      onClick={() => onSelect?.(courtId)}
    >
      <Typography variant="h6">{name}</Typography>
      <Typography variant="body2" color={statusColor[status]}>
        {status === 'available' ? 'Trống' : status === 'occupied' ? 'Đang sử dụng' : 'Bảo trì'}
      </Typography>
    </Box>
  );
});

CourtCard.displayName = 'CourtCard';
```

### Compound Component Pattern

```typescript
import { createContext, useContext, useState, FC, ReactNode } from 'react';
import { Tabs as MuiTabs, Tab as MuiTab, Box } from '@mui/material';

interface TabsContextValue {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab components must be used within <Tabs>');
  return context;
}

interface TabsProps {
  children: ReactNode;
  defaultTab?: number;
}

export const Tabs: FC<TabsProps> & {
  List: typeof TabList;
  Panel: typeof TabPanel;
} = ({ children, defaultTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
};

const TabList: FC<{ labels: string[] }> = ({ labels }) => {
  const { activeTab, setActiveTab } = useTabsContext();
  return (
    <MuiTabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
      {labels.map((label) => (
        <MuiTab key={label} label={label} />
      ))}
    </MuiTabs>
  );
};

const TabPanel: FC<{ index: number; children: ReactNode }> = ({ index, children }) => {
  const { activeTab } = useTabsContext();
  return activeTab === index ? <Box sx={{ py: 2 }}>{children}</Box> : null;
};

Tabs.List = TabList;
Tabs.Panel = TabPanel;
```

## Custom Hooks Patterns

### useBookingForm - Domain-specific hook

```typescript
import { useState, useCallback } from 'react';
import { z } from 'zod';

const bookingSchema = z.object({
  courtId: z.string().min(1, 'Chọn sân'),
  date: z.string().min(1, 'Chọn ngày'),
  startTime: z.string().min(1, 'Chọn giờ bắt đầu'),
  endTime: z.string().min(1, 'Chọn giờ kết thúc'),
  playerCount: z.number().min(2).max(4),
});

type BookingForm = z.infer<typeof bookingSchema>;

export function useBookingForm() {
  const [form, setForm] = useState<Partial<BookingForm>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = useCallback(<K extends keyof BookingForm>(
    field: K,
    value: BookingForm[K]
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  const validate = useCallback((): BookingForm | null => {
    const result = bookingSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return null;
    }
    return result.data;
  }, [form]);

  const reset = useCallback(() => {
    setForm({});
    setErrors({});
  }, []);

  return { form, errors, updateField, validate, reset };
}
```

### useDebounce

```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

### useLocalStorage

```typescript
import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const nextValue = value instanceof Function ? value(prev) : value;
      window.localStorage.setItem(key, JSON.stringify(nextValue));
      return nextValue;
    });
  }, [key]);

  return [storedValue, setValue];
}
```

## State Management

### Context + Reducer cho Feature State

```typescript
import { createContext, useContext, useReducer, FC, ReactNode, Dispatch } from 'react';

// Types
interface Match {
  id: string;
  courtId: string;
  players: string[];
  score: [number, number];
  status: 'pending' | 'playing' | 'completed';
}

interface MatchState {
  matches: Match[];
  currentMatch: Match | null;
  loading: boolean;
  error: string | null;
}

type MatchAction =
  | { type: 'SET_MATCHES'; payload: Match[] }
  | { type: 'SET_CURRENT'; payload: Match }
  | { type: 'UPDATE_SCORE'; payload: { matchId: string; score: [number, number] } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Reducer
function matchReducer(state: MatchState, action: MatchAction): MatchState {
  switch (action.type) {
    case 'SET_MATCHES':
      return { ...state, matches: action.payload, loading: false };
    case 'SET_CURRENT':
      return { ...state, currentMatch: action.payload };
    case 'UPDATE_SCORE':
      return {
        ...state,
        matches: state.matches.map(m =>
          m.id === action.payload.matchId ? { ...m, score: action.payload.score } : m
        ),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

// Context
const MatchContext = createContext<{
  state: MatchState;
  dispatch: Dispatch<MatchAction>;
} | undefined>(undefined);

export const MatchProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(matchReducer, {
    matches: [],
    currentMatch: null,
    loading: false,
    error: null,
  });

  return (
    <MatchContext.Provider value={{ state, dispatch }}>
      {children}
    </MatchContext.Provider>
  );
};

export function useMatch() {
  const context = useContext(MatchContext);
  if (!context) throw new Error('useMatch must be used within MatchProvider');
  return context;
}
```

## Performance Optimization

### React.memo + useMemo + useCallback

```typescript
import { memo, useMemo, useCallback } from 'react';

// ✅ Memoize expensive list filtering
const PlayerList: FC<{ players: Player[]; searchQuery: string }> = memo(({ players, searchQuery }) => {
  const filteredPlayers = useMemo(
    () => players.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [players, searchQuery]
  );

  return (
    <List>
      {filteredPlayers.map(player => (
        <PlayerListItem key={player.id} player={player} />
      ))}
    </List>
  );
});

// ✅ Stable callback reference
const ParentComponent: FC = () => {
  const handleSelect = useCallback((playerId: string) => {
    // handle selection
  }, []);

  return <PlayerList players={players} searchQuery={query} />;
};
```

### Lazy Loading Routes

```typescript
import { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

const Dashboard = lazy(() => import('./features/dashboard'));
const Courts = lazy(() => import('./features/courts'));
const Bookings = lazy(() => import('./features/bookings'));
const Tournaments = lazy(() => import('./features/tournaments'));

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
    <CircularProgress />
  </Box>
);

// In router
<Suspense fallback={<LoadingFallback />}>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/courts" element={<Courts />} />
    <Route path="/bookings" element={<Bookings />} />
    <Route path="/tournaments" element={<Tournaments />} />
  </Routes>
</Suspense>
```

## TypeScript Best Practices

### Discriminated Unions for API Responses

```typescript
type ApiResponse<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function renderResponse<T>(response: ApiResponse<T>, renderData: (data: T) => ReactNode) {
  switch (response.status) {
    case 'loading':
      return <CircularProgress />;
    case 'error':
      return <Alert severity="error">{response.error}</Alert>;
    case 'success':
      return renderData(response.data);
  }
}
```

### Utility Types for Domain Models

```typescript
// Base entity
interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Domain models
interface Court extends BaseEntity {
  name: string;
  location: string;
  type: 'indoor' | 'outdoor';
  pricePerHour: number;
  status: 'available' | 'occupied' | 'maintenance';
}

interface Player extends BaseEntity {
  name: string;
  phone: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  avatarUrl?: string;
}

interface Booking extends BaseEntity {
  courtId: string;
  playerId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
}

// Form types (omit auto-generated fields)
type CreateCourtInput = Omit<Court, keyof BaseEntity>;
type UpdateCourtInput = Partial<CreateCourtInput>;

// List item (pick only needed fields)
type CourtListItem = Pick<Court, 'id' | 'name' | 'status' | 'pricePerHour'>;
```

## Error Handling

### ErrorBoundary Component

```typescript
import { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Button, Box } from '@mui/material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Box sx={{ p: 3 }}>
          <Alert
            severity="error"
            action={
              <Button color="inherit" onClick={() => this.setState({ hasError: false, error: null })}>
                Thử lại
              </Button>
            }
          >
            Đã xảy ra lỗi: {this.state.error?.message}
          </Alert>
        </Box>
      );
    }
    return this.props.children;
  }
}
```

## Checklist

- [ ] Tất cả components đều có TypeScript interfaces cho props
- [ ] Không dùng `any` — sử dụng `unknown` + type guards khi cần
- [ ] Custom hooks bắt đầu bằng `use` prefix
- [ ] Memoize expensive computations với useMemo
- [ ] Stable callback references với useCallback khi pass xuống child
- [ ] Error boundaries bao quanh feature modules
- [ ] Lazy loading cho route-level components
- [ ] Tất cả forms có Zod validation schema
- [ ] API responses xử lý loading, success, error states
- [ ] Không có console.log trong production code
