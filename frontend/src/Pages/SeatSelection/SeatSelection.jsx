import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './SeatSelection.scss';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COLS = 10;
const TICKET_PRICE = 200;

function generateSeats(rows, cols) {
  return rows.map(row => ({
    row,
    seats: Array.from({ length: cols }, (_, i) => `${row}${i + 1}`)
  }));
}

export default function SeatSelection() {
  const { bookingDetails, selectedSeats, bookedSeats, fetchBookedSeats, toggleSeat, confirmBooking } = useBooking();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  const layout = generateSeats(ROWS, COLS);

  useEffect(() => {
    if (!bookingDetails) { navigate('/'); return; }
    if (!isLoggedIn) { navigate('/sign-in'); return; }
    const { movie, theater, date, time } = bookingDetails;
    fetchBookedSeats(movie._id, theater, date, time)
      .catch(() => toast.error('Failed to load seat data'))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return 'booked';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    toggleSeat(seatId);
  };

  const totalPrice = selectedSeats.length * TICKET_PRICE;

  const handleConfirm = async () => {
    if (selectedSeats.length === 0) { toast.error('Please select at least one seat'); return; }
    setConfirming(true);
    try {
      const booking = await confirmBooking(totalPrice);
      toast.success('Booking confirmed! 🎉');
      navigate('/my-ticket', { state: { booking } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Try again.');
    } finally {
      setConfirming(false);
    }
  };

  if (!bookingDetails) return null;

  const { movie, theater, date, time } = bookingDetails;

  return (
    <div className="seat-selection">
      <div className="container">
        {/* Header */}
        <div className="seat-selection__header">
          <button className="seat-selection__back" onClick={() => navigate(-1)}>← Back</button>
          <div className="seat-selection__show-info">
            <h1>{movie.title}</h1>
            <div className="seat-selection__show-meta">
              <span>🏛 {theater}</span>
              <span>·</span>
              <span>📅 {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              <span>·</span>
              <span>🕐 {time}</span>
            </div>
          </div>
        </div>

        {/* Screen */}
        <div className="seat-selection__screen">
          <div className="screen-bar" />
          <p>SCREEN</p>
        </div>

        {/* Seat Map */}
        {loading ? (
          <div className="seat-selection__loader">Loading seats...</div>
        ) : (
          <div className="seat-selection__map">
            {layout.map(({ row, seats }) => (
              <div key={row} className="seat-row">
                <span className="seat-row__label">{row}</span>
                <div className="seat-row__seats">
                  {seats.map(seatId => {
                    const status = getSeatStatus(seatId);
                    return (
                      <button
                        key={seatId}
                        className={`seat seat--${status}`}
                        onClick={() => handleSeatClick(seatId)}
                        disabled={status === 'booked'}
                        title={seatId}
                      >
                        {seatId.replace(row, '')}
                      </button>
                    );
                  })}
                </div>
                <span className="seat-row__label">{row}</span>
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="seat-legend">
          <div className="seat-legend__item">
            <div className="legend-box seat--available" />
            <span>Available</span>
          </div>
          <div className="seat-legend__item">
            <div className="legend-box seat--selected" />
            <span>Selected</span>
          </div>
          <div className="seat-legend__item">
            <div className="legend-box seat--booked" />
            <span>Booked</span>
          </div>
        </div>

        {/* Summary */}
        <div className="seat-summary glass-card">
          <div className="seat-summary__seats">
            {selectedSeats.length === 0 ? (
              <p className="seat-summary__empty">Select seats from the map above</p>
            ) : (
              <>
                <p className="seat-summary__label">Selected Seats</p>
                <div className="seat-summary__tags">
                  {selectedSeats.map(s => <span key={s} className="seat-tag">{s}</span>)}
                </div>
              </>
            )}
          </div>
          <div className="seat-summary__pricing">
            <div className="seat-summary__row">
              <span>{selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''}</span>
              <span>× ₹{TICKET_PRICE}</span>
            </div>
            <div className="seat-summary__total">
              <span>Total</span>
              <span className="seat-summary__amount">₹{totalPrice}</span>
            </div>
            <button
              className="btn-primary seat-summary__cta"
              onClick={handleConfirm}
              disabled={selectedSeats.length === 0 || confirming}
            >
              {confirming ? 'Confirming...' : `Confirm Booking · ₹${totalPrice}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
