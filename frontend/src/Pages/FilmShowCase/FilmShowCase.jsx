import { useState, useMemo } from 'react';
import { useMovies } from '../../hooks/useMovies';
import MovieCard from '../../components/MovieCard/MovieCard';
import { MovieCardSkeleton } from '../../components/SkeletonLoader/SkeletonLoader';
import SearchBar from '../../components/SearchBar/SearchBar';
import './FilmShowCase.scss';

export default function FilmShowCase() {
    const { movies = [], loading, error } = useMovies();
    const [search, setSearch] = useState('');
    const [activeGenre, setActiveGenre] = useState('All');

    const filtered = useMemo(() => {
        return (movies || []).filter(m => {
            const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
                m.genre?.some(g => g.toLowerCase().includes(search.toLowerCase()));
            const matchesGenre = activeGenre === 'All' || m.genre?.includes(activeGenre);
            return matchesSearch && matchesGenre;
        });
    }, [movies, search, activeGenre]);

    const trending = useMemo(() => (movies || []).filter(m => m.isTrending), [movies]);
    const recommended = useMemo(() => (movies || []).filter(m => m.isRecommended), [movies]);
    const hasFilter = search || activeGenre !== 'All';

    return (
        <div className="showcase">
            {/* Hero */}
            <div className="showcase__hero">
                <div className="showcase__hero-bg" />
                <div className="container showcase__hero-content">
                    <p className="showcase__hero-eyebrow">🎬 Now Showing</p>
                    <h1 className="showcase__hero-title">YOUR NEXT<br /><span className="accent">FAVOURITE</span><br />FILM AWAITS</h1>
                    <p className="showcase__hero-sub">Book tickets for the latest blockbusters, cult classics, and hidden gems.</p>
                </div>
            </div>

            <div className="container showcase__body">
                {/* Search & Genre Filter */}
                <SearchBar
                    onSearch={setSearch}
                    onGenre={setActiveGenre}
                    activeGenre={activeGenre}
                />

                {error && (
                    <div className="showcase__error">
                        <span>⚠️</span> {error}
                    </div>
                )}

                {/* Filtered Results */}
                {hasFilter ? (
                    <section className="showcase__section">
                        <div className="section-heading">
                            <span className="accent-dot" />
                            <h2>Results {filtered.length > 0 && `(${filtered.length})`}</h2>
                            <div className="line" />
                        </div>
                        {loading ? (
                            <div className="showcase__grid">
                                {[...Array(6)].map((_, i) => <MovieCardSkeleton key={i} />)}
                            </div>
                        ) : filtered.length > 0 ? (
                            <div className="showcase__grid">
                                {filtered.map(m => <MovieCard key={m._id} movie={m} />)}
                            </div>
                        ) : (
                            <div className="showcase__empty">
                                <span>🎭</span>
                                <p>No movies found for "<strong>{search || activeGenre}</strong>"</p>
                            </div>
                        )}
                    </section>
                ) : (
                    <>
                        {/* Trending */}
                        <section className="showcase__section">
                            <div className="section-heading">
                                <span className="accent-dot" />
                                <h2>🔥 Trending Now</h2>
                                <div className="line" />
                            </div>
                            {loading ? (
                                <div className="showcase__grid">
                                    {[...Array(3)].map((_, i) => <MovieCardSkeleton key={i} />)}
                                </div>
                            ) : (
                                <div className="showcase__grid">
                                    {trending.map(m => <MovieCard key={m._id} movie={m} />)}
                                </div>
                            )}
                        </section>

                        {/* Recommended */}
                        <section className="showcase__section">
                            <div className="section-heading">
                                <span className="accent-dot" />
                                <h2>⭐ Recommended</h2>
                                <div className="line" />
                            </div>
                            {loading ? (
                                <div className="showcase__grid">
                                    {[...Array(3)].map((_, i) => <MovieCardSkeleton key={i} />)}
                                </div>
                            ) : (
                                <div className="showcase__grid">
                                    {recommended.map(m => <MovieCard key={m._id} movie={m} />)}
                                </div>
                            )}
                        </section>

                        {/* All Movies */}
                        <section className="showcase__section">
                            <div className="section-heading">
                                <span className="accent-dot" />
                                <h2>All Movies</h2>
                                <div className="line" />
                            </div>
                            {loading ? (
                                <div className="showcase__grid">
                                    {[...Array(6)].map((_, i) => <MovieCardSkeleton key={i} />)}
                                </div>
                            ) : (
                                <div className="showcase__grid">
                                    {(movies || []).map(m => <MovieCard key={m._id} movie={m} />)}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}
