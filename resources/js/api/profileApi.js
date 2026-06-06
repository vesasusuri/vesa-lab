import axios from 'axios';

export function getCandidateProfile() {
  return axios.get('/api/candidate/profile').then((r) => r.data);
}

export function saveCandidateProfile(payload) {
  return axios.put('/api/candidate/profile', payload).then((r) => r.data);
}

export function clearCandidateProfile() {
  return axios.delete('/api/candidate/profile').then((r) => r.data);
}

export function uploadCandidateAvatar(file) {
  const formData = new FormData();
  formData.append('avatar', file);

  return axios
    .post('/api/candidate/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);
}
