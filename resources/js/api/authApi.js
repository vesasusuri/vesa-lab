import axios from 'axios';

const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRES_AT_KEY = 'auth_token_expires_at';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const REFRESH_BUFFER_MS = 5000;

let refreshTimer = null;
let refreshPromise = null;
let refreshQueue = [];

function resolveExpiry(data) {
    if (data.expires_at) {
        const timestamp = Date.parse(data.expires_at);
        if (!Number.isNaN(timestamp)) {
            return timestamp;
        }
    }

    if (data.expires_in) {
        return Date.now() + (Number(data.expires_in) * 1000);
    }

    return Date.now() + (60 * 1000);
}

export function getRawToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function isTokenExpired() {
    const expiresAt = Number(localStorage.getItem(TOKEN_EXPIRES_AT_KEY) || 0);
    return Boolean(expiresAt && Date.now() >= expiresAt);
}

export function getToken() {
    const token = getRawToken();

    if (!token || isTokenExpired()) {
        return null;
    }

    return token;
}

function clearRefreshTimer() {
    if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
    }
}

function processRefreshQueue(error, token = null) {
    refreshQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    refreshQueue = [];
}

function scheduleTokenRefresh(data) {
    clearRefreshTimer();

    if (!getRawToken()) {
        return;
    }

    const expiresAt = resolveExpiry(data);
    const refreshAt = Math.max(expiresAt - REFRESH_BUFFER_MS, Date.now() + 1000);
    const delay = refreshAt - Date.now();

    refreshTimer = setTimeout(() => {
        refreshToken().catch(() => removeToken());
    }, delay);
}

function setToken(data) {
    const token = data.token;

    if (!token) {
        removeToken();
        return;
    }

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRES_AT_KEY, String(resolveExpiry(data)));
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    if (data.refresh_token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
    }

    scheduleTokenRefresh(data);
}

function removeToken() {
    clearRefreshTimer();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    delete axios.defaults.headers.common.Authorization;

    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:token-cleared'));
    }
}

function shouldAttemptRefresh(config) {
    const url = config?.url || '';

    return !url.includes('/auth/login')
        && !url.includes('/auth/register')
        && !url.includes('/auth/refresh');
}

export function refreshToken() {
    const raw = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!raw) {
        return Promise.reject(new Error('No refresh token'));
    }

    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = axios.post('/auth/refresh', { refresh_token: raw }).then((res) => {
        setToken(res.data);
        return res.data;
    }).finally(() => {
        refreshPromise = null;
    });

    return refreshPromise;
}

const stored = getRawToken();
if (stored && !isTokenExpired()) {
    axios.defaults.headers.common.Authorization = `Bearer ${stored}`;
    const expiresAt = Number(localStorage.getItem(TOKEN_EXPIRES_AT_KEY) || 0);
    if (expiresAt) {
        scheduleTokenRefresh({ expires_at: new Date(expiresAt).toISOString() });
    }
}

axios.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response } = error;

        if (response?.status !== 401 || !config || config._retry || !shouldAttemptRefresh(config)) {
            if (response?.status === 401 && shouldAttemptRefresh(config)) {
                removeToken();
            }

            return Promise.reject(error);
        }

        const rawToken = getRawToken();

        if (!rawToken) {
            removeToken();
            return Promise.reject(error);
        }

        if (refreshPromise) {
            return new Promise((resolve, reject) => {
                refreshQueue.push({ resolve, reject });
            }).then((token) => {
                config.headers.Authorization = `Bearer ${token}`;
                config._retry = true;
                return axios(config);
            });
        }

        config._retry = true;

        try {
            const data = await refreshToken();
            processRefreshQueue(null, data.token);
            config.headers.Authorization = `Bearer ${data.token}`;
            return axios(config);
        } catch (refreshError) {
            processRefreshQueue(refreshError, null);
            removeToken();
            return Promise.reject(refreshError);
        }
    },
);

export function register(payload) {
    return axios.post('/auth/register', payload).then((res) => {
        setToken(res.data);
        return res.data;
    });
}

export function login(payload) {
    return axios.post('/auth/login', payload).then((res) => {
        
        if (!res.data.first_login) {
            setToken(res.data);
        }
        return res.data;
    });
}

export function sendFirstLoginCode(payload) {
    return axios.post('/auth/first-login/send-code', payload).then((r) => r.data);
}

export function verifyFirstLoginCode(payload) {
    return axios.post('/auth/first-login/verify-code', payload).then((r) => r.data);
}

export function resendFirstLoginCode(payload) {
    return axios.post('/auth/first-login/resend-code', payload).then((r) => r.data);
}

export function setFirstLoginPassword(payload) {
    return axios.post('/auth/first-login/set-password', payload).then((r) => {
        setToken(r.data);
        return r.data;
    });
}

export function logout() {
    return axios.post('/auth/logout')
        .then((res) => res.data)
        .finally(() => removeToken());
}

export async function bootstrapAuth() {
    const rawToken     = getRawToken();
    const rawRefresh   = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!rawToken && !rawRefresh) {
        return null;
    }

    if (!rawToken || isTokenExpired()) {
        try {
            await refreshToken();
        } catch {
            removeToken();
            return null;
        }
    }

    return getCurrentUser();
}

export function getCurrentUser() {
    if (!getToken()) {
        return Promise.reject(new Error('No token'));
    }

    return axios.get('/auth/user').then((res) => res.data);
}
