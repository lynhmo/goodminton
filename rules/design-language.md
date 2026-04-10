# Design Language & Layout — The Court & Canvas

> Rule áp dụng cho toàn bộ giao diện ứng dụng Badminton "The Court & Canvas — Precision Motion".
> Desktop layout là primary reference. Mobile-first adaptation xem thêm tại `agents/ui-reviewer.md`.
> **Mockup UI**: `mockup_ui/` — Ảnh thiết kế gốc cho desktop + mobile.

---

## 1. Brand Identity

- **Tên app**: The Court & Canvas
- **Tagline**: Precision Motion
- **Logo**: Icon xanh lá + tên app, đặt ở top-left sidebar
- **Tone**: Chuyên nghiệp, sạch sẽ, thể thao — KHÔNG flashy, KHÔNG gaming-style

---

## 2. Color Palette

### Primary Colors

| Token | Hex | Dùng cho |
|-------|-----|----------|
| `primary.main` | `#2E7D32` | Buttons, links, active nav, FAB, badges CTA |
| `primary.light` | `#4CAF50` | Hover states, chip "Cố định", amount text |
| `primary.dark` | `#1B5E20` | Pressed states, emphasis |
| `primary.contrast` | `#FFFFFF` | Text trên nền primary |

### Neutral Colors

| Token | Hex | Dùng cho |
|-------|-----|----------|
| `background.default` | `#FFFFFF` | Main content background |
| `background.sidebar` | `#F8F9FA` | Sidebar background |
| `background.card` | `#FFFFFF` | Card surfaces, table rows |
| `background.hover` | `#F5F5F5` | Row hover, nav item hover |
| `border.light` | `#E0E0E0` | Table borders, card borders, dividers |
| `border.card` | `#EEEEEE` | Card outline (subtle) |

### Text Colors

| Token | Hex | Dùng cho |
|-------|-----|----------|
| `text.primary` | `#212121` | Headings, tên thành viên, body text |
| `text.secondary` | `#757575` | Subtitles, labels, table headers |
| `text.disabled` | `#BDBDBD` | Placeholder, disabled states |
| `text.money` | `#2E7D32` | Số tiền VNĐ (luôn xanh lá) |

### Semantic Colors

| Token | Hex | Dùng cho |
|-------|-----|----------|
| `success` | `#4CAF50` | Available slots, positive status |
| `error` | `#F44336` | Delete actions, occupied slots, negative |
| `warning` | `#FF9800` | Alerts, pending states |
| `info` | `#2196F3` | Stat icons, informational |

### Stat Card Icon Backgrounds

| Stat | Background | Icon color |
|------|-----------|------------|
| Tổng thành viên | `#E3F2FD` (blue-50) | `#1976D2` (blue-700) |
| Thành viên cố định | `#E8F5E9` (green-50) | `#2E7D32` (green-800) |
| Tổng số dư | `#E0F2F1` (teal-50) | `#00695C` (teal-800) |

---

## 3. Typography

### Font Stack

```css
font-family: 'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif;
```

### Scale

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page title (H1) | `24px` / `1.5rem` | **700** (Bold) | `text.primary` |
| Page subtitle | `14px` / `0.875rem` | 400 | `text.secondary` |
| Stat number | `28px` / `1.75rem` | **700** | `text.primary` |
| Stat label | `13px` / `0.8125rem` | 500 | `text.secondary` |
| Table header | `13px` / `0.8125rem` | **600** | `text.secondary` |
| Table cell | `14px` / `0.875rem` | 400 | `text.primary` |
| Table cell (money) | `14px` / `0.875rem` | **600** | `text.money` |
| Nav item | `14px` / `0.875rem` | 500 | `text.primary` |
| Nav item (active) | `14px` / `0.875rem` | **600** | `primary.main` |
| Button label | `14px` / `0.875rem` | **600** | depends on variant |
| Chip/Badge | `12px` / `0.75rem` | 500 | depends on type |
| Pagination | `14px` | 500 | `text.primary` |
| Footer/Help | `13px` | 400 | `text.secondary` |

### Quy tắc Typography

- Tiếng Việt đầy đủ dấu — KHÔNG viết tắt trừ VNĐ, TB, CRUD
- Số tiền: `xxx.xxx VNĐ` (dấu chấm ngăn cách hàng nghìn, space trước VNĐ)
- Số điện thoại: `0xxx xxx xxx` (nhóm 4-3-3)
- "Hiển thị X trên Y..." cho pagination info

---

## 4. Desktop Layout Structure

```
┌──────────────────────────────────────────────────────────┐
│ ┌─────────┐ ┌──────────────────────────────────────────┐ │
│ │         │ │  Page Title          [Search] [+ Action]  │ │
│ │  LOGO   │ │  Subtitle                                 │ │
│ │         │ ├──────────────────────────────────────────┤ │
│ │ ──────  │ │                                          │ │
│ │ Nav 1 ● │ │  [Stat Card 1] [Stat Card 2] [Stat 3]   │ │
│ │ Nav 2   │ │                                          │ │
│ │ Nav 3   │ ├──────────────────────────────────────────┤ │
│ │ Nav 4   │ │  TABLE HEADER                            │ │
│ │ Nav 5   │ │  ────────────────────────────────────    │ │
│ │         │ │  Row 1     [type]  phone  amount  [✏️🗑] │ │
│ │         │ │  Row 2     [type]  phone  amount  [✏️🗑] │ │
│ │         │ │  Row 3     [type]  phone  amount  [✏️🗑] │ │
│ │         │ │  Row 4     [type]  phone  amount  [✏️🗑] │ │
│ │         │ │                                          │ │
│ │         │ │  Showing X of Y       < 1  2  3 >        │ │
│ │         │ └──────────────────────────────────────────┘ │
│ │         │                                              │
│ │ [+ CTA] │                                              │
│ │ ⓘ Help  │                                              │
│ └─────────┘                                              │
└──────────────────────────────────────────────────────────┘
```

### Sidebar (Desktop)

| Property | Value |
|----------|-------|
| Width | `240px` fixed |
| Background | `#F8F9FA` |
| Border right | `1px solid #E0E0E0` |
| Logo area | `padding: 20px 16px`, logo + app name + tagline |
| Nav items | Stacked vertical, `padding: 10px 16px`, `border-radius: 8px` |
| Nav active | `background: #E8F5E9`, `color: primary.main`, `font-weight: 600` |
| Nav icon | `20px`, spacing `12px` to label |
| Bottom area | CTA button + Help link, `padding: 16px` |

### Main Content Area

| Property | Value |
|----------|-------|
| Margin left | `240px` (sidebar width) |
| Padding | `24px 32px` |
| Max content width | `1200px` |
| Background | `#FFFFFF` |

### Page Header Row

```
[Title + Subtitle]                    [Search Input] [+ Thêm mới Button]
```

| Element | Spec |
|---------|------|
| Layout | `display: flex`, `justify-content: space-between`, `align-items: flex-start` |
| Title | H1, `margin-bottom: 4px` |
| Subtitle | Below title, `text.secondary` |
| Search | `width: 280px`, `height: 40px`, left icon, `border-radius: 8px`, `border: 1px solid #E0E0E0` |
| Action button | Primary green, icon left `+`, label right, `height: 40px`, `border-radius: 8px` |
| Gap | `16px` between search and button |

### Stats Cards Row

```
[Icon + Label + Number]  [Icon + Label + Number]  [Icon + Label + Number]
```

| Property | Value |
|----------|-------|
| Layout | `display: flex`, `gap: 16px`, `margin: 24px 0` |
| Card | `padding: 16px 20px`, `border-radius: 12px`, `border: 1px solid #EEEEEE` |
| Card width | `flex: 1` (equal width) |
| Icon | `40px` circle, colored background, white/dark icon inside |
| Label | Above number, `text.secondary`, `13px` |
| Number | Below label, `28px`, **bold**, `text.primary` (hoặc `text.money` cho VNĐ) |
| Shadow | `box-shadow: 0 1px 3px rgba(0,0,0,0.08)` |

### Data Table

| Property | Value |
|----------|-------|
| Border | `1px solid #E0E0E0` top, `border-radius: 8px` container |
| Header row | `background: #FAFAFA`, `padding: 12px 16px`, text `uppercase`, `13px`, `text.secondary` |
| Body row | `padding: 14px 16px`, `border-bottom: 1px solid #F0F0F0` |
| Row hover | `background: #F5F5F5` transition `0.15s` |
| Last row | No bottom border |

#### Table Columns (Thành viên page)

| Column | Width | Align | Content |
|--------|-------|-------|---------|
| Tên thành viên | `~30%` | left | Avatar initials + Full name |
| Loại | `~15%` | left | Chip badge |
| Số điện thoại | `~20%` | left | Formatted phone |
| Số dư tài khoản | `~20%` | right | Green amount + VNĐ |
| Thao tác | `~15%` | center | Edit + Delete icons |

### Avatar Initials

| Property | Value |
|----------|-------|
| Size | `36px` circle |
| Background | Generated from name hash — soft pastel colors |
| Text | `14px`, **600**, `white` hoặc `dark` tùy contrast |
| Letters | 2 chữ cái đầu của Họ + Tên (VD: "NH" = **N**guyễn **H**ùng) |
| Margin right | `12px` to name text |

### Chips / Badges (Loại thành viên)

| Type | Background | Text | Border |
|------|-----------|------|--------|
| Cố định | `#E8F5E9` | `#2E7D32` | none |
| Vãng lai | `#F5F5F5` | `#757575` | `1px solid #E0E0E0` |

| Property | Value |
|----------|-------|
| Height | `24px` |
| Padding | `4px 12px` |
| Border radius | `12px` (pill shape) |
| Font size | `12px`, weight `500` |

### Action Icons (Thao tác)

| Icon | Action | Color | Hover |
|------|--------|-------|-------|
| ✏️ Edit (pencil) | Edit member | `#757575` | `#424242` |
| 🗑️ Delete (trash) | Delete member | `#757575` | `#F44336` |

| Property | Value |
|----------|-------|
| Size | `20px` icon, `36px` click area |
| Gap | `8px` between icons |
| Cursor | `pointer` |
| Transition | `color 0.15s` |

### Pagination

| Property | Value |
|----------|-------|
| Position | Bottom-right of table |
| Info text | Left: "Hiển thị X trên Y thành viên" |
| Page numbers | Circles `32px`, active = `primary.main` bg + white text |
| Arrows | `<` `>` buttons, disabled state when at boundary |
| Gap | `4px` between page numbers |
| Margin top | `16px` from table |

---

## 5. Navigation Structure (Sidebar)

| # | Icon | Label | Route |
|---|------|-------|-------|
| 1 | 📊 | Tổng quan | `/dashboard` |
| 2 | 👥 | Thành viên | `/members` |
| 3 | 📅 | Lịch tập & Thu chi | `/schedule` |
| 4 | 🏆 | Bảng xếp hạng | `/rankings` |
| 5 | ⚙️ | Cài đặt | `/settings` |

---

## 6. Component Inventory

### Buttons

| Variant | Background | Text | Border | Use |
|---------|-----------|------|--------|-----|
| **Primary** | `primary.main` | white | none | CTA: Thêm mới, Thêm Thành Viên |
| **Secondary** | transparent | `primary.main` | `1px solid primary.main` | Secondary actions |
| **Ghost/Icon** | transparent | `text.secondary` | none | Edit, Delete trong table |
| **Danger** | `error` | white | none | Xác nhận xóa |

| Property | Value |
|----------|-------|
| Height | `40px` (default), `48px` (large/mobile) |
| Border radius | `8px` |
| Padding | `8px 20px` |
| Font | `14px`, **600** |
| Icon + label gap | `8px` |
| Hover | Darken 10% |
| Disabled | `opacity: 0.5`, `cursor: not-allowed` |

### Cards (Stats)

```tsx
// MUI implementation pattern
<Card sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
  <Stack direction="row" spacing={2} alignItems="center">
    <Avatar sx={{ bgcolor: iconBg, width: 40, height: 40 }}>
      <Icon sx={{ color: iconColor }} />
    </Avatar>
    <Box>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="h5" fontWeight={700}>{value}</Typography>
    </Box>
  </Stack>
</Card>
```

### Search Input

```tsx
<TextField
  placeholder="Tìm tên, số điện thoại..."
  size="small"
  InputProps={{
    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
  }}
  sx={{ width: 280, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
/>
```

### Bottom CTA Button (Sidebar)

| Property | Value |
|----------|-------|
| Width | `100%` of sidebar padding |
| Background | `primary.main` |
| Text | white, **600** |
| Border radius | `8px` |
| Position | Fixed bottom of sidebar |
| Padding | `10px 16px` |

---

## 7. Spacing System

Dùng **8px grid** — tất cả spacing là bội số của 8:

| Token | Value | Dùng cho |
|-------|-------|----------|
| `xs` | `4px` | Icon-text gap trong chip, tight spacing |
| `sm` | `8px` | Action icons gap, inline elements |
| `md` | `16px` | Card gap, section padding, nav item padding |
| `lg` | `24px` | Page padding top/bottom, section gap |
| `xl` | `32px` | Page padding left/right, major sections |

---

## 8. Border Radius

| Element | Radius |
|---------|--------|
| Buttons | `8px` |
| Cards | `12px` |
| Chips/Badges | `12px` (pill) |
| Avatar | `50%` (circle) |
| Table container | `8px` |
| Search input | `8px` |
| Pagination active | `50%` (circle) |
| Modal/Dialog | `12px` |

---

## 9. Shadows & Elevation

| Level | Shadow | Dùng cho |
|-------|--------|----------|
| 0 | none | Flat elements, table rows |
| 1 | `0 1px 3px rgba(0,0,0,0.08)` | Cards, stat cards |
| 2 | `0 4px 12px rgba(0,0,0,0.1)` | Dropdowns, popovers |
| 3 | `0 8px 24px rgba(0,0,0,0.12)` | Modals, dialogs |

> **Nguyên tắc**: Ít shadow — design sạch, dựa vào border + background thay vì shadow.

---

## 10. Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| `xs` | `0-599px` | **Mobile**: No sidebar → BottomNavigation, single column |
| `sm` | `600-899px` | **Tablet**: Collapsible sidebar (icon-only), 2-col stats |
| `md` | `900-1199px` | **Desktop small**: Full sidebar, 3-col stats, table |
| `lg` | `1200-1535px` | **Desktop**: Full layout as screenshot |
| `xl` | `1536px+` | **Wide**: Max-width content, centered |

### Desktop → Mobile Mapping

| Desktop | → Mobile |
|---------|----------|
| Sidebar 240px | BottomNavigation 4 tabs |
| Page title H1 24px | Title 18px + icon buttons right |
| Search text field 280px | Icon button 🔍 (expand on tap) |
| Stats row 3 cards inline | Horizontal scroll (overflow-x) |
| Data table rows | Card list (mỗi member = 1 card) |
| Edit/Delete icon buttons | Kebab menu ⋮ (3 dots) |
| "Thêm Thành Viên" sidebar CTA | Inline button trong sub-header |
| Pagination bottom-right | Centered pagination |

---

## 11. Mobile Layout Structure (xs: 0-599px)

> **REFERENCE**: Dựa trên mobile screenshot thực tế. Đây là PRIMARY layout — thiết kế mobile TRƯỚC, desktop SAU.

```
┌──────────────────────────────┐
│  Thành viên          🔍  🔔  │  ← App Bar
├──────────────────────────────┤
│  128 thành viên    [+ Thêm]  │  ← Sub-header
├──────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌──  │  ← Stats (horizontal scroll)
│  │TỔNG CỘNG│ │CỐ ĐỊNH │ │T  │
│  │  128   │ │   42   │ │   │
│  └────────┘ └────────┘ └──  │
├──────────────────────────────┤
│  ┌──────────────────────────┐│
│  │ (NH) Nguyễn Văn Hùng   ⋮││  ← Member Card
│  │  CỐ ĐỊNH                 ││
│  │ 📞 0908 123 456  500.000 ││
│  └──────────────────────────┘│
│  ┌──────────────────────────┐│
│  │ (TA) Trần Tuấn Anh     ⋮││
│  │  VÃNG LAI                 ││
│  │ 📞 0912 345 678  150.000 ││
│  └──────────────────────────┘│
│  ...                         │
│                              │
│  Hiển thị 4 trên 128        │
│       < (1) 2  3 >          │  ← Pagination centered
├──────────────────────────────┤
│ 🏠    👥     📅     🏆     │  ← Bottom Navigation
│Tổng  Thành  Lịch   Xếp     │
│quan  viên   tập    hạng     │
└──────────────────────────────┘
```

### 11.1 Mobile App Bar

```
[Page Title]                          [🔍] [🔔]
```

| Property | Value |
|----------|-------|
| Height | `56px` |
| Background | `#FFFFFF` |
| Padding | `0 16px` |
| Title | `18px`, **700**, `text.primary`, align left |
| Icons right | `24px`, `text.secondary`, gap `8px` |
| Border bottom | `1px solid #F0F0F0` (subtle) |
| Position | `sticky top: 0`, `z-index: appBar` |

> **Không có**: hamburger menu, sidebar toggle, logo. Title = page name.

### 11.2 Mobile Sub-header

```
[Count text]                    [+ Thêm mới]
```

| Property | Value |
|----------|-------|
| Height | `48px` |
| Padding | `8px 16px` |
| Layout | `flex`, `justify-content: space-between`, `align-items: center` |
| Count text | `14px`, `text.secondary` ("128 thành viên") |
| Button | Small primary, `height: 32px`, `border-radius: 16px` (pill), icon `+` left |
| Button font | `13px`, **600** |

### 11.3 Mobile Stats Cards (Horizontal Scroll)

```
┌──────────┐ ┌──────────┐ ┌──────────┐
│ 👥        │ │ ✅        │ │ 💰        │   ← overflow-x: auto
│ TỔNG CỘNG │ │ CỐ ĐỊNH  │ │ TỔNG DƯ  │
│ 128       │ │ 42       │ │ 12.5M    │
└──────────┘ └──────────┘ └──────────┘
```

| Property | Value |
|----------|-------|
| Container | `overflow-x: auto`, `scroll-snap-type: x mandatory`, `-webkit-overflow-scrolling: touch` |
| Padding container | `0 16px`, `gap: 12px` |
| Card min-width | `140px` |
| Card height | `80px` |
| Card padding | `12px` |
| Card border | `1px solid #EEEEEE`, `border-radius: 12px` |
| Scroll snap | `scroll-snap-align: start` per card |
| Icon | `32px` circle, colored background |
| Label | `11px`, **600**, `text.secondary`, `text-transform: uppercase` |
| Number | `22px`, **700**, `text.primary` |
| No scrollbar | `::-webkit-scrollbar { display: none }` |

### 11.4 Mobile Member Card

```
┌──────────────────────────────────┐
│  (NH)  Nguyễn Văn Hùng        ⋮ │  ← Row 1: Avatar + Name + Kebab
│        CỐ ĐỊNH                   │  ← Row 2: Badge chip
│  📞 0908 123 456    SỐ DƯ       │  ← Row 3: Phone + Balance label
│                     500.000 VNĐ  │  ← Row 3: Balance amount
└──────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Card margin | `0 16px 12px 16px` |
| Card padding | `16px` |
| Card border | `1px solid #EEEEEE` |
| Card border-radius | `12px` |
| Card background | `#FFFFFF` |
| Card shadow | `0 1px 3px rgba(0,0,0,0.06)` |

#### Row 1: Name Row

| Element | Spec |
|---------|------|
| Layout | `flex`, `align-items: center` |
| Avatar | `40px` circle, initials, `margin-right: 12px` |
| Name | `15px`, **600**, `text.primary`, `flex: 1` |
| Kebab icon ⋮ | `24px`, `text.secondary`, touch area `40px` |

#### Row 2: Badge

| Element | Spec |
|---------|------|
| Position | Below name, `margin-top: 6px`, `margin-left: 52px` (aligned with name, past avatar) |
| Chip | Same as desktop chips: pill `12px` text |
| "CỐ ĐỊNH" | Green chip (`#E8F5E9` bg, `#2E7D32` text) |
| "VÃNG LAI" | Gray chip (`#F5F5F5` bg, `#757575` text, border) |

#### Row 3: Phone + Balance

| Element | Spec |
|---------|------|
| Layout | `flex`, `justify-content: space-between`, `margin-top: 12px` |
| Phone icon | `📞` hoặc `PhoneIcon`, `16px`, `text.secondary` |
| Phone text | `13px`, `text.secondary`, `margin-left: 4px` |
| Balance label | `"SỐ DƯ"`, `11px`, `text.secondary`, align right |
| Balance amount | `15px`, **700**, `text.money` (#2E7D32), align right |
| VNĐ | Same line as amount, `13px` |

#### Kebab Menu (⋮) — khi tap

| Property | Value |
|----------|-------|
| Type | MUI `Menu` anchored to kebab icon |
| Items | "Chỉnh sửa" (edit icon), "Xóa" (delete icon, `color: error`) |
| Item height | `48px` (touch-friendly) |
| Item padding | `12px 16px` |
| Border radius | `8px` |

### 11.5 Mobile Pagination

| Property | Value |
|----------|-------|
| Layout | Centered, stacked |
| Info text | `"Hiển thị 4 trên 128 thành viên"`, `13px`, `text.secondary`, centered |
| Page row | Centered: `< (1) 2 3 >` |
| Active page | `28px` circle, `primary.main` bg, white text |
| Inactive page | `28px` circle, transparent, `text.primary` |
| Arrows | `<` `>`, `text.secondary`, disabled at boundary |
| Margin | `16px 0` |
| Touch targets | All page buttons ≥ `40px` tap area |

### 11.6 Mobile Bottom Navigation

```
┌──────┬──────┬──────┬──────┐
│  🏠  │  👥  │  📅  │  🏆  │
│Tổng  │Thành │Lịch  │Xếp   │
│quan  │viên  │tập   │hạng  │
└──────┴──────┴──────┴──────┘
```

| Property | Value |
|----------|-------|
| Component | MUI `BottomNavigation` |
| Height | `56px` + `env(safe-area-inset-bottom)` |
| Background | `#FFFFFF` |
| Border top | `1px solid #E0E0E0` |
| Position | `fixed bottom: 0`, `width: 100%`, `z-index: bottomNav` |
| Tabs | **4 tabs** (Cài đặt nằm trong profile/settings drawer) |
| Active tab | Icon + label `primary.main` (#2E7D32), **600** |
| Inactive tab | Icon + label `text.secondary` (#757575), 400 |
| Icon size | `24px` |
| Label size | `11px` |
| Ripple | MUI default ripple on tap |

| # | Icon | Label | Route |
|---|------|-------|-------|
| 1 | 🏠 HomeOutlined | Tổng quan | `/dashboard` |
| 2 | 👥 PeopleOutlined | Thành viên | `/members` |
| 3 | 📅 CalendarOutlined | Lịch tập | `/schedule` |
| 4 | 🏆 LeaderboardOutlined | Xếp hạng | `/rankings` |

> **Cài đặt**: Truy cập qua icon ⚙️ trong App Bar hoặc trong Profile page. KHÔNG chiếm slot BottomNav.

### 11.7 Mobile Page Content Area

| Property | Value |
|----------|-------|
| Padding top | `56px` (app bar height) |
| Padding bottom | `72px` (bottom nav + safe area) |
| Padding horizontal | `0` (cards tự có margin 16px) |
| Background | `#F8F9FA` (light gray, tách biệt cards) |
| Scroll | `overflow-y: auto`, native momentum scroll |

> **Mobile background khác Desktop**: Mobile dùng `#F8F9FA` (gray) để tạo contrast với white cards. Desktop dùng `#FFFFFF` vì đã có table borders.

### 11.8 Mobile Search (khi tap 🔍)

| Property | Value |
|----------|-------|
| Behavior | Tap 🔍 → expand full-width search bar thay thế App Bar |
| Height | `56px` (same as app bar) |
| Input | Auto-focus, full width, `16px` font (tránh iOS zoom) |
| Left icon | 🔍 search |
| Right icon | ✕ close (thu lại search bar) |
| Background | `#FFFFFF` |
| Placeholder | "Tìm tên, số điện thoại..." |
| Results | Filter real-time trên danh sách bên dưới |

---

## 12. Interaction States

| State | Visual |
|-------|--------|
| **Default** | Base colors as defined |
| **Hover** | Background lighten/darken, cursor pointer |
| **Active/Pressed** | Background darken thêm, slight scale `0.98` |
| **Focus** | `2px` outline `primary.main` offset `2px` (accessibility) |
| **Disabled** | `opacity: 0.5`, no pointer events |
| **Loading** | Skeleton placeholder hoặc CircularProgress |

---

## 13. Iconography

- **Icon set**: Material Icons (MUI default) — outlined variant
- **Size**: `20px` nav icons, `20px` action icons, `24px` stat card icons
- **Color**: Inherit from parent text color
- **KHÔNG dùng**: emoji trong UI production (chỉ dùng trong docs/rules)

---

## 14. KHÔNG Làm (Anti-patterns)

- ❌ KHÔNG dùng nhiều hơn 2 font families
- ❌ KHÔNG dùng shadow nặng (depth > level 2 cho cards)
- ❌ KHÔNG dùng gradient cho buttons hoặc backgrounds
- ❌ KHÔNG dùng rounded corners > 16px (quá tròn)
- ❌ KHÔNG dùng màu ngoài palette đã define
- ❌ KHÔNG mix icon sets (chỉ Material Icons)
- ❌ KHÔNG dùng text ALL CAPS cho content (chỉ cho table headers)
- ❌ KHÔNG dùng sidebar trên mobile (chuyển sang BottomNavigation)
- ❌ KHÔNG format tiền khác format `xxx.xxx VNĐ`
- ❌ KHÔNG hiển thị số điện thoại raw (phải format `0xxx xxx xxx`)
