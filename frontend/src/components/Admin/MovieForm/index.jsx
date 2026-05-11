import { useState, useEffect } from 'react';
import adminApi from '../../../utils/adminApi';
import toast from 'react-hot-toast';
import './MovieForm.scss';

const EMPTY = {
  title: '', image: '', banner: '', genre: '', duration: '', rating: '',
  description: '', releaseYear: '', language: 'English', director: '',
  isTrending: false, isRecommended: false,
  theaters: [{ name: '', location: '', times: '' }],
};

export default function MovieForm({ movie, onSuccess, onClose }) {
  const isEdit = !!movie;
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movie) {
      setForm({
        ...movie,
        genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre || '',
        theaters: movie.theaters?.length
          ? movie.theaters.map(t => ({ ...t, times: t.times?.join(', ') || '' }))
          : [{ name: '', location: '', times: '' }],
      });
    }
  }, [movie]);

  const set = (field, val) => setForm(p => ({ ...p, [field]: val }));

  const setTheater = (i, field, val) => {
    setForm(p => {
      const theaters = [...p.theaters];
      theaters[i] = { ...theaters[i], [field]: val };
      return { ...p, theaters };
    });
  };

  const addTheater    = () => setForm(p => ({ ...p, theaters: [...p.theaters, { name: '', location: '', times: '' }] }));
  const removeTheater = (i) => setForm(p => ({ ...p, theaters: p.theaters.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.image || !form.duration || !form.description || !form.releaseYear) {
      toast.error('Fill in all required fields'); return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        genre:    form.genre.split(',').map(g => g.trim()).filter(Boolean),
        duration: Number(form.duration),
        rating:   Number(form.rating),
        releaseYear: Number(form.releaseYear),
        theaters: form.theaters
          .filter(t => t.name)
          .map(t => ({ ...t, times: t.times.split(',').map(x => x.trim()).filter(Boolean) })),
      };

      let result;
      if (isEdit) {
        const { data } = await adminApi.put(`/movies/${movie._id}`, payload);
        result = data.movie;
        toast.success('Movie updated!');
      } else {
        const { data } = await adminApi.post('/movies', payload);
        result = data.movie;
        toast.success('Movie added!');
      }
      onSuccess(result, isEdit);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="movie-form-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="movie-form-modal">
        {/* Header */}
        <div className="movie-form-modal__header">
          <h2>{isEdit ? '✏️ Edit Movie' : '➕ Add New Movie'}</h2>
          <button className="movie-form-modal__close" onClick={onClose}>✕</button>
        </div>

        {/* Preview */}
        {form.image && (
          <div className="movie-form-modal__preview">
            <img src={form.image} alt="Preview" />
            <div>
              <p className="preview-title">{form.title || 'Movie Title'}</p>
              <p className="preview-meta">{form.genre} · {form.releaseYear}</p>
            </div>
          </div>
        )}

        <form className="admin-form movie-form-modal__form" onSubmit={handleSubmit}>
          {/* Basic Info */}
          <p className="movie-form-modal__section-title">Basic Information</p>

          <div className="admin-form__row">
            <div className="admin-form__field">
              <label>Title *</label>
              <input placeholder="e.g. Dune: Part Two" value={form.title} onChange={e => set('title', e.target.value)} />
            </div>
            <div className="admin-form__field">
              <label>Director</label>
              <input placeholder="e.g. Denis Villeneuve" value={form.director} onChange={e => set('director', e.target.value)} />
            </div>
          </div>

          <div className="admin-form__field admin-form__full">
            <label>Poster Image URL *</label>
            <input placeholder="https://image.tmdb.org/t/p/w500/..." value={form.image} onChange={e => set('image', e.target.value)} />
          </div>

          <div className="admin-form__field admin-form__full">
            <label>Banner Image URL (for details page)</label>
            <input placeholder="https://image.tmdb.org/t/p/original/..." value={form.banner} onChange={e => set('banner', e.target.value)} />
          </div>

          <div className="admin-form__field admin-form__full">
            <label>Description *</label>
            <textarea placeholder="Movie synopsis..." value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          {/* Details */}
          <p className="movie-form-modal__section-title">Details</p>
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label>Genre (comma separated) *</label>
              <input placeholder="Action, Sci-Fi, Drama" value={form.genre} onChange={e => set('genre', e.target.value)} />
            </div>
            <div className="admin-form__field">
              <label>Language</label>
              <input placeholder="English" value={form.language} onChange={e => set('language', e.target.value)} />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field">
              <label>Duration (minutes) *</label>
              <input type="number" placeholder="120" value={form.duration} onChange={e => set('duration', e.target.value)} />
            </div>
            <div className="admin-form__field">
              <label>Rating (0–10)</label>
              <input type="number" step="0.1" min="0" max="10" placeholder="8.5" value={form.rating} onChange={e => set('rating', e.target.value)} />
            </div>
            <div className="admin-form__field">
              <label>Release Year *</label>
              <input type="number" placeholder="2024" value={form.releaseYear} onChange={e => set('releaseYear', e.target.value)} />
            </div>
          </div>

          {/* Flags */}
          <div className="admin-form__row">
            <div className="toggle-field">
              <span className="toggle-field__label">🔥 Mark as Trending</span>
              <input type="checkbox" checked={form.isTrending} onChange={e => set('isTrending', e.target.checked)} />
            </div>
            <div className="toggle-field">
              <span className="toggle-field__label">⭐ Mark as Recommended</span>
              <input type="checkbox" checked={form.isRecommended} onChange={e => set('isRecommended', e.target.checked)} />
            </div>
          </div>

          {/* Theaters */}
          <p className="movie-form-modal__section-title">Theaters & Showtimes</p>
          {form.theaters.map((t, i) => (
            <div key={i} className="theater-row">
              <div className="theater-row__header">
                <span>Theater #{i + 1}</span>
                {form.theaters.length > 1 && (
                  <button type="button" className="theater-row__remove" onClick={() => removeTheater(i)}>✕ Remove</button>
                )}
              </div>
              <div className="admin-form__row">
                <div className="admin-form__field">
                  <label>Theater Name</label>
                  <input placeholder="e.g. PVR Cinemas" value={t.name} onChange={e => setTheater(i, 'name', e.target.value)} />
                </div>
                <div className="admin-form__field">
                  <label>Location</label>
                  <input placeholder="e.g. Downtown" value={t.location} onChange={e => setTheater(i, 'location', e.target.value)} />
                </div>
              </div>
              <div className="admin-form__field">
                <label>Show Times (comma separated)</label>
                <input placeholder="10:00 AM, 2:30 PM, 6:00 PM, 9:30 PM" value={t.times} onChange={e => setTheater(i, 'times', e.target.value)} />
              </div>
            </div>
          ))}
          <button type="button" className="btn-admin-ghost theater-add-btn" onClick={addTheater}>
            + Add Another Theater
          </button>

          {/* Actions */}
          <div className="admin-form__actions">
            <button type="button" className="btn-admin-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-admin-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? '✓ Update Movie' : '✓ Add Movie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
