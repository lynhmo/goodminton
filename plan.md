# Plan: Thêm chỉnh sửa số cầu đã dùng ở SessionDetailPage (pending)

## Bối cảnh

- `SessionDetailPage.tsx` hiển thị chi tiết buổi tập
- Khi `status === 'pending'` → buổi tập chưa xử lý, cần cho phép chỉnh sửa số cầu
- Session type đã có: `shuttlecockQty`, `shuttlecockPrice`, `shuttlecockCost`
- `calcPerPerson()` đã có sẵn trong `utils/format.ts`
- Mock session `s3` (pending) có `shuttlecockQty: 0` → cần chỉnh sửa

## Thay đổi

### File: `src/features/sessions/SessionDetailPage.tsx`

1. **Thêm state local** cho `shuttlecockQty` (khởi tạo từ `session.shuttlecockQty`)
2. **Thêm import**: `useState` từ React, `TextField`, `InputAdornment`, `IconButton` từ MUI, `Edit`/`Check` icons, `calcPerPerson` từ utils
3. **Khu vực "Số quả cầu"**: Khi `status === 'pending'` → render inline editable field:
   - Hiện giá trị + icon edit bên cạnh
   - Tap edit → chuyển sang TextField type number (min 0)
   - Có nút +/- cho nhanh (touch-friendly, ≥48px)
   - Confirm → cập nhật state, tính lại shuttlecockCost/totalCost/perPerson/remainder
4. **Auto-recalculate**: Khi shuttlecockQty thay đổi:
   - `shuttlecockCost = qty × session.shuttlecockPrice`
   - `totalCost = session.courtFee + shuttlecockCost`
   - `perPerson = calcPerPerson(totalCost, session.attendeeCount, 1000)`
   - `remainder = totalCost - perPerson × attendeeCount`
5. **Hiển thị giá trị mới** ở các stats (Tiền cầu, Tổng chi phí, Mỗi người) dùng computed values thay vì session gốc
6. **Chỉ khi pending** — Settled/draft không cho sửa

### UX/Mobile:
- Nút +/- kích thước ≥ 48px, dễ bấm 1 tay tại sân
- TextField font-size ≥ 1rem (tránh iOS zoom)
- Inline editing ngay trong card thông tin, không cần popup/dialog
