import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import './MyTicket.scss';

function QRPlaceholder({ value }) {
  // Simple deterministic dot grid as QR stand-in (no external lib needed)
  const size = 11;
  const hash = [...value].reduce((a, c) => a + c.charCodeAt(0), 0);
  const cells = Array.from({ length: size * size }, (_, i) => {
    // Fixed corner patterns
    const r = Math.floor(i / size), c = i % size;
    const inCorner = (r < 3 && c < 3) || (r < 3 && c >= size - 3) || (r >= size - 3 && c < 3);
    if (inCorner) return true;
    return ((i * hash * 7 + 13) % 17) > 8;
  });
  return (
    <div className="qr-grid" style={{ '--size': size }}>
      {cells.map((on, i) => <div key={i} className={`qr-cell ${on ? 'on' : ''}`} />)}
    </div>
  );
}

export default function MyTicket() {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchMyBookings, myBookings } = useBooking();
  const { user, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeBooking, setActiveBooking] = useState(location.state?.booking || null);
  const ticketRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) { navigate('/sign-in'); return; }
    if (!activeBooking) {
      setLoading(true);
      fetchMyBookings().then(b => { if (b.length > 0) setActiveBooking(b[0]); }).finally(() => setLoading(false));
    } else {
      fetchMyBookings();
    }
  }, []); // eslint-disable-line

  const handlePrint = () => window.print();

  const formatDate = (dateStr) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (!isLoggedIn) return null;

  return (
    <div className="my-ticket">
      <div className="container">
        <div className="my-ticket__layout">
          {/* Sidebar: All bookings */}
          <aside className="my-ticket__sidebar">
            <h2 className="my-ticket__sidebar-title">My Bookings</h2>
            {loading ? (
              <p className="my-ticket__loading">Loading...</p>
            ) : myBookings.length === 0 ? (
              <div className="my-ticket__empty">
                <span>🎟</span>
                <p>No bookings yet</p>
                <button className="btn-primary" onClick={() => navigate('/')}>Browse Movies</button>
              </div>
            ) : (
              <div className="my-ticket__list">
                {myBookings.map(b => (
                  <button
                    key={b._id}
                    className={`booking-item ${activeBooking?._id === b._id ? 'active' : ''}`}
                    onClick={() => setActiveBooking(b)}
                  >
                    <img src={b.movieId?.image} alt={b.movieId?.title} className="booking-item__img" />
                    <div className="booking-item__info">
                      <p className="booking-item__title">{b.movieId?.title}</p>
                      <p className="booking-item__meta">{b.date} · {b.time}</p>
                      <p className="booking-item__seats">{b.seats.length} seat{b.seats.length !== 1 ? 's' : ''}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </aside>

          {/* Ticket Display */}
          <main className="my-ticket__main">
            {activeBooking ? (
              <>
                <div className="my-ticket__actions no-print">
                  <button className="btn-ghost" onClick={handlePrint}>🖨 Print Ticket</button>
                </div>

                <div className="ticket" ref={ticketRef}>
                  {/* Ticket Header */}
                  <div className="ticket__header">
                    <div className="ticket__brand">🎬 CINEMABOOK</div>
                    <div className="ticket__badge">✓ CONFIRMED</div>
                  </div>

                  {/* Ticket Body */}
                  <div className="ticket__body">
                    <div className="ticket__poster-col">
                      <img src={activeBooking.movieId?.image} alt={activeBooking.movieId?.title} className="ticket__poster" />
                    </div>

                    <div className="ticket__details">
                      <h1 className="ticket__movie-title">{activeBooking.movieId?.title}</h1>
                      <div className="ticket__genre">
                        {activeBooking.movieId?.genre?.map(g => <span key={g}>{g}</span>)}
                      </div>

                      <div className="ticket__info-grid">
                        <div className="ticket__info-item">
                          <span className="ticket__info-label">Passenger</span>
                          <span className="ticket__info-value">{user?.name}</span>
                        </div>
                        <div className="ticket__info-item">
                          <span className="ticket__info-label">Theater</span>
                          <span className="ticket__info-value">{activeBooking.theater}</span>
                        </div>
                        <div className="ticket__info-item">
                          <span className="ticket__info-label">Date</span>
                          <span className="ticket__info-value">{formatDate(activeBooking.date)}</span>
                        </div>
                        <div className="ticket__info-item">
                          <span className="ticket__info-label">Time</span>
                          <span className="ticket__info-value">{activeBooking.time}</span>
                        </div>
                        <div className="ticket__info-item">
                          <span className="ticket__info-label">Seats</span>
                          <span className="ticket__info-value ticket__seats">
                            {activeBooking.seats.map(s => <span key={s} className="ticket__seat-tag">{s}</span>)}
                          </span>
                        </div>
                        <div className="ticket__info-item">
                          <span className="ticket__info-label">Total Paid</span>
                          <span className="ticket__info-value ticket__price">₹{activeBooking.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Tear Line */}
                  <div className="ticket__tear">
                    <div className="ticket__notch ticket__notch--left" />
                    <div className="ticket__dotted" />
                    <div className="ticket__notch ticket__notch--right" />
                  </div>

                  {/* Ticket Footer: QR + Booking ID */}
                  <div className="ticket__footer">
                    <div className="ticket__qr-col">
                      <QRPlaceholder value={activeBooking.bookingId} />
                      <p className="ticket__scan-text">Scan at entrance</p>
                    </div>
                    <div className="ticket__booking-id-col">
                      <p className="ticket__booking-label">Booking ID</p>
                      <p className="ticket__booking-id">{activeBooking.bookingId}</p>
                      <p className="ticket__booking-note">Present this ticket at the theater entrance</p>
                    </div>
                  </div>
                </div>
              </>
            ) : !loading && (
              <div className="my-ticket__no-selection">
                <span>👈</span>
                <p>Select a booking to view your ticket</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
