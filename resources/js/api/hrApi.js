import axios from 'axios';

export function fetchHrApplications() {
    return axios.get('/api/hr/applications').then((r) => r.data.applications);
}

export function updateHrApplicationStatus(id, status) {
    return axios.put(`/api/hr/applications/${id}`, { status }).then((r) => r.data);
}

export function fetchJobApplicants(jobListingId) {
    return axios.get(`/api/hr/job-listings/${jobListingId}/applicants`).then((r) => r.data);
}

export function fetchCandidateProfile(userId) {
    return axios.get(`/api/hr/candidates/${userId}`).then((r) => r.data);
}

export async function downloadCandidateResume(userId, filename = 'resume.pdf') {
    const response = await axios.get(`/api/hr/candidates/${userId}/resume/download`, {
        responseType: 'blob',
    });

    const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/octet-stream',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}

export function fetchMyApplications() {
    return axios.get('/api/candidate/applications').then((r) => r.data.applications);
}

export function fetchHrOverviewStats() {
    return axios.get('/api/hr/overview-stats').then((r) => r.data.stats);
}

export function fetchHrAnalytics() {
    return axios.get('/api/hr/analytics').then((r) => r.data);
}

export function fetchHrHires() {
    return axios.get('/api/hr/hires').then((r) => r.data.hires);
}

export function fetchHrTeam() {
    return axios.get('/api/hr/team').then((r) => r.data);
}

export function addHrTeamMember(formData) {
    return axios.post('/api/hr/team', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
}

export function removeHrTeamMember(id) {
    return axios.delete(`/api/hr/team/${id}`).then((r) => r.data);
}

export function fetchHrTeamNotes() {
    return axios.get('/api/hr/team/notes').then((r) => r.data);
}

export function createHrTeamNote(payload) {
    return axios.post('/api/hr/team/notes', payload).then((r) => r.data);
}

export function updateHrTeamNote(id, payload) {
    return axios.put(`/api/hr/team/notes/${id}`, payload).then((r) => r.data);
}

export function deleteHrTeamNote(id) {
    return axios.delete(`/api/hr/team/notes/${id}`).then((r) => r.data);
}

export function fetchHrSettings() {
    return axios.get('/api/hr/settings').then((r) => r.data);
}

export function saveHrSettings(data) {
    return axios.put('/api/hr/settings', data).then((r) => r.data);
}

export function saveHrAccount(data) {
    return axios.put('/api/hr/account', data).then((r) => r.data);
}

export function saveHrNotifications(notifications) {
    return axios.put('/api/hr/notifications', { notifications }).then((r) => r.data);
}
