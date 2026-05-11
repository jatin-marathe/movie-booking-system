import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import Sidebar from '../Sidebar/index';
import '../../../styles/admin.scss';

// Protects all admin pages — redirects to login if not authenticated
export function AdminLayout() {
    const { isAdmin, loading } = useAdminAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: '#080b12',
                color: '#94a3b8',
                fontSize: '0.9rem',
                fontFamily: 'DM Sans, sans-serif'
            }}>
                Loading...
            </div>
        );
    }

    if (!isAdmin) return <Navigate to="/admin/login" replace />;

    return (
        <div className="admin-layout">
            <Sidebar />
            <main className="admin-main">
                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

// Redirects already-logged-in admins away from the login page
export function AdminPublicRoute() {
    const { isAdmin, loading } = useAdminAuth();
    if (loading) return null;
    if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
    return <Outlet />;
}