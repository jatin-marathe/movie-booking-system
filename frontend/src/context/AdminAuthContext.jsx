import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import adminApi from '../utils/adminApi';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
    const [admin, setAdmin] = useState(() => {
        try { return JSON.parse(localStorage.getItem('cb_admin')); } catch { return null; }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('cb_admin_token');
        if (!token) { setLoading(false); return; }
        adminApi.get('/auth/me')
            .then(({ data }) => setAdmin(data.admin))
            .catch(() => {
                localStorage.removeItem('cb_admin_token');
                localStorage.removeItem('cb_admin');
                setAdmin(null);
            })
            .finally(() => setLoading(false));
    }, []);

    const login = useCallback(async (email, password) => {
        const { data } = await adminApi.post('/auth/login', { email, password });
        localStorage.setItem('cb_admin_token', data.token);
        localStorage.setItem('cb_admin', JSON.stringify(data.admin));
        setAdmin(data.admin);
        return data.admin;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('cb_admin_token');
        localStorage.removeItem('cb_admin');
        setAdmin(null);
    }, []);

    return (
        <AdminAuthContext.Provider value={{ admin, loading, login, logout, isAdmin: !!admin }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export const useAdminAuth = () => {
    const ctx = useContext(AdminAuthContext);
    if (!ctx) throw new Error('useAdminAuth must be inside AdminAuthProvider');
    return ctx;
};
