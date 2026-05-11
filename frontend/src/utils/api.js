import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL) {
    console.error("VITE_API_URL is missing!");
}
const api = axios.create({
    baseURL: `${baseURL?.replace(/\/$/, '')}/api`,
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('cb_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Handle 401 globally
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('cb_token');
            localStorage.removeItem('cb_user');
            window.location.href = '/sign-in';
        }
        return Promise.reject(err);
    }
);

export default api;
