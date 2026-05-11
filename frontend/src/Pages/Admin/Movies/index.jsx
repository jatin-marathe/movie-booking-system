import { useEffect, useState } from 'react';
import adminApi from '../../../utils/adminApi';
import toast from 'react-hot-toast';
import MovieForm from '../../../components/Admin/MovieForm';
import './Movies.scss';

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editMovie, setEditMovie] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      const { data } = await adminApi.get('/movies');
      setMovies(res.data.movies);
    } catch { toast.error('Failed to load movies'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await adminApi.delete(`/movies/${id}`);
      setMovies(p => p.filter(m => m._id !== id));
      toast.success('Movie deleted');
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(null); }
  };

  const handleEdit = (movie) => { setEditMovie(movie); setShowForm(true); };
  const handleAdd = () => { setEditMovie(null); setShowForm(true); };

  const handleFormSuccess = (movie, isEdit) => {
    if (isEdit) {
      setMovies(p => p.map(m => m._id === movie._id ? movie : m));
    } else {
      setMovies(p => [movie, ...p]);
    }
    setShowForm(false);
    setEditMovie(null);
  };

  const filtered = movies.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-movies animate-in">
      <div className="admin-page-header">
        <div className="admin-page-header__left">
          <h1 className="admin-page-header__title">Movies</h1>
          <p className="admin-page-header__sub">{movies.length} movies in database</p>
        </div>
        <button className="btn-admin-primary" onClick={handleAdd}>
          + Add Movie
        </button>
      </div>

      {/* Search */}
      <div className="admin-movies__search-wrap">
        <input
          type="text"
          placeholder="🔍  Search movies..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="admin-movies__search"
        />
      </div>

      {/* Movie Form Modal */}
      {showForm && (
        <MovieForm
          movie={editMovie}
          onSuccess={handleFormSuccess}
          onClose={() => { setShowForm(false); setEditMovie(null); }}
        />
      )}

      {/* Table */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-movies__loading">Loading movies...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-movies__empty">
            <span>🎬</span>
            <p>{search ? `No results for "${search}"` : 'No movies yet. Add your first movie!'}</p>
          </div>
        ) : (
          <div className="admin-movies__table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Movie</th>
                  <th>Genre</th>
                  <th>Rating</th>
                  <th>Duration</th>
                  <th>Year</th>
                  <th>Trending</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(movie => (
                  <tr key={movie._id}>
                    <td>
                      <div className="movie-row">
                        <img src={movie.image} alt={movie.title} className="movie-row__img" />
                        <div>
                          <p className="movie-row__title">{movie.title}</p>
                          <p className="movie-row__id">{movie._id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="genre-tags">
                        {movie.genre?.slice(0, 2).map(g => (
                          <span key={g} className="badge badge--indigo">{g}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="rating-cell">⭐ {movie.rating}</span>
                    </td>
                    <td>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</td>
                    <td>{movie.releaseYear}</td>
                    <td>
                      {movie.isTrending
                        ? <span className="badge badge--gold">🔥 Yes</span>
                        : <span className="badge badge--green">—</span>}
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-admin-ghost action-btn" onClick={() => handleEdit(movie)}>
                          ✏️ Edit
                        </button>
                        <button
                          className="btn-admin-danger action-btn"
                          onClick={() => handleDelete(movie._id, movie.title)}
                          disabled={deleting === movie._id}
                        >
                          {deleting === movie._id ? '...' : '🗑 Delete'}
                        </button>
                      </div>
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
