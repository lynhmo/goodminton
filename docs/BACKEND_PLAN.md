# Backend Plan — Express.js + Supabase + Prisma

> **Stack**: Express.js (Node.js) + Supabase JS SDK (service_role, server-side) + Prisma ORM + express-session

---

## Kiến trúc tổng quan

```
React (Vite) — frontend/
    │
    │  /api/*  (proxy qua vite dev server)
    ▼
Express.js — backend/
    │
    ├── express-session   (auth, không dùng JWT)
    ├── @supabase/supabase-js  (service_role key — bypass RLS)
    └── @prisma/client    (type-safe DB queries)
    │
    ▼
Supabase PostgreSQL  (hosted DB)
```

---

## Cấu trúc thư mục (Monorepo)

```
goodminton/
├── frontend/                        # React + Vite + MUI
│   ├── src/
│   ├── index.html
│   ├── vite.config.ts               # proxy /api → localhost:3000
│   └── package.json
│
├── backend/                         # Express.js API
│   ├── src/
│   │   ├── index.ts                 # Express entry + session + cors
│   │   ├── lib/
│   │   │   └── supabase.ts          # Supabase client (service_role)
│   │   ├── middlewares/
│   │   │   └── auth.middleware.ts   # requireAuth / requireAdmin
│   │   ├── routes/
│   │   │   ├── auth.routes.ts       # /api/auth/*
│   │   │   ├── members.routes.ts    # /api/members/*
│   │   │   ├── sessions.routes.ts   # /api/sessions/*
│   │   │   ├── attendance.routes.ts # /api/attendance/*
│   │   │   └── rankings.routes.ts   # /api/rankings
│   │   └── types/
│   │       └── session.d.ts         # express-session augmentation
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env                         # không commit
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── package.json                     # root — npm workspaces
└── .gitignore
```

---

## API Endpoints

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/api/auth/login` | — | Đăng nhập → set session |
| POST | `/api/auth/logout` | session | Xóa session |
| GET | `/api/auth/me` | session | User hiện tại |
| GET | `/api/members` | session | Danh sách thành viên trong group |
| GET | `/api/members/:id` | session | Chi tiết thành viên |
| POST | `/api/members` | admin | Thêm thành viên vào group |
| PATCH | `/api/members/:id/balance` | admin | Điều chỉnh số dư |
| DELETE | `/api/members/:id` | admin | Vô hiệu hóa thành viên |
| GET | `/api/sessions` | session | Danh sách buổi tập |
| GET | `/api/sessions/:id` | session | Chi tiết buổi + điểm danh |
| POST | `/api/sessions` | admin | Tạo buổi mới |
| PATCH | `/api/sessions/:id` | admin | Cập nhật buổi (draft/pending) |
| DELETE | `/api/sessions/:id` | admin | Xóa buổi (chỉ draft) |
| POST | `/api/sessions/:id/settle` | admin | Chốt buổi, trừ tiền |
| POST | `/api/sessions/:id/revert` | admin | Hoàn tác buổi đã chốt |
| GET | `/api/attendance?sessionId=` | session | Điểm danh theo buổi |
| POST | `/api/attendance` | admin | Điểm danh hàng loạt |
| PATCH | `/api/attendance/:id` | admin | Toggle is_present |
| GET | `/api/rankings` | session | Top 10 thành viên |
| GET | `/api/health` | — | Health check |

---

## Environment Variables

```env
# backend/.env  (không commit lên git)

# Supabase
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Prisma — Supabase connection string
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres

# Session
SESSION_SECRET=long-random-string-change-in-production
SESSION_MAX_AGE_MS=604800000   # 7 ngày

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## Commands

```bash
# Dev (từ root)
npm run dev              # chạy cả frontend + backend song song
npm run dev:frontend     # chỉ frontend (port 5173)
npm run dev:backend      # chỉ backend (port 3000)

# Backend riêng
cd backend
npm install
npm run dev              # tsx watch src/index.ts
npm run db:generate      # prisma generate
npm run db:push          # push schema lên Supabase (lần đầu)
npm run db:studio        # Prisma Studio UI

# Frontend riêng
cd frontend
npm install
npm run dev
```

---

## Setup lần đầu

```bash
# 1. Clone repo
git clone ...
cd goodminton

# 2. Install all workspaces
npm install

# 3. Tạo backend/.env từ template
cp backend/.env.example backend/.env
# Điền SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL...

# 4. Push Prisma schema lên Supabase
cd backend && npm run db:push

# 5. Generate Prisma client
npm run db:generate

# 6. Chạy dev
cd .. && npm run dev
```

---

## Migration Plan: Mock data → Real backend

| Bước | Công việc | Ưu tiên |
|------|-----------|---------|
| **1** | Setup Supabase project, copy env vars | P0 |
| **2** | `npm run db:push` để tạo tables | P0 |
| **3** | Tạo account đầu tiên qua Supabase Auth dashboard | P0 |
| **4** | Thay `AuthContext` mock → gọi `/api/auth/*` | P0 |
| **5** | Thay mock members → gọi `/api/members/*` | P1 |
| **6** | Thay mock sessions → gọi `/api/sessions/*` | P1 |
| **7** | Thay mock attendance → gọi `/api/attendance/*` | P1 |
| **8** | Thay mock rankings → gọi `/api/rankings` | P1 |
| **9** | Xóa `frontend/src/mocks/` | P2 |

---

## Dependencies

### Backend
```bash
# Runtime
@supabase/supabase-js  # Supabase client (service_role)
@prisma/client         # Type-safe DB queries
express                # HTTP server
express-session        # Session management
bcryptjs               # Password hashing (nếu custom auth)
cors                   # CORS middleware
dotenv                 # .env loader
connect-pg-simple      # PostgreSQL session store (production)

# Dev
prisma                 # CLI + migrations
tsx                    # TypeScript runner (dev)
typescript
@types/express @types/express-session @types/bcryptjs @types/cors
```

### Frontend (thêm nếu cần)
```bash
# Không cần thêm gì — fetch /api/* trực tiếp
# Có thể dùng TanStack Query để cache
npm install @tanstack/react-query --workspace=frontend
```
