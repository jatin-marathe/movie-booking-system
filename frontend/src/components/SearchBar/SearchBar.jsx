import { useState } from 'react';
import './SearchBar.scss';

const GENRES = ['All', 'Action', 'Drama', 'Sci-Fi', 'Comedy', 'Horror', 'Animation', 'Thriller', 'History', 'Adventure', 'Superhero', 'Family'];

export default function SearchBar({ onSearch, onGenre, activeGenre }) {
  const [query, setQuery] = useState('');

  const handleInput = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="search-bar">
      <div className="search-bar__input-wrap">
        <span className="search-bar__icon">🔍</span>
        <input
          type="text"
          placeholder="Search movies, genres, directors..."
          value={query}
          onChange={handleInput}
          className="search-bar__input"
        />
        {query && (
          <button className="search-bar__clear" onClick={() => { setQuery(''); onSearch(''); }}>✕</button>
        )}
      </div>
      <div className="search-bar__genres">
        {GENRES.map(g => (
          <button
            key={g}
            className={`search-bar__genre-btn ${activeGenre === g ? 'active' : ''}`}
            onClick={() => onGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
}
