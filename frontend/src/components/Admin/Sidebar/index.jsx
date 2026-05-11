import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import './Sidebar.scss';

const NAV = [
    { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/admin/movies', icon: '🎬', label: 'Movies' },
    { to: '/admin/bookings', icon: '🎟', label: 'Bookings' },
    { to: '/admin/users', icon: '👥', label: 'Users' },
];

export default function Sidebar() {
    const { admin, logout } = useAdminAuth();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/admin/login'); };

    return (
        <aside className="sidebar">
            {/* Brand */}
            <div className="sidebar__brand">
                <span className="sidebar__brand-icon">🎬</span>
                <div>
                    <p className="sidebar__brand-name">CINEMABOOK</p>
                    <p className="sidebar__brand-sub">Admin Panel</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="sidebar__nav">
                {NAV.map(({ to, icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}
                    >
                        <span className="sidebar__link-icon">{icon}</span>
                        <span className="sidebar__link-label">{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Admin info + logout */}
            <div className="sidebar__footer">
                <div className="sidebar__admin">
                    <div className="sidebar__admin-avatar">{admin?.name?.[0]?.toUpperCase()}</div>
                    <div className="sidebar__admin-info">
                        <p className="sidebar__admin-name">{admin?.name}</p>
                        <p className="sidebar__admin-role">{admin?.role}</p>
                    </div>
                </div>
                <button className="sidebar__logout" onClick={handleLogout}>⏻ Logout</button>
            </div>
        </aside>
    );
}