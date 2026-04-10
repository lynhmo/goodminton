# Mockup UI — The Court & Canvas

> **⚠️ LƯU Ý**: Ảnh mockup có thể KHÔNG chính xác 100% với tài liệu PRD (`docs/PRD.md`).  
> Khi có xung đột: **PRD là source of truth**, mockup là visual reference.
> Hiện tại chủ yếu có mock **mobile**.

---

## Danh sách ảnh

### Desktop (`desktop/`)

| File | Màn hình | Mô tả |
|------|----------|-------|
| `overview.png` | Dashboard | Sidebar + Welcome + 2 stats + Thông báo + Hoạt động gần đây + Trạng thái sân + Chart tham gia |
| `member.png` | Thành viên | Table layout: Avatar, Tên, Loại, SĐT, Số dư, Thao tác |

### Mobile (`mobile/`)

| File | Màn hình | Mô tả |
|------|----------|-------|
| `overview_1.png` | Dashboard (trên) | Welcome "Chào mừng trở lại, Admin" + 2 stat cards + Thông báo buổi tập + Hoạt động gần đây |
| `overview_2.png` | Dashboard (dưới) | Hoạt động gần đây (tiếp) + Trạng thái sân hôm nay + Tỷ lệ tham gia tuần (bar chart) |
| `member.png` | Thành viên | Card list: Avatar initials + Tên + Badge CĐ/VL + SĐT + Số dư + Pagination |
| `plan_1.png` | Lịch tập — Form nhập | Single-page form: Ngày, Tiền sân, Số cầu, Giá/quả + Tổng kết dự kiến + "Lưu buổi tập" / "Xuất PDF" |
| `plan_2.png` | Lịch tập — Điểm danh | Toggle switches (ON/OFF), counter "8/12", "Chọn tất cả", "Thêm khách ngoài danh sách" |
| `point_count.png` | **Tỉ số trận đấu** | Scoreboard: Đội A vs Đội B, +/- buttons, Set đấu, GIAO BÓNG/NHẬN BÓNG |
| `history.png` | **Lịch sử đấu** | Match results: THẮNG/THUA, score, 1v1/2v2, tỉ lệ thắng %, Level |
| `ranking.png` | **Xếp hạng (points)** | Top 3 podium + list #4-6 với points + win rate % |
| `queuing_single.png` | **Ghép cặp 1v1** | Player vs "Đang chờ", "Ghép cặp ngẫu nhiên", chọn thủ công, badges MỚI/BẬN |
| `queue_double.png` | **Ghép cặp 2v2** | Toggle Ghép đơn/Ghép đôi, team setup + partner |
| `login.png` | **Đăng nhập** | Username + Password, "Ghi nhớ đăng nhập", "Quên mật khẩu?", Social login (Google/Facebook), "Đăng ký ngay" |

---

## Phân tích khác biệt: Mockup vs PRD

### ✅ Khớp với PRD

| Mockup | PRD Section | Ghi chú |
|--------|-------------|---------|
| `member.png` (mobile) | §5 Thành viên | Gần khớp: card layout, avatar, badge, SĐT, số dư |
| `member.png` (desktop) | §5 + design-language §4 | Table layout đúng cấu trúc |
| `overview_1.png` stats | §3.1 Dashboard stats | 2/3 stats match (buổi tập, quỹ). Thiếu stat "Tổng thành viên" |
| `overview_1.png` thông báo | §3.2 Buổi tập kế tiếp | Khớp concept |
| `plan_1.png` form | §4.2 Form chi phí | Khớp fields: ngày, tiền sân, số cầu, giá/quả, tổng kết |
| `plan_2.png` điểm danh | §4.2 Step 3 Điểm danh | Khớp concept nhưng UI khác (toggle vs checkbox) |

### ⚠️ Khác biệt nhỏ (cùng feature, UI khác)

| Chi tiết | Mockup | PRD | Quyết định |
|----------|--------|-----|-----------|
| **Điểm danh UI** | Toggle switches (ON/OFF) | Checkboxes | → Dùng **Toggle** (mockup) — rõ hơn trên mobile |
| **Member sub-label** | "Thành viên nòng cốt" / "Khách mời" | "Cố định" / "Vãng lai" | → Dùng **"Cố định" / "Vãng lai"** (PRD) — BA đã xác nhận |
| **Dashboard stats** | 2 cards (buổi tập, quỹ) | 3 cards (+ thành viên) | → Theo **PRD** (3 cards) |
| **Tiền format** | `450,000` (dấu phẩy) | `450.000` (dấu chấm) | → Theo **PRD** (dấu chấm VNĐ chuẩn) |
| **Xuất PDF** | Có nút "Xuất file PDF" | Chưa có trong PRD | → Ghi nhận, triển khai **Phase 2** |
| **Thêm khách ngoài DS** | Có button | Chưa có trong PRD | → Ghi nhận, triển khai **Phase 2** |

### 🔴 Mockup có — PRD CHƯA CÓ (Features mới phát hiện)

| Mockup | Feature | Mô tả | Ghi chú |
|--------|---------|-------|---------|
| `point_count.png` | **Ghi điểm trận đấu** | Scoreboard realtime: Đội A vs B, +/-, set tracking, giao bóng/nhận bóng | Không có trong BA requirements. Cần confirm scope |
| `history.png` | **Lịch sử thi đấu** | Cards: THẮNG/THUA, score, 1v1/2v2, tỉ lệ thắng, Level | Không có trong BA requirements |
| `ranking.png` | **Xếp hạng theo points** | Top 3 podium, points + win rate % | PRD ranking = theo số buổi. Mockup = theo điểm thi đấu |
| `queuing_single.png` | **Ghép cặp 1v1** | Random/manual match pairing, player stats | Không có trong BA requirements |
| `queue_double.png` | **Ghép cặp 2v2** | Team formation, partner selection | Không có trong BA requirements |
| `overview_2.png` | **Trạng thái sân** | Progress bars: Sân A (Sẵn sàng), Sân B (Đang bảo trì) | Không có trong BA requirements |
| `overview_2.png` | **Chart tham gia** | Bar chart tỷ lệ tham gia T2→CN | Không có trong BA requirements |
| `history.png` | **Activity feed** | Nạp tiền, buổi tập hoàn thành, cập nhật lịch | Có trong mockup overview, chưa detail trong PRD |
| `login.png` | **Đăng nhập / Đăng ký** | Login form + Social login + Register link | PRD chưa có auth. → Thêm vào PRD §7.4 |

### 🔀 Bottom Navigation không nhất quán giữa mockups

| Mockup | Bottom Nav tabs |
|--------|----------------|
| `member.png` | Tổng quan, **Thành viên**, Lịch tập, Xếp hạng |
| `plan_2.png` | Tổng quan, Thành viên, **Lịch tập**, Xếp hạng |
| `point_count.png` | SÂN ĐẤU, THÀNH VIÊN, **LỊCH HẸN**, CÁ NHÂN |
| `queuing_single.png` | SÂN ĐẤU, THÀNH VIÊN, **LỊCH HẸN**, CÁ NHÂN |
| `ranking.png` | Courts, **Ranking**, Matches, Profile |
| `history.png` | Courts, Xếp hạng, Ghép cặp, Tí số, **Lịch sử đấu** (5 tabs!) |

> **→ Cần thống nhất**: PRD hiện tại dùng 4 tabs: Tổng quan, Thành viên, Lịch tập, Xếp hạng.
> Mockup sân đấu dùng nav riêng. Nếu merge → cần redesign navigation.

---

## Kết luận

Mockups cho thấy **2 "mode" khác nhau** của app:

1. **Mode "Quản lý nhóm"** (= PRD hiện tại): Dashboard, Members, Lịch tập & Thu chi, Ranking theo attendance
2. **Mode "Sân đấu"** (= mockups mới): Ghi điểm, Ghép cặp, Lịch sử đấu, Ranking theo points

→ Cần BA confirm: Ship cả 2 mode? Hay Phase 1 chỉ Mode 1, Mode 2 = Phase 3?
