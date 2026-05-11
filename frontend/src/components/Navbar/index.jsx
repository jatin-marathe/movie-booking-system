import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.scss';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">🎬</span>
          <span className="navbar__logo-text">CINEMA<span className="accent">BOOK</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar__links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Movies</Link>
          {isLoggedIn && (
            <Link to="/my-ticket" className={location.pathname === '/my-ticket' ? 'active' : ''}>
              My Tickets
            </Link>
          )}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="navbar__actions">
          {isLoggedIn ? (
            <>
              <span className="navbar__user">
                <span className="navbar__avatar">{user?.name?.[0]?.toUpperCase()}</span>
                {user?.name?.split(' ')[0]}
              </span>
              <button className="btn-outline navbar__btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn-ghost navbar__btn" onClick={() => navigate('/sign-in')}>Login</button>
              <button className="btn-primary navbar__btn" onClick={() => navigate('/sign-up')}>Register</button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button className={`navbar__hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(p => !p)}>
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${menuOpen ? 'open' : ''}`}>
        <Link to="/">Movies</Link>
        {isLoggedIn && <Link to="/my-ticket">My Tickets</Link>}
        <div className="navbar__mobile-auth">
          {isLoggedIn ? (
            <button className="btn-outline" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <button className="btn-ghost" onClick={() => navigate('/sign-in')}>Login</button>
              <button className="btn-primary" onClick={() => navigate('/sign-up')}>Register</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
