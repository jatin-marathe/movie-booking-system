import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovie } from '../../hooks/useMovies';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { MovieDetailsSkeleton } from '../../components/SkeletonLoader/SkeletonLoader';
import toast from 'react-hot-toast';
import './MovieDetails.scss';

// Generate next 7 days
function getNext7Days() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      value: d.toISOString().split('T')[0],
    });
  }
  return days;
}

export default function MovieDetails() {
  const { id } = useParams();
  const { movie, loading, error } = useMovie(id);
  const { isLoggedIn } = useAuth();
  const { initBooking } = useBooking();
  const navigate = useNavigate();

  const [selectedTheater, setSelectedTheater] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const days = getNext7Days();

  const theaterObj = movie?.theaters?.find(t => t.name === selectedTheater);

  const handleSelectSeats = () => {
    if (!isLoggedIn) {
      toast.error('Please login to book tickets');
      navigate('/sign-in');
      return;
    }
    if (!selectedTheater || !selectedDate || !selectedTime) {
      toast.error('Please select theater, date and time');
      return;
    }
    initBooking(movie, selectedTheater, selectedDate, selectedTime);
    navigate('/seat-selection');
  };

  if (loading) return <div className="page-loader"><MovieDetailsSkeleton /></div>;
  if (error) return (
    <div className="movie-details__error">
      <span>😞</span>
      <h2>Movie not found</h2>
      <button className="btn-primary" onClick={() => navigate('/')}>Go Back</button>
    </div>
  );

  return (
    <div className="movie-details">
      {/* Banner */}
      <div className="movie-details__banner">
        <img src={movie.banner || movie.image} alt={movie.title} className="movie-details__banner-img" />
        <div className="movie-details__banner-overlay" />
        <div className="movie-details__banner-content container">
          <img src={movie.image} alt={movie.title} className="movie-details__poster" />
          <div className="movie-details__info">
            <div className="movie-details__genres">
              {movie.genre?.map(g => <span key={g} className="genre-tag">{g}</span>)}
            </div>
            <h1 className="movie-details__title">{movie.title}</h1>
            <div className="movie-details__meta">
              <span>⭐ {movie.rating.toFixed(1)}/10</span>
              <span>·</span>
              <span>🕐 {Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
              <span>·</span>
              <span>📅 {movie.releaseYear}</span>
              <span>·</span>
              <span>🌐 {movie.language}</span>
            </div>
            {movie.director && <p className="movie-details__director">Directed by <strong>{movie.director}</strong></p>}
          </div>
        </div>
      </div>

      <div className="container movie-details__body">
        <div className="movie-details__layout">
          {/* Left: Description + Cast */}
          <div className="movie-details__left">
            <section className="movie-details__section">
              <h2>Synopsis</h2>
              <p>{movie.description}</p>
            </section>

            {movie.cast?.length > 0 && (
              <section className="movie-details__section">
                <h2>Cast</h2>
                <div className="movie-details__cast">
                  {movie.cast.map((c, i) => (
                    <div key={i} className="cast-item">
                      <div className="cast-item__avatar">{c.name[0]}</div>
                      <div>
                        <p className="cast-item__name">{c.name}</p>
                        <p className="cast-item__role">{c.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right: Booking Panel */}
          <div className="booking-panel glass-card">
            <h2 className="booking-panel__title">Book Tickets</h2>

            {/* Theater */}
            <div className="booking-panel__field">
              <label>Select Theater</label>
              <div className="booking-panel__options">
                {movie.theaters?.map(t => (
                  <button
                    key={t.name}
                    className={`booking-panel__option ${selectedTheater === t.name ? 'active' : ''}`}
                    onClick={() => { setSelectedTheater(t.name); setSelectedTime(''); }}
                  >
                    <span className="option-name">{t.name}</span>
                    <span className="option-sub">{t.location}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="booking-panel__field">
              <label>Select Date</label>
              <div className="booking-panel__dates">
                {days.map(d => (
                  <button
                    key={d.value}
                    className={`date-btn ${selectedDate === d.value ? 'active' : ''}`}
                    onClick={() => { setSelectedDate(d.value); setSelectedTime(''); }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time */}
            {theaterObj && selectedDate && (
              <div className="booking-panel__field">
                <label>Select Time</label>
                <div className="booking-panel__times">
                  {theaterObj.times.map(t => (
                    <button
                      key={t}
                      className={`time-btn ${selectedTime === t ? 'active' : ''}`}
                      onClick={() => setSelectedTime(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              className="btn-primary booking-panel__cta"
              onClick={handleSelectSeats}
              disabled={!selectedTheater || !selectedDate || !selectedTime}
            >
              Select Seats →
            </button>

            <p className="booking-panel__note">
              🎟 Ticket price: <strong>₹200</strong> per seat
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
