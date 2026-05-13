# TODO — The Court & Canvas

> Dựa trên PRD `docs/PRD.md`. ✅ = đã có code cơ bản | ⬜ = chưa làm | 🚧 = đang làm / partial

---

## Phase 1 — Core MVP (P0/P1)

### 🔐 Auth

- ✅ Màn hình Đăng nhập (`/login`) — form email + password, social login UI
- ✅ Màn hình Đăng ký (`/register`) — họ tên, email, password, SĐT, mã mời
- ✅ Màn hình Quên mật khẩu (`/forgot-password`)
- ✅ Route guard — redirect `/login` nếu chưa auth
- ⬜ JWT / session token thực (hiện dùng mock context)
- ⬜ Google OAuth tích hợp thực
- ⬜ Facebook OAuth tích hợp thực
- ⬜ "Ghi nhớ đăng nhập" — persistent token 30 ngày
- ⬜ Rate limit 5 lần / 15 phút

---

### 🏠 Dashboard (`/dashboard`)

- ✅ Stat cards: Buổi tập tháng này, Số dư quỹ, Tổng thành viên
- ✅ Danh sách hoạt động gần đây (Activity feed)
- ⬜ Banner "Buổi tập kế tiếp" — ngày, giờ, địa điểm, số người dự kiến
- ⬜ Realtime data từ API (hiện dùng mock data)
- ⬜ Empty state khi chưa có buổi tập

---

### 👥 Thành viên (`/members`)

- ✅ Danh sách thành viên — Table (desktop) / Card list (mobile)
- ✅ Search / filter tên
- ✅ Filter chips: Tổng cộng / Cố định / Vãng lai
- ✅ Form thêm thành viên (dialog) — tên, loại, SĐT, số dư ban đầu
- ✅ Form sửa thành viên
- ✅ Xóa thành viên (với confirm)
- ✅ Trang chi tiết thành viên (`/members/:id`) — profile + lịch sử GD
- ✅ Phân trang
- ⬜ Validate SĐT trùng khi thêm
- ⬜ Confirm dialog khi xóa thành viên có số dư ≠ 0
- ⬜ Nạp tiền / adjust balance cho thành viên
- ⬜ Liên hệ qua Zalo (deep link `zalo://`) — mobile only
- ⬜ Mask SĐT trên list (chỉ admin thấy đầy đủ)
- ⬜ Duyệt thành viên mới (pending → active)
- ⬜ API thực thay mock data

---

### 📅 Lịch tập & Thu chi (`/sessions`) ⭐ CORE

#### Danh sách buổi tập

- ✅ Danh sách sessions — card list, mới nhất trước
- ✅ Filter chips: Tất cả / Bản nháp / Chờ xử lý / Hoàn tất
- ✅ Session card: ngày, trạng thái, tổng chi phí, số người, mỗi người
- ⬜ API thực thay mock data

#### Tạo buổi tập (`/sessions/new`)

- ✅ Nhập ngày tập + ghi chú
- ✅ Nhập tiền sân
- ✅ Nhập số quả cầu + đơn giá → tự tính tiền cầu
- ✅ Tổng chi phí auto-calculate
- ✅ Điểm danh: toggle switch từng thành viên
- ✅ Search thành viên trong điểm danh
- ✅ "Chọn tất cả Cố định" quick action
- ✅ Kết quả chia tiền — tổng, số người, mỗi người, phần dư
- ✅ Lưu bản nháp / Lưu buổi tập
- ⬜ "Bỏ chọn tất cả" quick action
- ⬜ Xác nhận & Trừ tiền — cập nhật balance, tạo transaction log
- ⬜ Trạng thái session: draft → pending → settled
- ⬜ Revert buổi tập đã settled (hoàn tiền)
- ⬜ Thêm khách ngoài danh sách
- ⬜ Offline draft — lưu local, sync khi có mạng
- ⬜ Pre-fill giá mặc định từ Settings

#### Chi tiết buổi tập (`/sessions/:id`)

- ✅ Xem chi tiết: ngày, chi phí, điểm danh, số tiền/người
- ⬜ Sửa buổi tập (`/sessions/:id/edit`)
- ⬜ Xác nhận & Trừ tiền từ màn chi tiết
- ⬜ Revert từ màn chi tiết

---

### 🏆 Bảng xếp hạng (`/rankings`)

- ✅ Top 10 thành viên theo số buổi tham gia
- ✅ Podium Top 3 (🥇🥈🥉) với medal icon
- ✅ Vị trí của current user nếu không trong top 10
- ✅ Filter: Tháng này / Tháng trước / 3 tháng / Toàn bộ
- ⬜ Empty state khi chưa có dữ liệu
- ⬜ Tap vào member → xem chi tiết lịch sử tham gia
- ⬜ API thực thay mock data

---

### ⚙️ Cài đặt (`/settings`)

- ⬜ Trang Settings chưa có
- ⬜ Tên nhóm
- ⬜ Đơn giá cầu mặc định (pre-fill khi tạo session)
- ⬜ Tiền sân mặc định (pre-fill khi tạo session)
- ⬜ Lịch tập cố định (ngày trong tuần, giờ)
- ⬜ Quy tắc làm tròn: xuống hàng trăm / nghìn / không làm tròn

---

### 🏗️ App Shell & Layout

- ✅ BottomNavigation 4 tabs (mobile)
- ✅ Sidebar 240px (desktop)
- ✅ MobileAppBar (sticky header)
- ✅ Route-based navigation
- ✅ Responsive breakpoints (mobile-first)

---

## Phase 2 — Polish

- ⬜ Zalo deep link liên hệ thành viên
- ⬜ Lịch sử giao dịch chi tiết (filter, export)
- ⬜ Offline draft cho sessions (Service Worker / localStorage)
- ⬜ Push notification nhắc lịch tập
- ⬜ PWA: `manifest.json` + service worker (installable)
- ⬜ Settings page đầy đủ

---

## Phase 3 — Growth

- ⬜ Multi-group support (1 user nhiều nhóm)
- ⬜ Export báo cáo PDF / Excel
- ⬜ Nạp tiền online (MoMo, ZaloPay)
- ⬜ Tự động tạo lịch tập recurring
- ⬜ Thống kê chi tiêu theo tháng (biểu đồ)
- ⬜ Sân đấu: Scoreboard trận đấu realtime
- ⬜ Ghép cặp: Random / manual 1v1 + 2v2
- ⬜ Lịch sử thi đấu: THẮNG/THUA, win rate, Level
- ⬜ Ranking nâng cao: điểm thi đấu + win rate

---

## Kỹ thuật / Non-functional

- ⬜ Kết nối API backend thực (thay toàn bộ mock data)
- ⬜ TanStack Query — caching, refetch, optimistic update
- ⬜ Error boundary + fallback UI
- ⬜ Skeleton loading toàn app
- ⬜ Pull-to-refresh trên lists
- ⬜ Bundle size < 200KB (hiện ~600KB — cần code splitting)
- ⬜ WCAG 2.1 AA accessibility audit
- ⬜ Performance: FCP < 1.5s trên 4G
- ⬜ Security: mask SĐT, rate limit login
