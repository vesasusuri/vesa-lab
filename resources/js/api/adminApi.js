import axios from 'axios';

export function fetchAdminStats() {
    return axios.get('/api/admin/stats').then((r) => r.data);
}

export function fetchHrUsers(params = {}) {
    return axios.get('/api/admin/hr-users', { params }).then((r) => r.data);
}

export function createHrUser(payload) {
    return axios.post('/api/admin/hr-users', payload).then((r) => r.data);
}

export function updateHrUser(id, payload) {
    return axios.put(`/api/admin/hr-users/${id}`, payload).then((r) => r.data);
}

export function deactivateHrUser(id) {
    return axios.post(`/api/admin/hr-users/${id}/deactivate`).then((r) => r.data);
}

export function reactivateHrUser(id) {
    return axios.post(`/api/admin/hr-users/${id}/reactivate`).then((r) => r.data);
}

export function resetHrUserPassword(id) {
    return axios.post(`/api/admin/hr-users/${id}/reset-password`).then((r) => r.data);
}

export function fetchActivityLogs(params = {}) {
    return axios.get('/api/admin/logs', { params }).then((r) => r.data);
}
