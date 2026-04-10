/** Format a number as Vietnamese currency, e.g. 450000 → "450.000 VNĐ" */
export function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN').replace(/,/g, '.') + ' VNĐ';
}

/** Format phone number: 0908123456 → "0908 123 456" */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return phone;
}

/** Format date: "2026-04-10" → "Thứ 6, 10/04/2026" */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const day = days[date.getDay()];
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${day}, ${dd}/${mm}/${yyyy}`;
}

/** Format relative time: "10 phút trước", "2 giờ trước", "hôm qua" */
export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return 'hôm qua';
  return `${diffDay} ngày trước`;
}

/** Split cost calculation: ROUND_DOWN(total/n, roundingUnit) */
export function calcPerPerson(total: number, n: number, roundingUnit = 1000): number {
  if (n === 0) return 0;
  return Math.floor(total / n / roundingUnit) * roundingUnit;
}

/** Get initials from a Vietnamese name, e.g. "Nguyễn Văn Hùng" → "NH" */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/** Hash-based pastel color from a string */
export function getAvatarColor(name: string): string {
  const colors = [
    '#E8F5E9', '#E3F2FD', '#FFF3E0', '#F3E5F5',
    '#E0F7FA', '#FCE4EC', '#F9FBE7', '#EDE7F6',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/** Corresponding text color for each pastel background */
export function getAvatarTextColor(name: string): string {
  const colors = [
    '#2E7D32', '#1565C0', '#E65100', '#6A1B9A',
    '#006064', '#880E4F', '#558B2F', '#4527A0',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
