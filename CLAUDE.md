# Badminton App Rules (Compressed)

**Project**: Badminton group management — Members, sessions, auto split court + shuttle fees, track balance.  
**Stack**: React 18 + TS (strict) + MUI v5 + React Hook Form + Zod + TanStack Query.

## Must Follow

**Code**:
- TS strict — no `any`
- MUI components only (Box, Typography, Button...)
- Styling via `sx` prop, theme colors only (no hex hardcode)
- Functional components + named exports
- Vietnamese UI text
- Feature folder per feature (/auth, /members, /sessions, etc.)

**MOBILE-FIRST (mandatory)**:
- Write mobile first, expand with `sm`/`md` breakpoints
- Touch targets ≥ 48px (all buttons/links)
- BottomNavigation, NOT sidebar
- No horizontal scroll, respect viewport
- Primary actions bottom 1/3 (thumb-zone)
- No hover-only interactions (touch alternative required)
- SwipeableDrawer on mobile
- MUI Skeleton for loading, NOT spinners
- Pull-to-refresh on lists
- FAB for main action per page

## Don't
- Hardcode colors/spacing → use theme
- Raw HTML → use MUI
- CSS files → use `sx`
- `any` type → proper interfaces
- Sidebar on mobile → BottomNavigation
- Desktop-first breakpoints → mobile-first

## State & Forms
- Local: `useState`
- Complex local: `useReducer`
- Shared: Context + useReducer
- Server: TanStack Query
- Forms: React Hook Form + Zod
- Global: Context (theme, auth, notifications)

## Domain: Badminton Group
**Rule**: 1 member = 1 account.

**Entities**: Member, Group, GroupMember, Session, Attendance, Transaction.

**Money split**:
```
Total = court_fee + (shuttle_qty × shuttle_price)
Per person = ROUND_DOWN(Total / attendees)
Remainder → group fund
```

**Formats**: `xxx.xxx VNĐ` | `0xxx xxx xxx` | `Thứ X, DD/MM/YYYY`

**Mobile context**: On court = attendance + cost input + split. After = check balance. Home = member CRUD + stats.
