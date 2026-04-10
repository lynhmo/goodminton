import type { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppShell } from './components/layout/AppShell';

// Pages
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { MembersPage } from './features/members/MembersPage';
import { MemberDetailPage } from './features/members/MemberDetailPage';
import { SessionsPage } from './features/sessions/SessionsPage';
import { SessionCreatePage } from './features/sessions/SessionCreatePage';
import { SessionDetailPage } from './features/sessions/SessionDetailPage';
import { RankingsPage } from './features/rankings/RankingsPage';

// ─── Auth Guard ───────────────────────────────────────────────────────────────

const AuthGuard: FC = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────

const AppRoutes: FC = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected */}
      <Route element={<AuthGuard />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/members/:memberId" element={<MemberDetailPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/sessions/new" element={<SessionCreatePage />} />
        <Route path="/sessions/:sessionId" element={<SessionDetailPage />} />
        <Route path="/rankings" element={<RankingsPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App
