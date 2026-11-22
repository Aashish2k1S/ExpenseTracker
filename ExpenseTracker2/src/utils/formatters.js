export const formatINR = (value) => {
  const num = Number(value) || 0;
  const isWhole = Math.abs(num - Math.round(num)) < 0.001;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: isWhole ? 0 : 2,
  }).format(num);
};

export const formatMonthLabel = (monthKey) => {
  if (!monthKey || !monthKey.includes('-')) return 'November 2026';
  const [y, m] = monthKey.split('-').map(Number);
  const date = new Date(y, m - 1, 1);
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
};

export const shiftMonth = (monthKey, delta) => {
  const [y, m] = monthKey.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  const nextY = d.getFullYear();
  const nextM = String(d.getMonth() + 1).padStart(2, '0');
  return `${nextY}-${nextM}`;
};

export const getRemainingDaysInMonth = (monthKey) => {
  const [y, m] = monthKey.split('-').map(Number);
  const daysInMonth = new Date(y, m, 0).getDate();
  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  if (monthKey === currentKey) {
    return Math.max(1, daysInMonth - now.getDate() + 1);
  }
  return daysInMonth;
};

export const getDefaultDateTimeForMonth = (monthKey) => {
  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  if (monthKey === currentKey) {
    const dd = String(now.getDate()).padStart(2, '0');
    return `${monthKey}-${dd}T${hh}:${mm}`;
  }
  return `${monthKey}-01T10:00`;
};

export const formatDateHeader = (isoStr) => {
  const d = new Date(isoStr);
  if (Number.isNaN(d.getTime())) return isoStr;
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTimeOnly = (isoStr) => {
  const d = new Date(isoStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const generateId = () => `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
