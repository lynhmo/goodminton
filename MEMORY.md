# MEMORY

## Project

- App: Badminton group management, mobile-first, React + TypeScript + MUI.
- Primary domain: members, sessions, attendance, split court/shuttlecock costs, group finance.
- UI text: Vietnamese.
- Styling: MUI components + `sx`, no raw CSS unless existing pattern requires it.
- Build command used: `npm run build` inside `frontend/`.

## Current Auth Decisions

- Username is required for local accounts and is unique in `members.username`.
- Email is optional in `members.email`.
- Phone is collected during registration only and remains unique.
- Password login is username/email + password using local `members.password_hash` + bcrypt.
- Supabase Auth is not used for local password login.
- Backend login checks that the user exists in DB before creating a session.

## Auth Files

- `frontend/src/features/auth/LoginPage.tsx`: login field uses username/email identifier.
- `frontend/src/features/auth/VerifyPhonePage.tsx`: mock OTP verify page.
- `frontend/src/contexts/AuthContext.tsx`: mock `login(identifier, password)` and `verifyPhone(phone, otp)`.
- `frontend/src/App.tsx`: protected routes require only authenticated user.
- `frontend/src/types/index.ts`: `AuthUser` includes required `username`, optional `email`, `phone?`, and `phoneVerified`.
- `frontend/src/mocks/data.ts`: `mockAuthUser` includes phone verification fields.

## Social Login Decision

- Google/Facebook should collect `provider`, `providerId`, `email`, `emailVerified`, `displayName`, `avatarUrl`.
- Do not rely on phone from Google/Facebook.
- Social phone verification policy is deferred.

## Sessions UI Decisions

- In sessions list, `Số người` value should be number only, no `người` suffix.
- Changed in `frontend/src/features/sessions/SessionsPage.tsx`.

## Pending Work

- Wire frontend auth pages to real `/api/auth/login` and `/api/auth/register`.
- Replace mock OTP with SMS/Zalo ZNS later.
- Implement inline edit shuttlecock quantity for pending session detail.

## Verification

- Latest frontend build after auth/OTP changes: passed.
- Warning remains: bundle chunk >500kB, unrelated.
