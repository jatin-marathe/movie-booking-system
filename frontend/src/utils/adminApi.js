import axios from 'axios';

const adminApi = axios.create({
    baseURL: '/api/admin',
    headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('cb_admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

adminApi.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('cb_admin_token');
            localStorage.removeItem('cb_admin');
            window.location.href = '/admin/login';
        }
        return Promise.reject(err);
    }
);

export default adminApi;
