import axios from 'axios';

export function listInterviews(params = {}) {
  return axios.get('/api/interviews', { params }).then((r) => r.data);
}

export function listCandidates() {
  return axios.get('/api/interviews/candidates').then((r) => r.data);
}

export function createInterview(payload) {
  return axios.post('/api/interviews', payload).then((r) => r.data);
}

export function getInterview(id) {
  return axios.get(`/api/interviews/${id}`).then((r) => r.data);
}

export function updateInterview(id, payload) {
  return axios.put(`/api/interviews/${id}`, payload).then((r) => r.data);
}

export function deleteInterview(id) {
  return axios.delete(`/api/interviews/${id}`).then((r) => r.data);
}

export function getRoomAccess(token) {
  return axios.get(`/api/interviews/access/${encodeURIComponent(token)}`).then((r) => r.data);
}
