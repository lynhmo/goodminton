---
name: design-system
description: Generate & audit visual systems within codebases — design tokens, visual consistency scoring, and AI slop detection.
origin: ECC
---

# Design System — Generate & Audit Visual Systems

## When to Use

- Khởi tạo dự án mới cần design system
- Kiểm tra visual consistency của codebase hiện tại
- Trước khi redesign — hiểu rõ hiện trạng
- Khi UI trông "sai sai" nhưng không biết cụ thể chỗ nào
- Review PR liên quan đến styling

## How It Works

### Mode 1: Generate Design System

Phân tích codebase và tạo design system:

```
1. Scan CSS/MUI theme/styled-components để tìm patterns
2. Extract: colors, typography, spacing, border-radius, shadows, breakpoints
3. Nghiên cứu 3 competitor sites để lấy cảm hứng
4. Đề xuất design token set (JSON + CSS custom properties)
5. Tạo DESIGN.md với rationale cho từng quyết định
6. Tạo interactive HTML preview page
```

Output: `DESIGN.md` + `design-tokens.json` + `design-preview.html`

### Mode 2: Visual Audit

Chấm điểm UI trên 10 tiêu chí (0-10 mỗi tiêu chí):

```
1. Color consistency — dùng palette hay random hex values?
2. Typography hierarchy — rõ ràng h1 > h2 > h3 > body > caption?
3. Spacing rhythm — consistent scale (4px/8px/16px) hay tùy ý?
4. Component consistency — các element tương tự trông giống nhau?
5. Responsive behavior — smooth hay broken ở breakpoints?
6. Dark mode — hoàn chỉnh hay nửa vời?
7. Animation — có mục đích hay thừa thãi?
8. Accessibility — contrast ratios, focus states, touch targets
9. Information density — chật chội hay gọn gàng?
10. Polish — hover states, transitions, loading states, empty states
```

Mỗi tiêu chí có điểm, ví dụ cụ thể, và cách fix kèm file:line.

### Mode 3: AI Slop Detection

Phát hiện các pattern thiết kế AI-generated generic:

```
- Gradient tràn lan không cần thiết
- Purple-to-blue defaults
- "Glass morphism" cards vô nghĩa
- Bo tròn quá mức
- Animation cuộn trang thừa
- Hero section generic với gradient stock
- Font stack sans-serif không cá tính
```

## Badminton App Specific Audit Points

- Court status indicators rõ ràng (available/occupied/maintenance)
- Booking calendar/timeline dễ đọc
- Score display layout phù hợp với badminton (21 điểm, 3 set)
- Player cards hiển thị skill level trực quan
- Tournament bracket visualization rõ ràng
- Mobile-first cho người dùng tại sân

## Checklist

- [ ] Design tokens xuất ra JSON + MUI theme
- [ ] Color palette có primary, secondary, và semantic colors
- [ ] Typography scale consistent (h1-h6, body1-2, caption)
- [ ] Spacing grid 8px base
- [ ] Component library phù hợp với domain (badminton)
- [ ] Visual audit score ≥ 7/10 trên tất cả tiêu chí
- [ ] Không có AI slop patterns
