import axios from 'axios';

export const MESSAGES_POLL_MS = 4000;

export function listConversations() {
    return axios.get('/api/conversations').then((response) => response.data);
}

export function listMessageableCandidates() {
    return axios.get('/api/conversations/messageable-candidates').then((response) => response.data);
}

export function startConversation(payload) {
    return axios.post('/api/conversations', payload).then((response) => response.data);
}

export function listMessages(conversationId) {
    return axios.get(`/api/conversations/${conversationId}/messages`).then((response) => response.data);
}

export function sendMessage(conversationId, body) {
    return axios.post(`/api/conversations/${conversationId}/messages`, { body }).then((response) => response.data);
}
