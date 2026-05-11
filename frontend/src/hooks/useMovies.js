import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export function useMovies(params = {}) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetch = useCallback(async (overrides = {}) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get('/movies', { params: { ...params, ...overrides } });
            setMovies(data.movies);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load movies');
        } finally {
            setLoading(false);
        }
    }, []); // eslint-disable-line

    useEffect(() => { fetch(); }, []); // eslint-disable-line

    return { movies, loading, error, refetch: fetch };
}

export function useMovie(id) {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        api.get(`/movies/${id}`)
            .then(({ data }) => setMovie(data.movie))
            .catch(err => setError(err.response?.data?.message || 'Movie not found'))
            .finally(() => setLoading(false));
    }, [id]);

    return { movie, loading, error };
}
