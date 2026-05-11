import { useEffect, useState } from 'react';
import adminApi from '../../../utils/adminApi';
import './Bookings.scss';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get('/bookings')
      .then(({ data }) => { setBookings(data.bookings); setTotal(data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="admin-bookings animate-in">
      <div className="admin-page-header">
        <div className="admin-page-header__left">
          <h1 className="admin-page-header__title">Bookings</h1>
          <p className="admin-page-header__sub">{total} total confirmed bookings</p>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <p className="admin-bookings__loading">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="admin-bookings__empty">
            <span>🎟</span>
            <p>No bookings yet</p>
          </div>
        ) : (
          <div className="admin-bookings__table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>User</th>
                  <th>Movie</th>
                  <th>Theater</th>
                  <th>Seats</th>
                  <th>Show Date</th>
                  <th>Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id}>
                    <td>
                      <span className="booking-id">{b.bookingId}</span>
                    </td>
                    <td>
                      <div>
                        <p className="user-name">{b.userId?.name || '—'}</p>
                        <p className="user-email">{b.userId?.email || ''}</p>
                      </div>
                    </td>
                    <td>
                      <div className="movie-cell">
                        <img src={b.movieId?.image} alt="" className="movie-cell__img" />
                        <span>{b.movieId?.title || '—'}</span>
                      </div>
                    </td>
                    <td>{b.theater}</td>
                    <td>
                      <div className="seats-cell">
                        {b.seats.map(s => <span key={s} className="seat-chip">{s}</span>)}
                      </div>
                    </td>
                    <td>{b.date}</td>
                    <td>{b.time}</td>
                    <td><span className="amount-cell">₹{b.totalPrice}</span></td>
                    <td>
                      <span className={`badge badge--${b.status === 'confirmed' ? 'green' : 'red'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
