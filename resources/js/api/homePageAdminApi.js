import axios from 'axios';

const URL_GET = '/api/home-page-content';
const URL_PUT_CONTENT = '/api/admin/home-page-content';
const URL_PUT_SECTIONS = '/api/admin/home-page-sections';
const URL_UPLOAD = '/api/admin/home-page-sections/upload-image';

export function getHomePagePayload() {
  return axios.get(URL_GET).then((r) => r.data);
}

export function putHomePageContent(body, pageKey = 'home') {
  return axios.put(URL_PUT_CONTENT, { ...body, _pageKey: pageKey }).then((r) => r.data);
}

export function putHomePageSections(sections) {
  return axios.put(URL_PUT_SECTIONS, { sections }).then((r) => r.data);
}

export function uploadHomeSectionImage(file, sectionKey) {
  const formData = new FormData();
  formData.append('image', file);
  if (sectionKey) formData.append('sectionKey', sectionKey);
  return axios
    .post(URL_UPLOAD, formData, { headers: { Accept: 'application/json' } })
    .then((r) => r.data?.imageUrl ?? null);
}

export function postSectionItem(sectionKey, payload) {
  return axios
    .post(`/api/admin/home-page-sections/${encodeURIComponent(sectionKey)}/items`, payload)
    .then((r) => r.data);
}

export function putSectionItem(itemId, payload) {
  return axios.put(`/api/admin/home-page-section-items/${itemId}`, payload).then((r) => r.data);
}

export function deleteSectionItem(itemId) {
  return axios.delete(`/api/admin/home-page-section-items/${itemId}`);
}
