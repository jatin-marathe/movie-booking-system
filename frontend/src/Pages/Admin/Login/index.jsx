import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import toast from 'react-hot-toast';
import './AdminLogin.scss';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Fill in all fields'); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome, Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__bg">
        <div className="admin-login__glow" />
      </div>

      <div className="admin-login__card">
        <div className="admin-login__brand">
          <span>🎬</span>
          <div>
            <p className="admin-login__brand-name">CINEMABOOK</p>
            <p className="admin-login__brand-sub">Admin Portal</p>
          </div>
        </div>

        <h1 className="admin-login__title">Sign In</h1>
        <p className="admin-login__sub">Enter your admin credentials to continue</p>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="admin-form__field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="admin@cinemabook.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          <div className="admin-form__field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn-admin-primary admin-login__btn" disabled={loading}>
            {loading ? 'Signing in...' : '→ Sign In'}
          </button>
        </form>

        <p className="admin-login__hint">
          Default: <code>admin@cinemabook.com</code> / <code>admin123</code>
        </p>
      </div>
    </div>
  );
}
