# PLAN

## Auth: Username Login + Optional Email

### Done

- Login field accepts username/email.
- Username is required at registration.
- Email is optional.
- Phone is entered at registration only.
- Backend local password auth uses `members.password_hash` + bcrypt.
- Backend login verifies the member exists in DB before session creation.

### Current Flow

1. User registers with username, phone, password, display name, optional email.
2. Backend stores `members.username`, optional `email`, unique `phone`, and bcrypt `password_hash`.
3. User logs in via `/login` with username/email + password.
4. Backend resolves member by username/email and validates password hash.
5. User enters app at `/dashboard`.

### Later: Real Backend/OAuth

- Backend login accepts `identifier` instead of only `email`.
- Identifier resolution: username or email.
- Google/Facebook login should store:
  - `provider`
  - `providerId`
  - `email`
  - `emailVerified`
  - `displayName`
  - `avatarUrl`
- Social login still requires phone verification before app access.
- Do not depend on Google/Facebook phone. Ask user for phone after OAuth.

### OTP Security Later

- Store OTP as hash, not plain text.
- Expiry: 3-5 minutes.
- Resend cooldown: 60s.
- Max attempts: 5.
- Rate limit by phone + IP.
- Do not reveal whether a phone exists during public flows.

## Sessions UI

### Done

- Sessions list card `Số người` value now displays number only, without `người` suffix.

## Edit Shuttlecock Qty In Session Detail

### Status

- Partially implemented in `frontend/src/features/sessions/SessionDetailPage.tsx`.
- UI edits are local/mock-only; persistence is not implemented yet.

### Context

- `SessionDetailPage.tsx` displays session details.
- When `status === 'pending'`, session is not settled and should allow editing shuttlecock quantity.
- `Session` type already has `shuttlecockQty`, `shuttlecockPrice`, `shuttlecockCost`.
- `calcPerPerson()` exists in `utils/format.ts`.
- Mock session `s3` pending has `shuttlecockQty: 0`.

### Implemented

- Local state for `shuttlecockQty`, initialized from `session.shuttlecockQty`.
- Pending-only inline editor with number field and touch-friendly `+/-` buttons.
- Recalculate derived values:
  - `shuttlecockCost = qty * session.shuttlecockPrice`
  - `totalCost = session.courtFee + shuttlecockCost`
  - `perPerson = calcPerPerson(totalCost, session.attendeeCount, 1000)`
  - `remainder = totalCost - perPerson * attendeeCount`
- Display computed shuttlecock cost, total cost, per-person, and remainder when applicable.
- Only allow editing for `pending`; no edit for `settled` or `draft`.

### Remaining

- Persist edits through backend/API when real sessions API exists.
- Add explicit save/confirm behavior if product wants non-instant edits.
- Add tests once session detail has stable API-backed behavior.

### UX Requirements

- Mobile-first.
- Touch targets at least 48px.
- Input font size at least `1rem` to avoid iOS zoom.
- Inline edit inside detail card, no dialog needed.
