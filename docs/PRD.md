# Product Requirements Document (PRD)

**App**: The Court & Canvas — Precision Motion  
**Version**: 1.0 MVP  
**Ngày**: 11/04/2026  
**Nguồn**: Yêu cầu từ BA  
**Mockup UI**: `mockup_ui/` — Ảnh thiết kế desktop + mobile cho từng màn hình

> **⚠️ Mockup vs PRD**: Mockup có thể không chính xác 100% với PRD.  
> Khi xung đột → **PRD là source of truth**. Xem chi tiết diff tại `mockup_ui/README.md`.  
> Mockup có thêm features "Sân đấu" (ghi điểm, ghép cặp) chưa nằm trong scope Phase 1.

---

## Mục lục

1. [Tổng quan sản phẩm](#1-tổng-quan-sản-phẩm)
2. [Đối tượng người dùng](#2-đối-tượng-người-dùng)
3. [Nhóm chức năng 1 — Tổng quan (Dashboard)](#3-nhóm-chức-năng-1--tổng-quan-dashboard)
4. [Nhóm chức năng 2 — Lịch tập & Thu chi (TRỌNG TÂM)](#4-nhóm-chức-năng-2--lịch-tập--thu-chi-trọng-tâm)
5. [Nhóm chức năng 3 — Quản lý Thành viên](#5-nhóm-chức-năng-3--quản-lý-thành-viên)
6. [Nhóm chức năng 4 — Bảng xếp hạng](#6-nhóm-chức-năng-4--bảng-xếp-hạng)
7. [Nhóm chức năng 5 — Hệ thống & Trải nghiệm](#7-nhóm-chức-năng-5--hệ-thống--trải-nghiệm)
8. [Data Model](#8-data-model)
9. [Business Rules & Logic chia tiền](#9-business-rules--logic-chia-tiền)
10. [Screens & Navigation Map](#10-screens--navigation-map)
11. [Non-Functional Requirements](#11-non-functional-requirements)
12. [Phân pha & Roadmap](#12-phân-pha--roadmap)
13. [Appendix: Mockup Diff Notes](#13-appendix-mockup-diff-notes)

---

## 1. Tổng quan sản phẩm

**The Court & Canvas** là ứng dụng quản lý **nhóm chơi cầu lông** tại Việt Nam. Mục tiêu chính: giúp trưởng nhóm quản lý danh sách thành viên, ghi nhận buổi tập, **chia tiền sân + cầu** tự động, và theo dõi tài chính nhóm.

### Bài toán cốt lõi

> Mỗi buổi tập, nhóm tốn tiền sân + tiền cầu. Trưởng nhóm phải tự tính rồi chia cho người có mặt ➜ **dễ sai, mất thời gian, không ai nhớ ai nợ bao nhiêu**.

### Giải pháp

App tự động: Nhập chi phí ➜ Điểm danh ➜ Hệ thống chia đều ➜ Cập nhật số dư mỗi người.

### Platform

| Target | Chi tiết |
|--------|----------|
| **Primary** | Mobile web (PWA) — dùng ngay tại sân cầu |
| **Secondary** | Desktop web — trưởng nhóm quản lý ở nhà |
| **Tech stack** | React 18 + TypeScript + MUI v5+ + Vite |

---

## 2. Đối tượng người dùng

> **Nguyên tắc**: Mỗi thành viên = 1 tài khoản. Đăng ký → trở thành member → được Admin duyệt vào nhóm.

| Persona | Role | Mô tả | Nhu cầu chính |
|---------|------|--------|---------------|
| **Trưởng nhóm (Admin)** | `admin` | Người tổ chức, quản lý quỹ, booking sân. Cũng là 1 thành viên | Nhập buổi tập nhanh, chia tiền chính xác, theo dõi nợ, quản lý members |
| **Thành viên cố định** | `member` | Chơi hàng tuần, đóng tiền định kỳ | Xem số dư cá nhân, lịch tập, bảng xếp hạng |
| **Thành viên vãng lai** | `member` | Chơi thỉnh thoảng, được mời | Biết cần đóng bao nhiêu, liên hệ nhóm |

### Phân quyền (Role-based)

| Tính năng | Admin | Member |
|-----------|:-----:|:------:|
| Xem dashboard, ranking, lịch sử cá nhân | ✅ | ✅ |
| Xem số dư cá nhân | ✅ | ✅ |
| Tạo / sửa / xóa buổi tập | ✅ | ❌ |
| Điểm danh | ✅ | ❌ |
| Thêm / sửa / xóa thành viên | ✅ | ❌ |
| Nạp tiền / adjust balance | ✅ | ❌ |
| Duyệt thành viên mới | ✅ | ❌ |
| Cài đặt nhóm | ✅ | ❌ |
| Sửa profile cá nhân | ✅ | ✅ |

### Bối cảnh sử dụng

| Tình huống | Device | Điều kiện |
|-----------|--------|-----------|
| **Tại sân** — điểm danh & nhập chi phí | 📱 Mobile, một tay | 4G/WiFi yếu |
| **Sau buổi tập** — xem tiền cần đóng | 📱 Mobile | Bình thường |
| **Ở nhà** — quản lý, thống kê | 💻 Desktop hoặc 📱 | Wifi ổn |

---

## 3. Nhóm chức năng 1 — Tổng quan (Dashboard)

**Route**: `/dashboard`  
**Nav**: Tab 1 — 🏠 Tổng quan  

### 3.1 Thống kê nhanh

| Stat Card | Data | Format | Icon |
|-----------|------|--------|------|
| **Buổi tập tháng này** | Tổng số sessions trong tháng hiện tại | Số nguyên (VD: `12`) | 🏸 |
| **Số dư quỹ** | Tổng tiền quỹ nhóm hiện tại | VNĐ (VD: `2.500.000 VNĐ`) | 💰 |
| **Thành viên** | Tổng số thành viên | Số nguyên (VD: `128`) | 👥 |

#### Acceptance Criteria

```
GIVEN   trang Dashboard được mở
WHEN    dữ liệu load xong
THEN    hiển thị 3 stat cards với số liệu realtime:
        - Buổi tập tháng này = COUNT(sessions WHERE groupId = current_group AND month = current_month)
        - Số dư quỹ = SUM(groupMember.balance WHERE groupId = current_group)
        - Tổng thành viên = COUNT(groupMembers WHERE groupId = current_group AND status = active)
```

### 3.2 Thông báo buổi tập kế tiếp

```
┌───────────────────────────────────────┐
│ 📅 Buổi tập kế tiếp                  │
│                                       │
│ Thứ 5, 17/04/2026 — 19:00 - 21:00    │
│ 📍 Sân ABC, Quận 7                   │
│ 👥 Dự kiến: 12 người                 │
│                                       │
│ [Xem chi tiết]                        │
└───────────────────────────────────────┘
```

#### Acceptance Criteria

```
GIVEN   có lịch tập đã tạo sẵn
WHEN    Dashboard load
THEN    hiển thị banner/card "Buổi tập kế tiếp" gồm:
        - Thứ + ngày/tháng/năm
        - Giờ bắt đầu - Giờ kết thúc
        - Địa điểm sân
        - Số người dự kiến (dựa trên lịch sử avg attendance)
        
GIVEN   không có lịch tập nào sắp tới
THEN    hiển thị: "Chưa có buổi tập nào. Hãy tạo lịch tập mới!"
```

---

## 4. Nhóm chức năng 2 — Lịch tập & Thu chi (TRỌNG TÂM)

**Route**: `/sessions`  
**Nav**: Tab 3 — 📅 Lịch tập  

> ⭐ **Đây là chức năng cốt lõi** của toàn bộ ứng dụng. Mọi thứ xoay quanh: Tạo buổi tập → Nhập chi phí → Điểm danh → Chia tiền tự động.

### 4.1 Danh sách buổi tập

Hiển thị lịch sử tất cả buổi tập, sắp xếp mới nhất trước.

```
┌───────────────────────────────────────┐
│ 📅 Lịch tập & Thu chi           [+]  │
├───────────────────────────────────────┤
│                                       │
│  ┌─────────────────────────────────┐  │
│  │ T5, 10/04/2026    ✅ Đã chia   │  │
│  │ Tổng: 850.000 VNĐ  •  10 người│  │
│  │ Mỗi người: 85.000 VNĐ         │  │
│  └─────────────────────────────────┘  │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │ T3, 08/04/2026    ⏳ Chờ chia  │  │
│  │ Tổng: 720.000 VNĐ  •  8 người │  │
│  │ Mỗi người: 90.000 VNĐ         │  │
│  └─────────────────────────────────┘  │
│                                       │
└───────────────────────────────────────┘
```

#### Session Card Data

| Field | Hiển thị |
|-------|----------|
| Ngày | `Thứ X, DD/MM/YYYY` |
| Trạng thái | `✅ Đã chia` / `⏳ Chờ chia` / `📝 Đang nhập` |
| Tổng chi phí | `xxx.xxx VNĐ` |
| Số người tham gia | `X người` |
| Chi phí / người | `xxx.xxx VNĐ` |

### 4.2 Tạo / Chỉnh sửa buổi tập (Form chính)

> **Mobile UX**: Form phải dạng stepped hoặc single-scroll, nút bấm lớn, dùng tại sân.

#### Step 1: Thông tin buổi tập

| Field | Type | Validation | Default |
|-------|------|-----------|---------|
| Ngày tập | Date picker | Required, ≤ today | Hôm nay |
| Ghi chú | Text (optional) | Max 200 chars | — |

#### Step 2: Chi phí

| Field | Type | Validation | Ví dụ |
|-------|------|-----------|-------|
| **Tiền sân** (cố định) | Number input | Required, > 0 | `350.000` |
| **Số lượng quả cầu** | Number input | Required, ≥ 0 | `5` |
| **Đơn giá mỗi quả** | Number input | Required if qty > 0, > 0 | `48.000` |
| **Tiền cầu** (tự tính) | Display only | = Số lượng × Đơn giá | `240.000` |
| **TỔNG CHI PHÍ** | Display only | = Tiền sân + Tiền cầu | `590.000` |

```
┌───────────────────────────────────────┐
│ 💰 Chi phí buổi tập                  │
│                                       │
│ Tiền sân                              │
│ ┌─────────────────────────────────┐   │
│ │                      350.000 VNĐ│   │
│ └─────────────────────────────────┘   │
│                                       │
│ Quả cầu                               │
│ ┌──────────┐  ×  ┌──────────────┐     │
│ │    5 quả │     │   48.000 VNĐ │     │
│ └──────────┘     └──────────────┘     │
│                    = 240.000 VNĐ      │
│                                       │
│ ┌─────────────────────────────────┐   │
│ │  TỔNG: 590.000 VNĐ             │   │
│ └─────────────────────────────────┘   │
│                                       │
└───────────────────────────────────────┘
```

#### Step 3: Điểm danh thông minh

Hiển thị danh sách **toàn bộ thành viên** với checkbox để tick người có mặt.

```
┌───────────────────────────────────────┐
│ ✅ Điểm danh (10/128 có mặt)         │
│ ┌─────────────────────────────────┐   │
│ │ [✓] (NH) Nguyễn Văn Hùng  CĐ  │   │
│ │ [✓] (TA) Trần Tuấn Anh    VL  │   │
│ │ [✓] (LM) Lê Thị Mai       CĐ  │   │
│ │ [ ] (PV) Phạm Quốc Việt   VL  │   │
│ │ [✓] ...                         │   │
│ └─────────────────────────────────┘   │
│                                       │
│ 🔍 Tìm thành viên...                 │
│                                       │
│ Chọn nhanh:                           │
│ [Tất cả CĐ] [Bỏ chọn tất cả]        │
│                                       │
└───────────────────────────────────────┘
```

| Feature | Chi tiết |
|---------|----------|
| Danh sách | Tất cả members, Cố định lên trước, sort A→Z |
| Checkbox | Tap để toggle, `48px` touch target |
| Counter | Realtime: "X/Y có mặt" |
| Search | Filter tên nhanh |
| Quick actions | "Chọn tất cả CĐ" (tick hết thành viên cố định), "Bỏ chọn tất cả" |
| Badge | Chip CĐ (xanh) / VL (xám) kế bên tên |

#### Step 4: Kết quả chia tiền (Auto-calculate)

```
┌───────────────────────────────────────┐
│ 📊 KẾT QUẢ CHIA TIỀN                 │
│                                       │
│ ┌─────────────────────────────────┐   │
│ │  Tổng chi phí     590.000 VNĐ  │   │
│ │  Số người có mặt           10  │   │
│ │  ─────────────────────────────  │   │
│ │  💰 MỖI NGƯỜI      59.000 VNĐ │   │ ← NỔI BẬT
│ └─────────────────────────────────┘   │
│                                       │
│ Chi tiết:                             │
│  (NH) Nguyễn Văn Hùng    -59.000 VNĐ │
│  (TA) Trần Tuấn Anh      -59.000 VNĐ │
│  (LM) Lê Thị Mai         -59.000 VNĐ │
│  ...                                  │
│                                       │
│    [ Xác nhận & Trừ tiền ]            │ ← Primary CTA
│    [ Chỉnh sửa ]                      │
│                                       │
└───────────────────────────────────────┘
```

#### Acceptance Criteria — Logic chia tiền

```
GIVEN   Tiền sân = S (VNĐ)
AND     Số quả cầu = Q, Đơn giá = P (VNĐ/quả)
AND     Số người có mặt = N (N > 0)

WHEN    hệ thống tính toán

THEN    Tiền cầu = Q × P
        Tổng chi phí = S + (Q × P)
        Mỗi người = ROUND(Tổng / N)
        
        Nếu Tổng không chia hết cho N:
          → Phần dư = Tổng - (Mỗi_người × N)
          → Phần dư được cộng vào quỹ nhóm (KHÔNG phân bổ lẻ)
        
EXAMPLE:
        Tiền sân    = 350.000
        Cầu 5 quả  = 5 × 48.000 = 240.000
        Tổng        = 590.000
        Có mặt      = 10 người
        Mỗi người   = 590.000 / 10 = 59.000 VNĐ ✅ (chia hết)
        
EXAMPLE (chia lẻ):
        Tổng        = 600.000
        Có mặt      = 7 người
        Mỗi người   = ROUND(600.000 / 7) = 85.714 → 85.714 VNĐ
                    → Làm tròn: 85.700 VNĐ/người (làm tròn xuống hàng trăm)
                    → 7 × 85.700 = 599.900
                    → Dư 100 VNĐ → vào quỹ
```

#### Acceptance Criteria — Xác nhận & trừ tiền

```
GIVEN   Admin xem kết quả chia tiền
WHEN    bấm "Xác nhận & Trừ tiền"
THEN    
        1. Trạng thái session → "Đã chia"
        2. Với MỖI thành viên có mặt:
           member.balance -= mỗi_người
        3. Nếu có phần dư:
           fund.balance += phần_dư
        4. Ghi transaction log cho từng member
        5. Hiển thị Snackbar thành công
        6. Quay về danh sách sessions

GIVEN   Admin bấm "Xác nhận" nhưng mất mạng
THEN    
        → Lưu offline (pending queue)
        → Hiển thị badge "Chờ đồng bộ"
        → Tự sync khi có mạng
```

---

## 5. Nhóm chức năng 3 — Quản lý Thành viên

**Route**: `/members`  
**Nav**: Tab 2 — 👥 Thành viên  

### 5.1 Danh sách thành viên

> Xem design chi tiết tại `rules/design-language.md` — Section 4 (Desktop) + Section 11 (Mobile)

#### Data hiển thị

| Field | Desktop (Table) | Mobile (Card) |
|-------|----------------|---------------|
| Avatar | Initials circle 36px | Initials circle 40px |
| Họ tên | Column "Tên thành viên" | Bold, 15px |
| Loại | Chip: `Cố định` (xanh) / `Vãng lai` (xám) | Chip nhỏ dưới tên |
| Số điện thoại | Column formatted `0xxx xxx xxx` | Row 3, icon 📞 |
| Số dư tài khoản | Column aligned right, green, VNĐ | "SỐ DƯ" label + amount |
| Thao tác | Edit ✏️ + Delete 🗑️ icons | Kebab menu ⋮ |

### 5.2 Thêm / Sửa thành viên (Form)

| Field | Type | Validation | Ghi chú |
|-------|------|-----------|---------|
| Họ và tên | Text | Required, 2-50 chars | Vietnamese với dấu |
| Loại thành viên | Select | Required: `Cố định` / `Vãng lai` | Default: Cố định |
| Số điện thoại | Tel | Required, 10 digits, bắt đầu `0` | Format: `0xxxxxxxxx` |
| Số dư ban đầu | Number | Optional, default = 0 | VNĐ |

#### Acceptance Criteria

```
GIVEN   Admin mở form "Thêm thành viên"
WHEN    nhập đủ thông tin valid và bấm Lưu
THEN    
        - Member mới xuất hiện trong danh sách
        - Số dư = giá trị nhập (hoặc 0)
        - Stat card "Tổng thành viên" tăng +1
        - Snackbar: "Đã thêm [Tên] thành công"

GIVEN   admin nhập SĐT đã tồn tại
THEN    hiển thị lỗi "Số điện thoại đã được sử dụng"

GIVEN   admin xóa thành viên có số dư ≠ 0
THEN    confirm dialog: "Thành viên còn [X] VNĐ trong tài khoản. Bạn chắc chắn muốn xóa?"
```

### 5.3 Quản lý tài chính cá nhân

Mỗi thành viên có một **tài khoản nội bộ** (balance):

| Hành động | Ảnh hưởng balance |
|-----------|-------------------|
| Nạp tiền vào quỹ | `balance += amount` |
| Bị chia tiền buổi tập | `balance -= per_person` |
| Hoàn tiền (admin adjust) | `balance += amount` |

#### Lịch sử giao dịch (Transaction history)

```
┌───────────────────────────────────────┐
│ 💰 Nguyễn Văn Hùng — Lịch sử GD     │
│ Số dư hiện tại: 500.000 VNĐ          │
├───────────────────────────────────────┤
│ 10/04  Buổi tập #24    -59.000 VNĐ   │
│ 08/04  Buổi tập #23    -90.000 VNĐ   │
│ 05/04  Nạp tiền        +650.000 VNĐ  │
│ 01/04  Buổi tập #22    -85.000 VNĐ   │
└───────────────────────────────────────┘
```

### 5.4 Liên hệ nhanh qua Zalo (Mobile-only)

```
GIVEN   đang xem thành viên trên mobile
WHEN    tap nút Zalo 💬 (hoặc SĐT)
THEN    mở deep link: zalo://conversation?phone={phone_number}
        Nếu Zalo chưa cài → fallback: tel:{phone_number} (gọi điện)
```

| Property | Value |
|----------|-------|
| Button | Icon Zalo hoặc 💬 chat icon |
| Vị trí | Trong member card (mobile), hoặc trong kebab menu |
| Touch target | ≥ 48px |
| Chỉ hiển thị | Trên mobile (`display: { xs: 'flex', md: 'none' }`) |

---

## 6. Nhóm chức năng 4 — Bảng xếp hạng

**Route**: `/rankings`  
**Nav**: Tab 4 — 🏆 Xếp hạng  

### 6.1 Vinh danh Top 10

Hiển thị 10 thành viên có **phong độ xuất sắc nhất**.

```
┌───────────────────────────────────────┐
│ 🏆 Bảng xếp hạng                     │
│ Tháng 04/2026                         │
├───────────────────────────────────────┤
│  🥇 1. Nguyễn Văn Hùng     24 buổi  │
│  🥈 2. Trần Tuấn Anh       22 buổi  │
│  🥉 3. Lê Thị Mai          20 buổi  │
│     4. Phạm Quốc Việt      18 buổi  │
│     5. Hoàng Minh Đức      16 buổi  │
│     ...                               │
│    10. Vũ Thanh Tùng        8 buổi  │
│                                       │
│  📊 Bạn: #12 — 6 buổi               │ ← Vị trí của user
└───────────────────────────────────────┘
```

#### Tiêu chí xếp hạng

| Tiêu chí | Mô tả | Trọng số |
|----------|--------|----------|
| **Số buổi tham gia** | COUNT(sessions attended) trong tháng | Primary |
| **Tỷ lệ tham gia** | attended / total_sessions × 100% | Secondary (tie-breaker) |

> **Phong độ = Đi tập đều đặn**. Không liên quan đến kết quả trận đấu.

#### Acceptance Criteria

```
GIVEN   trang Bảng xếp hạng được mở
WHEN    dữ liệu load xong
THEN    
        - Hiển thị Top 10 thành viên có số buổi tham gia cao nhất trong tháng hiện tại
        - Sort: số buổi DESC, tỷ lệ DESC (tie-breaker)
        - Top 3 có medal icon (🥇🥈🥉)
        - Mỗi item hiển thị: rank, avatar, tên, số buổi
        - Footer: vị trí của current user (nếu không trong top 10)
        
GIVEN   đầu tháng mới, chưa có buổi tập nào
THEN    hiển thị empty state: "Chưa có dữ liệu tháng này. Hãy bắt đầu buổi tập đầu tiên!"

GIVEN   user tap vào 1 member trong ranking
THEN    expand/navigate xem chi tiết: lịch sử tham gia, biểu đồ trend
```

#### Thời gian & Filter

| Filter | Options | Default |
|--------|---------|---------|
| Khoảng thời gian | Tháng này / Tháng trước / 3 tháng / Toàn bộ | Tháng này |

---

## 7. Nhóm chức năng 5 — Hệ thống & Trải nghiệm

### 7.1 Responsive Layout

| Breakpoint | Layout | Navigation |
|------------|--------|------------|
| **Mobile** (`< 600px`) | Single column, cards | BottomNavigation 4 tabs |
| **Desktop** (`≥ 900px`) | Sidebar + content area | Sidebar 240px |

> Chi tiết layout tại `rules/design-language.md`

#### Navigation Tabs

| # | Icon | Label | Route | Mô tả |
|---|------|-------|-------|-------|
| 1 | 🏠 | Tổng quan | `/dashboard` | Stats + thông báo |
| 2 | 👥 | Thành viên | `/members` | CRUD members |
| 3 | 📅 | Lịch tập | `/sessions` | **CORE** — Nhập buổi tập & chia tiền |
| 4 | 🏆 | Xếp hạng | `/rankings` | Top 10 tháng |

> **Cài đặt**: route `/settings`, truy cập qua icon ⚙️ trong App Bar (không chiếm tab).

### 7.2 Định dạng tiền tệ

```
Rule: Toàn bộ số tiền trong app hiển thị format "xxx.xxx VNĐ"

Ví dụ:
  500000    → "500.000 VNĐ"
  1200000   → "1.200.000 VNĐ"
  85700     → "85.700 VNĐ"
  0         → "0 VNĐ"
  -59000    → "-59.000 VNĐ" (số âm = trừ tiền, màu đỏ)
```

#### Utility function

```typescript
const formatVND = (amount: number): string => {
  const formatted = Math.abs(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return amount < 0 ? `-${formatted} VNĐ` : `${formatted} VNĐ`;
};
```

#### Quy tắc hiển thị

| Số tiền | Màu | Ví dụ |
|---------|-----|-------|
| Dương (số dư, quỹ) | `text.money` — xanh lá `#2E7D32` | `500.000 VNĐ` |
| Âm (trừ tiền) | `error.main` — đỏ | `-59.000 VNĐ` |
| Zero | `text.secondary` — xám | `0 VNĐ` |

### 7.3 Cài đặt

**Route**: `/settings`

| Setting | Type | Mô tả |
|---------|------|-------|
| Tên nhóm | Text | Tên câu lạc bộ / nhóm chơi |
| Đơn giá cầu mặc định | Number (VNĐ) | Pre-fill khi tạo buổi tập mới |
| Tiền sân mặc định | Number (VNĐ) | Pre-fill khi tạo buổi tập mới |
| Lịch tập cố định | Multi-select ngày | VD: Thứ 3, Thứ 5 (auto nhắc) |
| Giờ tập mặc định | Time range | VD: 19:00 — 21:00 |
| Quy tắc làm tròn | Select | Xuống hàng trăm / Xuống hàng nghìn / Không làm tròn |

### 7.4 Xác thực người dùng (Authentication)

> **Mỗi thành viên = 1 tài khoản**. Đăng ký xong = có tài khoản member.

#### Màn hình Đăng nhập (`/login`)

| Element | Chi tiết |
|---------|----------|
| **Header** | App icon + "Chào mừng trở lại" + sub "Đăng nhập để quản lý lịch tập và sân đấu của bạn." |
| **Tên đăng nhập** | Text input, placeholder `username@example.com` |
| **Mật khẩu** | Password input + toggle visibility (eye icon) |
| **Ghi nhớ đăng nhập** | Checkbox — lưu session dài hạn |
| **Quên mật khẩu?** | Link → flow reset password |
| **Nút Đăng nhập** | Primary button, full-width, green (`#2E7D32`) |
| **Social login** | Google + Facebook — "hoặc tiếp tục với" |
| **Đăng ký** | Link "Bạn chưa có tài khoản? **Đăng ký ngay**" → `/register` |

#### Màn hình Đăng ký (`/register`)

> Chưa có mockup. Đăng ký = tạo tài khoản member.

| Field | Type | Required | Ghi chú |
|-------|------|----------|--------|
| Họ tên | Text | ✅ | = `displayName` |
| Email | Email | ✅ | Unique, dùng để login |
| Mật khẩu | Password (min 8 chars) | ✅ | |
| Xác nhận mật khẩu | Password | ✅ | |
| Số điện thoại | Phone | ✅ | Dùng liên hệ Zalo |
| Mã mời nhóm | Text | Tùy chọn | Nếu có → auto join nhóm |

#### Auth Flow

```
/login ── Đăng nhập thành công ──→ /dashboard
  │                                    │
  ├── "Quên mật khẩu?" ──→ /forgot-password
  └── "Đăng ký ngay" ──→ /register ──→ /dashboard

Guard: Tất cả route (trừ /login, /register, /forgot-password)
       → redirect /login nếu chưa auth
```

#### Yêu cầu kỹ thuật

| Item | Chi tiết |
|------|----------|
| Token | JWT (access + refresh) hoặc session-based |
| Social OAuth | Google Sign-In, Facebook Login SDK |
| Password | Bcrypt hash, min 8 chars |
| Remember me | Persistent token (30 ngày) vs session token |
| Rate limit | Max 5 login attempts / 15 phút |

---

## 8. Data Model

### Entities

> **Nguyên tắc: Member = Account**. Không tách User / Member riêng. Mỗi member tự đăng ký tài khoản.

```
┌─────────────────┐     ┌─────────────────┐     ┌──────────────┐
│   Member        │     │    Session      │     │   Attendance │
│   (= Account)   │     ├─────────────────┤     ├──────────────┤
├─────────────────┤     │ id              │     │ id           │
│ id              │     │ groupId         │─── Group
│ email           │     │ date            │     │ sessionId    │─── Session
│ passwordHash    │     │ courtFee        │     │ memberId     │─── Member
│ displayName     │     │ shuttlecockQty  │     │ isPresent    │
│ phone           │     │ shuttlecockPrice│     │ amountCharged│
│ avatarUrl       │     │ totalCost       │     │ createdAt    │
│ provider        │     │ perPerson       │     └──────────────┘
│ providerId      │     │ attendeeCount   │
│ status          │     │ status          │     ┌──────────────┐
│ createdAt       │     │ note            │     │ Transaction  │
│ updatedAt       │     │ remainder       │     ├──────────────┤
└─────────────────┘     │ createdAt       │     │ id           │
        │               └─────────────────┘     │ memberId     │─── Member
        │ N:N (qua GroupMember)                 │ sessionId    │─── Session?
        ▼                                       │ type         │
┌─────────────────┐                             │ amount       │
│  GroupMember    │                             │ balanceAfter │
├─────────────────┤                             │ note         │
│ id              │                             │ createdAt    │
│ groupId         │─── Group                    └──────────────┘
│ memberId        │─── Member
│ role            │    (admin/member)    ┌──────────────┐
│ type            │    (fixed/guest)     │    Group     │
│ balance         │                      ├──────────────┤
│ status          │                      │ id           │
│ joinedAt        │                      │ name         │
└─────────────────┘                      │ inviteCode   │
                                         │ defaultCourt │
                                         │ defaultShuttlecock│
                                         │ roundingRule │
                                         │ createdAt    │
                                         └──────────────┘
```

### Field Details

#### Member (= Account — mỗi thành viên 1 tài khoản)

| Field | Type | Constraints |
|-------|------|------------|
| `id` | UUID | PK, auto-generated |
| `email` | string | Required, unique, valid email format — dùng để login |
| `passwordHash` | string | Bcrypt hash, min 8 chars raw |
| `displayName` | string | Required, 2-50 chars |
| `phone` | string | Required, unique, 10 digits, starts with `0` |
| `avatarUrl` | string | Nullable — URL ảnh profile |
| `provider` | enum | `'local'` \| `'google'` \| `'facebook'` |
| `providerId` | string | Nullable — external OAuth ID |
| `status` | enum | `'active'` \| `'suspended'` |
| `createdAt` | datetime | Auto |
| `updatedAt` | datetime | Auto |

#### Group (Nhóm chơi)

| Field | Type | Constraints |
|-------|------|------------|
| `id` | UUID | PK |
| `name` | string | Required, 2-100 chars — tên nhóm/CLB |
| `inviteCode` | string | Unique, 8 chars — mã mời tham gia |
| `defaultCourtFee` | number | Optional — tiền sân mặc định |
| `defaultShuttlecockPrice` | number | Optional — giá cầu mặc định |
| `roundingRule` | enum | `'none'` \| `'hundred'` \| `'thousand'` |
| `schedule` | json | Optional — lịch tập cố định (ngày, giờ) |
| `createdAt` | datetime | Auto |

#### GroupMember (Quan hệ Member ↔ Group)

| Field | Type | Constraints |
|-------|------|------------|
| `id` | UUID | PK |
| `groupId` | UUID | FK → Group |
| `memberId` | UUID | FK → Member |
| `role` | enum | `'admin'` \| `'member'` — Admin = trưởng nhóm |
| `type` | enum | `'fixed'` \| `'guest'` (Cố định \| Vãng lai) |
| `balance` | number | Default: 0, can be negative — số dư trong nhóm này |
| `status` | enum | `'active'` \| `'inactive'` \| `'pending'` |
| `joinedAt` | datetime | Auto |

> **`balance` nằm ở GroupMember**, không phải Member. Vì 1 member có thể ở nhiều nhóm, mỗi nhóm có số dư riêng.

#### Session (Buổi tập)

| Field | Type | Constraints |
|-------|------|------------|
| `id` | UUID | PK |
| `groupId` | UUID | FK → Group — buổi tập thuộc nhóm nào |
| `createdBy` | UUID | FK → Member — admin tạo buổi |
| `date` | date | Required, ≤ today |
| `courtFee` | number | Required, > 0, VNĐ |
| `shuttlecockQty` | number | Required, ≥ 0 |
| `shuttlecockPrice` | number | Required if qty > 0, VNĐ/quả |
| `totalCost` | number | Computed: courtFee + (qty × price) |
| `perPerson` | number | Computed: ROUND(totalCost / attendeeCount) |
| `attendeeCount` | number | Computed: COUNT(attendance WHERE isPresent) |
| `status` | enum | `'draft'` \| `'pending'` \| `'settled'` |
| `note` | string | Optional, max 200 chars |
| `remainder` | number | totalCost - (perPerson × attendeeCount), vào quỹ |
| `createdAt` | datetime | Auto |

#### Attendance (Điểm danh)

| Field | Type | Constraints |
|-------|------|------------|
| `id` | UUID | PK |
| `sessionId` | UUID | FK → Session |
| `memberId` | UUID | FK → Member (= Account) |
| `isPresent` | boolean | Default: false |
| `amountCharged` | number | = perPerson nếu isPresent, 0 nếu không |
| `createdAt` | datetime | Auto |

#### Transaction (Lịch sử giao dịch)

| Field | Type | Constraints |
|-------|------|------------|
| `id` | UUID | PK |
| `groupMemberId` | UUID | FK → GroupMember (xác định member + group) |
| `sessionId` | UUID | FK → Session (nullable — cho giao dịch nạp tiền) |
| `type` | enum | `'session_charge'` \| `'deposit'` \| `'refund'` \| `'adjustment'` |
| `amount` | number | Âm = trừ, dương = cộng |
| `balanceAfter` | number | Số dư sau giao dịch |
| `note` | string | Tự động hoặc admin nhập |
| `createdAt` | datetime | Auto |

---

## 9. Business Rules & Logic chia tiền

### Rule 1: Công thức chia tiền

```
Tiền cầu    = shuttlecockQty × shuttlecockPrice
Tổng        = courtFee + Tiền cầu
Mỗi người   = ROUND_DOWN(Tổng / attendeeCount, roundingUnit)
Phần dư     = Tổng - (Mỗi người × attendeeCount)
```

### Rule 2: Làm tròn

| Setting | Ví dụ | Kết quả |
|---------|-------|---------|
| Không làm tròn | 85.714 | 85.714 VNĐ |
| Xuống hàng trăm | 85.714 | 85.700 VNĐ |
| Xuống hàng nghìn | 85.714 | 85.000 VNĐ |

Phần dư luôn vào quỹ nhóm.

### Rule 3: Trạng thái buổi tập

```
   📝 draft ──→ ⏳ pending ──→ ✅ settled
   (đang nhập)   (có kết quả)   (đã trừ tiền)
                       │              │
                       └── Sửa ◄──────┘ (Admin có thể revert)
```

| Status | Mô tả | Actions allowed |
|--------|--------|----------------|
| `draft` | Đang nhập chi phí/điểm danh | Edit all fields |
| `pending` | Đã tính xong, chờ xác nhận | View result, Edit, Confirm |
| `settled` | Đã trừ tiền thành viên | View only, Revert (admin) |

### Rule 4: Revert buổi tập đã settle

```
GIVEN   session.status = 'settled'
WHEN    admin chọn "Hoàn tác"
THEN    
        - Với mỗi attendee: member.balance += amountCharged (hoàn lại)
        - fund.balance -= remainder (hoàn phần dư)
        - Tạo transaction type 'refund' cho mỗi member
        - session.status → 'pending'
        - Confirm dialog bắt buộc: "Hoàn tác sẽ trả lại tiền cho X người. Bạn chắc chắn?"
```

### Rule 5: Thành viên mới giữa buổi

```
GIVEN   session đang ở status 'draft' hoặc 'pending'
WHEN    admin thêm member mới vào hệ thống
THEN    member mới xuất hiện trong danh sách điểm danh (unchecked)
        Hệ thống KHÔNG tự re-calculate — admin phải chủ động tick và bấm tính lại
```

### Rule 6: Số dư âm

```
Cho phép balance âm (VD: -150.000 VNĐ).
Hiển thị: màu đỏ, icon cảnh báo.
Nhắc nhở: khi balance < -200.000 → banner warning trên member card.
```

---

## 10. Screens & Navigation Map

```
Auth (public routes)
├─ /login ──────────────── Đăng nhập
│   ├── Form: username + password
│   ├── Social: Google / Facebook
│   └── Links: Quên mật khẩu / Đăng ký
├─ /register ───────────── Đăng ký
└─ /forgot-password ────── Quên mật khẩu

App Shell (protected routes — require auth)
├─ [BottomNav / Sidebar]
│
├─ /dashboard ──────────── Tổng quan
│   ├── Stats Cards (buổi tập, quỹ, thành viên)
│   └── Banner: Buổi tập kế tiếp
│
├─ /members ────────────── Thành viên
│   ├── Danh sách (Table desktop / Card list mobile)
│   ├── /members/new ──── Form thêm
│   ├── /members/:id ──── Chi tiết + Lịch sử GD
│   └── /members/:id/edit ── Form sửa
│
├─ /sessions ───────────── Lịch tập & Thu chi ⭐ CORE
│   ├── Danh sách sessions (card list)
│   ├── /sessions/new ─── Form tạo buổi tập mới
│   │   ├── Step 1: Ngày + Ghi chú
│   │   ├── Step 2: Chi phí (sân + cầu)
│   │   ├── Step 3: Điểm danh
│   │   └── Step 4: Kết quả chia tiền
│   ├── /sessions/:id ─── Chi tiết buổi tập
│   └── /sessions/:id/edit
│
├─ /rankings ───────────── Bảng xếp hạng
│   └── Top 10 + filter tháng
│
└─ /settings ───────────── Cài đặt ⚙️
    ├── Thông tin nhóm
    ├── Giá mặc định (sân, cầu)
    ├── Lịch tập cố định
    └── Quy tắc làm tròn
```

### Screen Count: 15 screens

| # | Screen | Priority |
|---|--------|----------|
| 1 | **Login** | **P0** ⭐ |
| 2 | **Register** | **P0** ⭐ |
| 3 | **Forgot Password** | P1 |
| 4 | Dashboard | P1 |
| 5 | Member List | P1 |
| 6 | Member Add/Edit | P1 |
| 7 | Member Detail + Transaction History | P1 |
| 8 | Session List | P1 |
| 9 | Session Create — Cost Input | **P0** ⭐ |
| 10 | Session Create — Attendance | **P0** ⭐ |
| 11 | Session Create — Result | **P0** ⭐ |
| 12 | Session Detail | P1 |
| 13 | Rankings | P2 |
| 14 | Settings | P2 |
| 15 | App Shell (Nav + Layout) | P0 |

---

## 11. Non-Functional Requirements

| Category | Requirement | Target |
|----------|------------|--------|
| **Performance** | First Contentful Paint (4G) | < 1.5s |
| **Performance** | Time to Interactive (4G) | < 3s |
| **Performance** | Initial JS bundle | < 200KB |
| **Mobile** | Touch targets | ≥ 48px |
| **Mobile** | Primary layout | Mobile-first (xs breakpoint) |
| **Offline** | Session create (draft) | Lưu local, sync khi có mạng |
| **PWA** | Installable | manifest.json + service worker |
| **PWA** | Push notifications | Nhắc lịch tập |
| **Accessibility** | WCAG | 2.1 AA |
| **Format** | Tiền tệ | VNĐ format: `xxx.xxx VNĐ` |
| **Format** | Số điện thoại | `0xxx xxx xxx` |
| **Security** | Phone number | Mask on list: `0908 xxx xxx` (chỉ admin thấy đầy đủ) |
| **Data** | Backup | Local storage + cloud sync |

---

## 12. Phân pha & Roadmap

### Phase 1: Core MVP (3-4 tuần)

> Mục tiêu: **Nhập buổi tập → Chia tiền chạy được trên mobile.**

| Week | Deliverable |
|------|-------------|
| W1 | App shell (layout, routing, theme, BottomNav) + Member CRUD |
| W2 | Session Create form (chi phí + điểm danh + chia tiền) |
| W3 | Dashboard stats + Transaction history + Format VNĐ |
| W4 | Testing, bug fix, PWA setup, deploy |

**Exit criteria Phase 1:**
- [ ] Tạo buổi tập, nhập chi phí, điểm danh, chia tiền tự động ✅
- [ ] Thêm/sửa/xóa thành viên ✅  
- [ ] Xem số dư mỗi thành viên ✅
- [ ] Dashboard hiển thị stats ✅
- [ ] Chạy tốt trên mobile + desktop ✅

### Phase 2: Polish (2 tuần)

| Feature |
|---------|
| Bảng xếp hạng Top 10 |
| Settings (giá mặc định, lịch cố định) |
| Zalo deep link liên hệ |
| Lịch sử giao dịch chi tiết |
| Offline draft cho sessions |
| Push notification nhắc lịch |

### Phase 3: Growth (tương lai)

| Feature |
|---------|
| Multi-group support (1 user nhiều nhóm) |
| Export báo cáo (PDF/Excel) |
| Nạp tiền online (MoMo, ZaloPay) |
| Tự động tạo lịch tập recurring |
| Thống kê chi tiêu theo tháng (chart) |
| **Sân đấu**: Ghi điểm trận đấu realtime (xem mockup `point_count.png`) |
| **Ghép cặp**: Random/manual match pairing 1v1 + 2v2 (xem mockup `queuing_single.png`, `queue_double.png`) |
| **Lịch sử đấu**: Match history với THẮNG/THUA, tỉ lệ, Level (xem mockup `history.png`) |
| **Ranking nâng cao**: Xếp hạng theo điểm thi đấu + win rate (xem mockup `ranking.png`) |

---

## 13. Appendix: Mockup Diff Notes

> Mockup tại `mockup_ui/`. Chi tiết diff đầy đủ xem `mockup_ui/README.md`.

### UI khác biệt cần note khi implement

| Component | Mockup | PRD | Áp dụng |
|-----------|--------|-----|---------|
| Điểm danh | **Toggle switches** (ON/OFF) | Checkboxes | → Dùng **Toggle** — rõ hơn trên mobile |
| Form Lịch tập | Single-page scroll | Stepped form | → Dùng **single-page** (mockup) — đơn giản hơn |
| Tổng kết dự kiến | Nổi bật ở cuối form + "Xuất PDF" | Card riêng Step 4 | → Merge: tổng kết **inline cuối form** |
| "Thêm khách ngoài DS" | Có button cuối điểm danh | Chưa có | → Thêm vào Phase 1 (hữu ích cho vãng lai) |
| Dashboard "Hoạt động gần đây" | Activity feed cards | Chưa detail | → Thêm vào Phase 1 |
| Tiền format | Dấu phẩy `450,000` | Dấu chấm `450.000` | → Dùng **dấu chấm** (PRD) — chuẩn VN |

### Features trong mockup → CHƯA nằm trong scope Phase 1

| Mockup | Feature | Lý do chưa triển khai |
|--------|---------|----------------------|
| `point_count.png` | Scoreboard trận đấu | BA không yêu cầu. Scope Phase 3 |
| `queuing_single.png` + `queue_double.png` | Ghép cặp 1v1/2v2 | BA không yêu cầu. Scope Phase 3 |
| `history.png` | Lịch sử thi đấu | BA không yêu cầu. Scope Phase 3 |
| `ranking.png` (points) | Ranking điểm + win rate | PRD ranking = số buổi tham gia. Phiên bản points = Phase 3 |
| `overview_2.png` trạng thái sân | Court status bars | BA không yêu cầu. Scope Phase 2+ |
| `overview_2.png` chart | Tỷ lệ tham gia tuần | Nice-to-have. Scope Phase 2 |

### Bottom Navigation — Thống nhất

Mockup có nhiều variant BottomNav khác nhau. **Quyết định chính thức theo PRD**:

```
Phase 1: 4 tabs
┌──────────┬──────────┬──────────┬──────────┐
│ 🏠       │ 👥       │ 📅       │ 🏆       │
│ Tổng quan│ Thành viên│ Lịch tập │ Xếp hạng│
└──────────┴──────────┴──────────┴──────────┘

Phase 3 (nếu thêm Sân đấu): 5 tabs hoặc redesign navigation
```
