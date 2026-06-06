import axios from 'axios';

export function fetchNotifications() {
  return axios.get('/api/notifications').then((r) => r.data.notifications ?? []);
}

export function fetchUnreadNotificationCount() {
  return axios.get('/api/notifications/unread-count').then((r) => r.data.unread_count ?? 0);
}

export function markNotificationRead(id) {
  return axios.post(`/api/notifications/${id}/read`).then((r) => r.data);
}

export function markAllNotificationsRead() {
  return axios.post('/api/notifications/read-all').then((r) => r.data);
}
