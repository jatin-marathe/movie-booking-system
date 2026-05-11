import { useEffect, useState } from 'react';
import adminApi from '../../../utils/adminApi';
import './Dashboard.scss';

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__info">
        <p className="stat-card__value">{value}</p>
        <p className="stat-card__label">{label}</p>
        {sub && <p className="stat-card__sub">{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get('/stats')
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats;
  const topMovies = data?.topMovies || [];
  const dailyBookings = data?.dailyBookings || [];

  return (
    <div className="dashboard animate-in">
      <div className="admin-page-header">
        <div className="admin-page-header__left">
          <h1 className="admin-page-header__title">Dashboard</h1>
          <p className="admin-page-header__sub">Welcome back — here's what's happening</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="dashboard__stats">
        <StatCard icon="🎬" label="Total Movies"   value={loading ? '—' : stats?.totalMovies}   color="indigo" />
        <StatCard icon="🎟" label="Total Bookings" value={loading ? '—' : stats?.totalBookings} color="green"  sub="confirmed" />
        <StatCard icon="👥" label="Registered Users" value={loading ? '—' : stats?.totalUsers}  color="blue"  />
        <StatCard icon="💰" label="Total Revenue"  value={loading ? '—' : `₹${stats?.totalRevenue?.toLocaleString()}`} color="gold" />
      </div>

      <div className="dashboard__grid">
        {/* Top Movies */}
        <div className="admin-card">
          <p className="admin-card__title">🏆 Top Movies by Bookings</p>
          {loading ? (
            <p className="dashboard__loading">Loading...</p>
          ) : topMovies.length === 0 ? (
            <p className="dashboard__empty">No bookings yet</p>
          ) : (
            <div className="top-movies">
              {topMovies.map((item, i) => (
                <div key={item._id} className="top-movie-item">
                  <span className="top-movie-item__rank">#{i + 1}</span>
                  <img src={item.movie.image} alt={item.movie.title} className="top-movie-item__img" />
                  <div className="top-movie-item__info">
                    <p className="top-movie-item__title">{item.movie.title}</p>
                    <p className="top-movie-item__meta">{item.bookings} bookings · ₹{item.revenue?.toLocaleString()}</p>
                  </div>
                  <div className="top-movie-item__bar-wrap">
                    <div
                      className="top-movie-item__bar"
                      style={{ width: `${Math.min(100, (item.bookings / (topMovies[0]?.bookings || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="admin-card">
          <p className="admin-card__title">📈 Bookings — Last 7 Days</p>
          {loading ? (
            <p className="dashboard__loading">Loading...</p>
          ) : dailyBookings.length === 0 ? (
            <p className="dashboard__empty">No recent booking activity</p>
          ) : (
            <div className="daily-chart">
              {dailyBookings.map((day) => {
                const max = Math.max(...dailyBookings.map(d => d.count));
                const pct = max ? (day.count / max) * 100 : 0;
                return (
                  <div key={day._id} className="daily-chart__col">
                    <span className="daily-chart__count">{day.count}</span>
                    <div className="daily-chart__bar-wrap">
                      <div className="daily-chart__bar" style={{ height: `${Math.max(pct, 4)}%` }} />
                    </div>
                    <span className="daily-chart__label">
                      {new Date(day._id).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
