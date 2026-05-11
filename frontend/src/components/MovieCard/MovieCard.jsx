import { useNavigate } from 'react-router-dom';
import './MovieCard.scss';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  const handleClick = () => navigate(`/movie/${movie._id}`);

  return (
    <div className="movie-card" onClick={handleClick}>
      <div className="movie-card__poster">
        <img src={movie.image} alt={movie.title} loading="lazy" />
        <div className="movie-card__overlay">
          <button className="movie-card__book-btn">Book Now</button>
        </div>
        {movie.isTrending && <span className="movie-card__badge badge--trending">🔥 Trending</span>}
      </div>
      <div className="movie-card__info">
        <h3 className="movie-card__title">{movie.title}</h3>
        <div className="movie-card__meta">
          <span className="movie-card__genre">{movie.genre?.[0]}</span>
          <span className="movie-card__dot">·</span>
          <span className="movie-card__year">{movie.releaseYear}</span>
          <span className="movie-card__dot">·</span>
          <span className="movie-card__duration">
            {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
          </span>
        </div>
        <div className="movie-card__rating">
          <span className="star">★</span>
          <span className="score">{movie.rating.toFixed(1)}</span>
          <span className="out">/10</span>
        </div>
      </div>
    </div>
  );
}
