# Backend Plan — Supabase + React

> **Stack**: Supabase (PostgreSQL + Auth + Realtime + Edge Functions) — Free tier, $0, không cần custom backend server.

---

## Tổng quan kiến trúc

```
React (Vite)
    │
    ├── @supabase/supabase-js ──→ Supabase Cloud (Free)
    │       ├── PostgreSQL DB   (500MB free)
    │       ├── Auth            (50k MAU free)
    │       ├── Realtime        (200 concurrent free)
    │       └── Edge Functions  (500k invocations/month free)
    │
    └── @tanstack/react-query  (caching, loading states)
```

---

## 1. Cấu trúc thư mục

```
goodminton/
├── supabase/
│   ├── migrations/
│   │   ├── 001_create_members.sql
│   │   ├── 002_create_groups.sql
│   │   ├── 003_create_group_members.sql
│   │   ├── 004_create_sessions.sql
│   │   ├── 005_create_attendance.sql
│   │   ├── 006_create_transactions.sql
│   │   └── 007_rls_policies.sql
│   ├── functions/
│   │   ├── settle-session/index.ts   # Xác nhận & Trừ tiền (atomic)
│   │   └── revert-session/index.ts   # Hoàn tác buổi tập đã settle
│   ├── seed.sql                       # Mock data cho dev/testing
│   └── config.toml
│
└── src/
    ├── lib/
    │   └── supabase.ts                # Supabase client init
    ├── services/
    │   ├── auth.service.ts            # signUp, signIn, signOut, OAuth
    │   ├── members.service.ts         # CRUD members + balance
    │   ├── sessions.service.ts        # CRUD sessions + chia tiền
    │   ├── attendance.service.ts      # Điểm danh
    │   ├── rankings.service.ts        # Query xếp hạng
    │   └── settings.service.ts        # Group settings
    ├── hooks/
    │   ├── useAuth.ts                 # Thay AuthContext mock
    │   ├── useMembers.ts              # TanStack Query + members service
    │   ├── useSessions.ts             # TanStack Query + sessions service
    │   ├── useAttendance.ts
    │   └── useRankings.ts
    └── types/
        └── database.types.ts          # Auto-gen: supabase gen types
```

---

## 2. Database Schema (PostgreSQL)

### `members` — Tài khoản người dùng

```sql
CREATE TABLE members (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT UNIQUE NOT NULL,
  display_name  TEXT NOT NULL CHECK (length(display_name) BETWEEN 2 AND 50),
  phone         TEXT UNIQUE NOT NULL CHECK (phone ~ '^0\d{9}$'),
  avatar_url    TEXT,
  status        TEXT NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'suspended')),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);
-- id = auth.users.id (Supabase Auth tự quản lý)
```

### `groups` — Nhóm chơi

```sql
CREATE TABLE groups (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                      TEXT NOT NULL CHECK (length(name) BETWEEN 2 AND 100),
  invite_code               TEXT UNIQUE NOT NULL
                              DEFAULT substr(md5(random()::text), 1, 8),
  default_court_fee         INTEGER DEFAULT 0,
  default_shuttlecock_price INTEGER DEFAULT 0,
  rounding_rule             TEXT NOT NULL DEFAULT 'hundred'
                              CHECK (rounding_rule IN ('none', 'hundred', 'thousand')),
  schedule                  JSONB,          -- { days: [2,4], startTime: '19:00', endTime: '21:00' }
  created_at                TIMESTAMPTZ DEFAULT now()
);
```

### `group_members` — Quan hệ Member ↔ Group

```sql
CREATE TABLE group_members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id   UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  member_id  UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  type       TEXT NOT NULL DEFAULT 'fixed'  CHECK (type IN ('fixed', 'guest')),
  balance    INTEGER NOT NULL DEFAULT 0,    -- VNĐ, có thể âm
  status     TEXT NOT NULL DEFAULT 'active'
               CHECK (status IN ('active', 'inactive', 'pending')),
  joined_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (group_id, member_id)
);
```

### `sessions` — Buổi tập

```sql
CREATE TABLE sessions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id          UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  created_by        UUID NOT NULL REFERENCES members(id),
  date              DATE NOT NULL,
  court_fee         INTEGER NOT NULL CHECK (court_fee >= 0),
  shuttlecock_qty   INTEGER NOT NULL DEFAULT 0 CHECK (shuttlecock_qty >= 0),
  shuttlecock_price INTEGER NOT NULL DEFAULT 0 CHECK (shuttlecock_price >= 0),
  total_cost        INTEGER GENERATED ALWAYS AS
                      (court_fee + shuttlecock_qty * shuttlecock_price) STORED,
  attendee_count    INTEGER NOT NULL DEFAULT 0,
  per_person        INTEGER NOT NULL DEFAULT 0,
  remainder         INTEGER NOT NULL DEFAULT 0,
  status            TEXT NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft', 'pending', 'settled')),
  note              TEXT CHECK (length(note) <= 200),
  created_at        TIMESTAMPTZ DEFAULT now()
);
```

### `attendance` — Điểm danh

```sql
CREATE TABLE attendance (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  member_id       UUID NOT NULL REFERENCES members(id),
  is_present      BOOLEAN NOT NULL DEFAULT false,
  amount_charged  INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE (session_id, member_id)
);
```

### `transactions` — Lịch sử giao dịch

```sql
CREATE TABLE transactions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_member_id  UUID NOT NULL REFERENCES group_members(id) ON DELETE CASCADE,
  session_id       UUID REFERENCES sessions(id),
  type             TEXT NOT NULL
                     CHECK (type IN ('session_charge','deposit','refund','adjustment')),
  amount           INTEGER NOT NULL,         -- âm = trừ, dương = cộng
  balance_after    INTEGER NOT NULL,
  note             TEXT,
  created_at       TIMESTAMPTZ DEFAULT now()
);
```

---

## 3. Row Level Security (RLS)

> Bảo vệ dữ liệu tại tầng DB — không lộ data giữa các nhóm khác nhau.

```sql
-- Bật RLS toàn bộ bảng
ALTER TABLE members        ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups         ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance     ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions   ENABLE ROW LEVEL SECURITY;

-- ── Members ─────────────────────────────────────────────────────────────────

-- Đọc: thấy member cùng group
CREATE POLICY "Read members in same group" ON members FOR SELECT USING (
  id IN (
    SELECT gm.member_id FROM group_members gm
    WHERE gm.group_id IN (
      SELECT group_id FROM group_members WHERE member_id = auth.uid()
    )
  )
);

-- Sửa: chỉ sửa profile của mình
CREATE POLICY "Update own profile" ON members FOR UPDATE USING (id = auth.uid());

-- ── Sessions ────────────────────────────────────────────────────────────────

-- Đọc: thành viên trong group
CREATE POLICY "Read sessions in own group" ON sessions FOR SELECT USING (
  group_id IN (SELECT group_id FROM group_members WHERE member_id = auth.uid())
);

-- Tạo/sửa/xóa: chỉ admin
CREATE POLICY "Admin manage sessions" ON sessions FOR ALL USING (
  EXISTS (
    SELECT 1 FROM group_members
    WHERE group_id = sessions.group_id
      AND member_id = auth.uid()
      AND role = 'admin'
  )
);

-- ── Transactions ─────────────────────────────────────────────────────────────

-- Member đọc transaction của mình; Admin đọc tất cả trong group
CREATE POLICY "Read own transactions" ON transactions FOR SELECT USING (
  group_member_id IN (
    SELECT id FROM group_members WHERE member_id = auth.uid()
  )
);
```

---

## 4. Edge Functions

### `settle-session` — Xác nhận & Trừ tiền (atomic)

```typescript
// POST https://<project>.supabase.co/functions/v1/settle-session
// Body: { sessionId: string }
// Auth: Bearer token required (admin only)

Luồng xử lý:
1. Kiểm tra session.status = 'pending'
2. Kiểm tra caller là admin của group
3. Lấy danh sách attendance WHERE is_present = true
4. Tính per_person = ROUND_DOWN(total_cost / count, rounding_rule)
5. Tính remainder = total_cost - (per_person × count)
6. BEGIN TRANSACTION (Supabase RPC):
   a. UPDATE group_members SET balance -= per_person (mỗi attendee)
   b. INSERT transactions type='session_charge' cho mỗi attendee
   c. UPDATE sessions SET status='settled', per_person, remainder, attendee_count
7. COMMIT → trả về { success: true, perPerson, remainder }
```

### `revert-session` — Hoàn tác buổi đã settle

```typescript
// POST .../functions/v1/revert-session
// Body: { sessionId: string }

Luồng xử lý:
1. Kiểm tra session.status = 'settled'
2. BEGIN TRANSACTION:
   a. Lấy transactions type='session_charge' của session
   b. Hoàn tiền: UPDATE group_members SET balance += amount_charged
   c. INSERT transactions type='refund'
   d. UPDATE sessions SET status='pending'
3. COMMIT
```

---

## 5. Auth Flow

```
Supabase Auth (tích hợp sẵn, free)
│
├── Email/Password
│     signUp({ email, password }) → tạo auth.users + trigger tạo members row
│     signIn({ email, password }) → trả JWT token
│
├── Google OAuth
│     signInWithOAuth({ provider: 'google' })
│
├── Facebook OAuth
│     signInWithOAuth({ provider: 'facebook' })
│
└── Session Management
      onAuthStateChange() → lắng nghe login/logout
      Auto refresh token — không cần xử lý thủ công
```

**Trigger tự động tạo member sau khi signup:**

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO members (id, email, display_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Thành viên mới'),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 6. Frontend Integration

### Supabase client (`src/lib/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### Ví dụ service (`src/services/sessions.service.ts`)

```typescript
export const sessionsService = {
  getAll: (groupId: string) =>
    supabase
      .from('sessions')
      .select('*, attendance(count)')
      .eq('group_id', groupId)
      .order('date', { ascending: false }),

  create: (data: SessionInsert) =>
    supabase.from('sessions').insert(data).select().single(),

  settle: (sessionId: string) =>
    supabase.functions.invoke('settle-session', { body: { sessionId } }),
};
```

### Ví dụ hook (`src/hooks/useSessions.ts`)

```typescript
export const useSessions = (groupId: string) =>
  useQuery({
    queryKey: ['sessions', groupId],
    queryFn: () => sessionsService.getAll(groupId),
  });

export const useSettleSession = () =>
  useMutation({
    mutationFn: sessionsService.settle,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
  });
```

---

## 7. Migration Plan: Mock → Supabase

| Bước | Công việc | Ưu tiên |
|------|-----------|---------|
| **1** | Tạo Supabase project + chạy migrations | P0 |
| **2** | `.env.local` với URL + anon key | P0 |
| **3** | `npm install @supabase/supabase-js @tanstack/react-query` | P0 |
| **4** | `src/lib/supabase.ts` + `database.types.ts` (gen CLI) | P0 |
| **5** | Thay `AuthContext` mock → Supabase Auth | P0 |
| **6** | Services: `auth`, `members` | P1 |
| **7** | Services: `sessions`, `attendance` | P1 |
| **8** | Edge Functions: `settle-session`, `revert-session` | P1 |
| **9** | Hooks TanStack Query cho tất cả services | P1 |
| **10** | Migrate từng page: Members → Sessions → Dashboard → Rankings | P1 |
| **11** | Settings page + group config | P2 |
| **12** | Xóa `src/mocks/` | P2 |

**Thời gian ước tính:** 2-3 tuần (part-time)

---

## 8. Environment Variables

```env
# .env.local (không commit lên git)
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

```bash
# Generate TypeScript types từ schema
npx supabase gen types typescript --project-id <id> > src/types/database.types.ts
```

---

## 9. Free Tier Limits

| Resource | Giới hạn free | Ước tính app dùng | Đủ? |
|----------|--------------|-------------------|-----|
| Database | 500 MB | < 5 MB (50 users, 500 sessions) | ✅ |
| Auth users | 50,000 MAU | ~50 users | ✅ |
| Edge Functions | 500K calls/tháng | ~500 calls/tháng | ✅ |
| Realtime | 200 concurrent | ~10 users | ✅ |
| Storage | 1 GB | Không dùng | ✅ |

> ⚠️ **Lưu ý**: Free project bị **pause sau 7 ngày không có request**. Workaround: dùng cron job ping miễn phí (UptimeRobot) hoặc upgrade $25/tháng khi cần production.

---

## 10. Dependencies

```bash
npm install @supabase/supabase-js @tanstack/react-query @tanstack/react-query-devtools
```

`package.json` sau khi thêm:
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x",
    "@tanstack/react-query": "^5.x"
  },
  "devDependencies": {
    "@tanstack/react-query-devtools": "^5.x"
  }
}
```
