// import { useEffect, useState } from "react";
// import 'ldrs/quantum'
// import { useNavigate } from "react-router-dom";
// import './styles/FilmShowCase.scss'
// import { useLocation } from "react-router-dom";

// function FilmShowCase() {

//     // === Use State ===
//     const location = useLocation();
//     const value = location.state;
//     const [showNavBar, setShowNavBar] = useState(false);
//     const [movies, setMovies] = useState([
//         {
//             id: 1,
//             img: <><img src="/src/assets/Images/image1.png" alt="" /></>,
//             title: "Movie Title"
//         },
//         {
//             id: 2,
//             img: <><img src="/src/assets/Images/image2.png" alt="" /></>,
//             title: "Movie Title"
//         },
//         {
//             id: 3,
//             img: <><img src="/src/assets/Images/image3.png" alt="" /></>,
//             title: "Movie Title"
//         },
//         {
//             id: 4,
//             img: <><img src="/src/assets/Images/image4.png" alt="" /></>,
//             title: "Movie Title"
//         },
//         {
//             id: 5,
//             img: <><img src="/src/assets/Images/image5.png" alt="" /></>,
//             title: "Movie Title"
//         },
//         {
//             id: 6,
//             img: <><img src="/src/assets/Images/image6.png" alt="" /></>,
//             title: "Movie Title"
//         }
//     ])

//     // === Variable ===

//     let navigate1 = useNavigate();
//     let navigate2 = useNavigate();
//     let navigate3 = useNavigate();

//     // === Functions ===

//     const goToSignInPage = () => {
//         let path1 = "/sign-in";
//         navigate1(path1)
//     }

//     const goToSignUpPage = () => {
//         let path2 = "/sign-up";
//         navigate2(path2)
//     }
//     const goToNewInPage = () => {
//         navigate3("/my-ticket")
//     }


//     // === Use Effect ===

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setShowNavBar(true);
//         }, 2500);
//         return () => clearTimeout(timer);
//     }, [])

//     return (
//         <>{
//             showNavBar ? <div className="moviesContainer">
//                 <div className="navigationBar">
//                     <div className='image'>
//                         <img src="/src/assets/Images/logo2.png" alt="Logo" />
//                     </div>
//                     <div className='navButton'>
//                         <div>
//                             {value ? <></> :
//                                 <button className="greenBtn" onClick={goToSignInPage} >
//                                     <span>
//                                         Login
//                                     </span>
//                                 </button>
//                             }
//                         </div>
//                         <div>
//                             {value ? <></> :
//                                 <button className="transparentBtn" onClick={goToSignUpPage}>
//                                     <span>
//                                         Register
//                                     </span>
//                                 </button>
//                             }
//                         </div>
//                         <div>
//                             {value ?
//                                 <button className="transparentBtnn" onClick={goToNewInPage}>
//                                     <span>
//                                         My Ticket
//                                     </span>
//                                 </button> : <></>
//                             }
//                         </div>
//                         <div>
//                             {value ?
//                                 <button className="redBtn" onClick={goToSignUpPage}>
//                                     <span>
//                                         Logout
//                                     </span>
//                                 </button> : <></>
//                             }
//                         </div>
//                     </div>
//                 </div>
//                 <div className='heading'>
//                     <h1>Now Showing</h1>
//                 </div>
//                 <div className="filmShowcase">
//                     {
//                         movies.map((movie) => {
//                             return (
//                                 <div key={movie.id} className="moviesWrapper">
//                                     <div className="moviesImage">
//                                         {movie.img}
//                                         <div className="moviesTitle">
//                                             <span>
//                                                 {movie.title}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )
//                         })
//                     }
//                 </div>
//             </div > :
//                 <div className='loader'>
//                     <l-quantum
//                         size="120"
//                         speed="1.8"
//                         color="#ffff"
//                     ></l-quantum>
//                 </div>
//         }
//         </>
//     );
// };

// export default FilmShowCase

import { useState, useMemo } from 'react';
import { useMovies } from '../../hooks/useMovies';
import MovieCard from '../../components/MovieCard/MovieCard';
import { MovieCardSkeleton } from '../../components/SkeletonLoader/SkeletonLoader';
import SearchBar from '../../components/SearchBar/SearchBar';
import './FilmShowCase.scss';

export default function FilmShowCase() {
    const { movies, loading, error } = useMovies();
    const [search, setSearch] = useState('');
    const [activeGenre, setActiveGenre] = useState('All');

    const filtered = useMemo(() => {
        return movies.filter(m => {
            const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
                m.genre?.some(g => g.toLowerCase().includes(search.toLowerCase()));
            const matchesGenre = activeGenre === 'All' || m.genre?.includes(activeGenre);
            return matchesSearch && matchesGenre;
        });
    }, [movies, search, activeGenre]);

    const trending = useMemo(() => movies.filter(m => m.isTrending), [movies]);
    const recommended = useMemo(() => movies.filter(m => m.isRecommended), [movies]);
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
                                    {movies.map(m => <MovieCard key={m._id} movie={m} />)}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}
