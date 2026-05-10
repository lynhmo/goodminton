# CLAUDE.md

Đây là file hướng dẫn cho AI models khi làm việc với dự án Badminton App. File này được tự động đọc bởi Claude Code, Gemini CLI, GitHub Copilot, và các AI coding assistants khác.

## Project Overview

**The Court & Canvas — Precision Motion** — Ứng dụng quản lý **nhóm chơi cầu lông** tại Việt Nam. Chức năng cốt lõi: quản lý thành viên, ghi nhận buổi tập, **chia tiền sân + cầu tự động**, và theo dõi tài chính nhóm. Xây dựng với React + TypeScript + MUI (Material UI).

> **⚠️ MOBILE-FIRST**: App này chủ yếu dùng trên **điện thoại** tại sân cầu lông. Trưởng nhóm điểm danh, nhập chi phí, chia tiền ngay tại sân. Mọi thiết kế phải ưu tiên mobile trước, desktop là phụ.

> **📝 PRD chi tiết**: `docs/PRD.md`  
> **🎨 Design language**: `rules/design-language.md`  
> **🖼️ Mockup UI**: `mockup_ui/` — Ảnh thiết kế desktop + mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Language** | TypeScript (strict mode) |
| **UI Framework** | React 18+ |
| **UI Library** | MUI (Material UI) v5+ — Material Design |
| **State Management** | React Context + useReducer (global), useState (local) |
| **Server State** | TanStack Query (React Query) hoặc SWR |
| **Forms** | React Hook Form + Zod validation |
| **Routing** | React Router v6+ |
| **Build Tool** | Vite |
| **Package Manager** | pnpm (ưu tiên) hoặc npm |

## Architecture

```
src/
├── components/          # Shared UI components
│   ├── common/          # Button, Input, Card, Modal, Avatar
│   ├── layout/          # BottomNav, AppBar, PageContainer, Sidebar
│   └── feedback/        # Snackbar, Alert, Loading, ErrorBoundary
├── features/            # Feature modules (domain-driven)
│   ├── auth/            # Đăng nhập, đăng ký, quên MK, OAuth — mỗi member = 1 account
│   ├── dashboard/       # Tổng quan — stats, thông báo
│   ├── members/         # Thành viên — CRUD, balance, transactions
│   ├── sessions/        # Lịch tập & Thu chi ⭐ CORE — nhập buổi tập, chia tiền
│   ├── rankings/        # Bảng xếp hạng — Top 10
│   └── settings/        # Cài đặt — cấu hình nhóm
├── hooks/               # Custom hooks dùng chung
├── services/            # API layer + auth interceptor
├── guards/              # Route guards (AuthGuard, AdminGuard)
├── types/               # Shared TypeScript types
├── utils/               # Utility functions (formatVND, formatPhone...)
├── theme/               # MUI theme config & design tokens
└── App.tsx
```

## Coding Conventions

### PHẢI tuân theo:

1. **TypeScript strict** — Không dùng `any`. Dùng `unknown` + type guards khi cần
2. **MUI components** — Dùng MUI components (Box, Typography, Button...) thay vì HTML raw
3. **MUI sx prop** — Styling qua `sx={{ }}`, không inline CSS hay className
4. **MUI theme colors** — Dùng `color="primary"` hoặc `sx={{ color: 'text.secondary' }}`, KHÔNG hardcode hex
5. **MUI spacing** — Dùng spacing units (`p: 2` = 16px), KHÔNG hardcode pixels
6. **MUI Typography** — Dùng Typography component với proper variants (h1-h6, body1, body2)
7. **Functional components** — Dùng FC + arrow functions, không class components
8. **Named exports** — `export const MyComponent`, không default exports
9. **Tiếng Việt** — UI text, labels, messages bằng tiếng Việt
10. **Feature-based structure** — Mỗi feature có folder riêng với components/, hooks/, services/, types/

### MOBILE-FIRST Rules (BẮT BUỘC):

11. **Mobile-first responsive** — Viết styles cho mobile trước, dùng `sm`/`md` breakpoints mở rộng lên
12. **Touch targets ≥ 48px** — Tất cả buttons, links, interactive elements phải ≥ 48x48px
13. **BottomNavigation** — Navigation chính dùng MUI BottomNavigation, KHÔNG sidebar trên mobile
14. **Viewport-safe** — Không horizontal scroll, content fit 100vw, respect safe-area-inset
15. **Thumb-zone friendly** — Primary actions đặt ở vùng ngón cái chạm được (bottom 1/3 màn hình)
16. **No hover-only interactions** — Mọi hover effect phải có touch equivalent
17. **SwipeableDrawer** — Dùng SwipeableDrawer thay Drawer trên mobile cho gesture support
18. **Skeleton loading** — Dùng MUI Skeleton cho loading states thay vì spinner toàn trang
19. **Pull-to-refresh** — Lists phải support pull-to-refresh pattern
20. **FAB cho primary action** — Dùng FloatingActionButton cho action chính mỗi page (đặt sân, ghi điểm...)

### KHÔNG làm:

- ❌ Hardcode colors: `sx={{ color: '#ff0000' }}` → ✅ `sx={{ color: 'error.main' }}`
- ❌ Hardcode spacing: `style={{ padding: '16px' }}` → ✅ `sx={{ p: 2 }}`
- ❌ Raw HTML: `<button>` → ✅ `<Button variant="contained">`
- ❌ CSS files cho components → ✅ MUI `sx` prop hoặc `styled()`
- ❌ `any` type → ✅ proper interfaces/types
- ❌ `console.log` trong production code
- ❌ Index files re-export everything → ✅ explicit imports
- ❌ Sidebar navigation trên mobile → ✅ BottomNavigation
- ❌ Hover-only interactions → ✅ Touch + long-press alternatives
- ❌ Small touch targets < 48px → ✅ minHeight/minWidth: 48px
- ❌ Fixed position elements che keyboard → ✅ Respect virtual keyboard
- ❌ Desktop-first `md={{ }}` rồi override `xs={{ }}` → ✅ Mobile-first `xs={{ }}` rồi mở rộng `md={{ }}`

## Component Patterns

```typescript
// ✅ Chuẩn component pattern
import { FC, memo } from 'react';
import { Box, Typography } from '@mui/material';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export const MyComponent: FC<MyComponentProps> = memo(({ title, onAction }) => {
  return (
    <Box sx={{ p: 2, borderRadius: 2, border: 1, borderColor: 'divider' }}>
      <Typography variant="h6">{title}</Typography>
    </Box>
  );
});

MyComponent.displayName = 'MyComponent';
```

## State Management Rules

- **Local UI state** → `useState`
- **Complex local state** → `useReducer`
- **Feature-level shared state** → React Context + useReducer
- **Server/API state** → TanStack Query (useQuery, useMutation)
- **Form state** → React Hook Form + Zod schema
- **Global app state** (theme, auth, notifications) → Context at App level

## Form Pattern

```typescript
// Luôn dùng Zod schema + React Hook Form
const schema = z.object({
  name: z.string().min(1, 'Nhập tên'),
  type: z.enum(['indoor', 'outdoor']),
});

type FormData = z.infer<typeof schema>;
// → useForm<FormData>({ resolver: zodResolver(schema) })
```

## Agents & Review Process

Dự án có 4 chuyên gia AI agents:

| Agent | Khi nào dùng |
|-------|-------------|
| 🎯 `@project-manager` | Planning, phân công, tổng hợp review, quyết định |
| 🎨 `@ui-reviewer` | Review visual design, MUI compliance, responsive |
| 👤 `@ux-reviewer` | Review user flow, usability, accessibility |
| 💼 `@business-reviewer` | Review business logic, revenue model, market fit |
| 🔥 `@debugger` | Debug systematic — tìm root cause, không đoán mò, 4-phase process |

### Review workflow:
```
Code xong → @project-manager điều phối → 3 reviewers đánh giá → PM tổng hợp → Approve/Block
```

## Skills Reference

Đọc thêm chi tiết tại:
- `skills/react-typescript-patterns/SKILL.md` — React + TS patterns
- `skills/mui-design-system/SKILL.md` — MUI theming & Material Design
- `skills/design-system/SKILL.md` — Design system audit

## Domain: Badminton Group Management

> **Nguyên tắc: Mỗi thành viên = 1 tài khoản**. Đăng ký → tạo account → join nhóm.

### Key entities:
- **Member (= Account)**: email, passwordHash, displayName, phone, provider (local/google/facebook)
- **Group (Nhóm chơi)**: name, inviteCode, defaultCourtFee, roundingRule
- **GroupMember (Quan hệ)**: groupId, memberId, role (admin/member), type (fixed/guest), balance
- **Session (Buổi tập)**: groupId, createdBy, date, courtFee, shuttlecockQty, shuttlecockPrice, totalCost, perPerson, status
- **Attendance (Điểm danh)**: sessionId, memberId, isPresent, amountCharged
- **Transaction (Giao dịch)**: groupMemberId, type (session_charge/deposit/refund), amount, balanceAfter

### Core Flow (Logic chia tiền):
```
Tiền cầu    = shuttlecockQty × shuttlecockPrice
Tổng        = courtFee + Tiền cầu
Mỗi người   = ROUND_DOWN(Tổng / số_người_có_mặt)
Phần dư     = Tổng - (Mỗi_người × số_người) → vào quỹ nhóm
```

### Format rules:
- Tiền: `xxx.xxx VNĐ` (dấu chấm ngăn cách hàng nghìn)
- SĐT: `0xxx xxx xxx`
- Ngày: `Thứ X, DD/MM/YYYY`

### Mobile Usage Context:
- **Tại sân**: Điểm danh, nhập chi phí, chia tiền → cần big buttons, one-hand operation
- **Sau buổi tập**: Xem tiền cần đóng, liên hệ qua Zalo
- **Ở nhà**: Quản lý thành viên, xem thống kê, cài đặt
- **Connectivity**: 4G/WiFi sân có thể yếu → offline-capable cho session draft
