import axios from 'axios';

export function getResume() {
  return axios.get('/api/resume').then((r) => r.data);
}

export function uploadResume(file) {
  const formData = new FormData();
  formData.append('resume', file);

  return axios
    .post('/api/resume/upload', formData, {
      headers: { Accept: 'application/json' },
      timeout: 300000,
    })
    .then((r) => r.data);
}

export function analyzeResume(resumeId) {
  return axios
    .post(`/api/resume/${resumeId}/analyze`, null, { timeout: 300000 })
    .then((r) => r.data);
}

export function getAtsScore(resumeId) {
  return axios.get(`/api/resume/${resumeId}/ats`).then((r) => r.data);
}

export function getJobMatch(resumeId, jobListingId = null) {
  const params = jobListingId ? { job_listing_id: jobListingId } : {};

  return axios.get(`/api/resume/${resumeId}/job-match`, { params }).then((r) => r.data);
}

export function getCvProfile() {
  return axios.get('/api/cv/profile').then((r) => r.data);
}

export function saveCvProfile(payload) {
  return axios.put('/api/cv/profile', payload).then((r) => r.data);
}

export function getCvTemplates() {
  return axios.get('/api/cv/templates').then((r) => r.data);
}

export function exportCvPdf(templateSlug) {
  return axios.post(
    '/api/cv/export/pdf',
    { template: templateSlug },
    { responseType: 'blob' },
  );
}
