export const INTERVIEW_STATUSES = ['scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled'];

export const formatInterviewDate = (isoString) => {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const formatStatusLabel = (status) => {
  if (!status) return '';
  return status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

export const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || '').join('');
};

export const typeLabel = (type) => {
  if (type === 'in_person') return 'In-person';
  if (type === 'phone') return 'Phone';
  return 'Video';
};
