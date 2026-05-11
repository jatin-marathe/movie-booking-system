

// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from './context/AuthContext';
// import { BookingProvider } from './context/BookingContext';
// import Navbar from './components/Navbar/Navbar';
// import FilmShowCase from './Pages/FilmShowCase/FilmShowCase';
// import MovieDetails from './Pages/MovieDetails/MovieDetails';
// import SeatSelection from './Pages/SeatSelection/SeatSelection';
// import MyTicket from './Pages/MyTicket/MyTicket';
// import SignIn from './Pages/SignIn/SignIn';
// import SignUp from './Pages/SignUp/SignUp';

// // Pages that should NOT show the Navbar
// const HIDE_NAVBAR_ROUTES = ['/sign-in', '/sign-up'];

// function Layout() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <BookingProvider>
//           <NavbarWrapper />
//           <Routes>
//             <Route path="/" element={<FilmShowCase />} />
//             <Route path="/movie/:id" element={<MovieDetails />} />
//             <Route path="/seat-selection" element={<SeatSelection />} />
//             <Route path="/my-ticket" element={<MyTicket />} />
//             <Route path="/sign-in" element={<SignIn />} />
//             <Route path="/sign-up" element={<SignUp />} />
//           </Routes>
//           <Toaster
//             position="top-right"
//             toastOptions={{
//               style: {
//                 background: '#16161f',
//                 color: '#f0edf6',
//                 border: '1px solid rgba(255,255,255,0.08)',
//                 fontFamily: "'DM Sans', sans-serif",
//                 fontSize: '0.9rem',
//               },
//               success: { iconTheme: { primary: '#06d6a0', secondary: '#16161f' } },
//               error: { iconTheme: { primary: '#e63946', secondary: '#16161f' } },
//             }}
//           />
//         </BookingProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// function NavbarWrapper() {
//   // Dynamically hide navbar on auth pages
//   const path = window.location.pathname;
//   if (HIDE_NAVBAR_ROUTES.some(r => path.startsWith(r))) return null;
//   return <Navbar />;
// }

// export default Layout;
// import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from './context/AuthContext';
// import { BookingProvider } from './context/BookingContext';
// import { AdminAuthProvider } from './context/AdminAuthContext';
// import { AdminLayout, AdminPublicRoute } from './components/Admin/AdminLayout/AdminLayout';
// import Navbar from './components/Navbar/Navbar';
// import FilmShowCase from './Pages/FilmShowCase/FilmShowCase';
// import MovieDetails from './Pages/MovieDetails/MovieDetails';
// import SeatSelection from './Pages/SeatSelection/SeatSelection';
// import MyTicket from './Pages/MyTicket/MyTicket';
// import SignIn from './Pages/SignIn/SignIn';
// import SignUp from './Pages/SignUp/SignUp';
// import AdminLogin from './Pages/Admin/AdminLogin/AdminLogin';
// import AdminDashboard from './Pages/Admin/AdminDashboard/AdminDashboard';
// import AdminMovies from './Pages/Admin/AdminMovies/AdminMovies';
// import AdminBookings from './Pages/Admin/AdminBookings/AdminBookings';
// import AdminUsers from './Pages/Admin/AdminUsers/AdminUsers';

// const HIDE_NAVBAR = ['/sign-in', '/sign-up', '/admin'];

// function NavbarWrapper() {
//   const location = useLocation();
//   if (HIDE_NAVBAR.some(r => location.pathname.startsWith(r))) return null;
//   return <Navbar />;
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <AdminAuthProvider>
//         <AuthProvider>
//           <BookingProvider>
//             <NavbarWrapper />
//             <Routes>
//               <Route path="/" element={<FilmShowCase />} />
//               <Route path="/movie/:id" element={<MovieDetails />} />
//               <Route path="/seat-selection" element={<SeatSelection />} />
//               <Route path="/my-ticket" element={<MyTicket />} />
//               <Route path="/sign-in" element={<SignIn />} />
//               <Route path="/sign-up" element={<SignUp />} />
//               <Route path="/admin" element={<AdminPublicRoute />}>
//                 <Route path="login" element={<AdminLogin />} />
//               </Route>
//               <Route path="/admin" element={<AdminLayout />}>
//                 <Route path="dashboard" element={<AdminDashboard />} />
//                 <Route path="movies" element={<AdminMovies />} />
//                 <Route path="bookings" element={<AdminBookings />} />
//                 <Route path="users" element={<AdminUsers />} />
//               </Route>
//             </Routes>
//             <Toaster
//               position="top-right"
//               toastOptions={{
//                 style: { background: '#16161f', color: '#f0edf6', border: '1px solid rgba(255,255,255,0.08)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' },
//                 success: { iconTheme: { primary: '#06d6a0', secondary: '#16161f' } },
//                 error: { iconTheme: { primary: '#e63946', secondary: '#16161f' } },
//               }}
//             />
//           </BookingProvider>
//         </AuthProvider>
//       </AdminAuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;

// import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';

// // User contexts
// import { AuthProvider } from './context/AuthContext';
// import { BookingProvider } from './context/BookingContext';

// // Admin context
// import { AdminAuthProvider } from './context/AdminAuthContext';

// // Admin layout guards
// import { AdminLayout, AdminPublicRoute } from './components/Admin/AdminLayout';

// // User pages
// import Navbar from './components/Navbar';
// import FilmShowCase from './Pages/FilmShowCase';
// import MovieDetails from './Pages/MovieDetails';
// import SeatSelection from './Pages/SeatSelection';
// import MyTicket from './Pages/MyTicket';
// import SignIn from './Pages/SignIn';
// import SignUp from './Pages/SignUp';

// // Admin pages
// import AdminLogin from './Pages/Admin/Login';
// import AdminDashboard from './Pages/Admin/Dashboard';
// import AdminMovies from './Pages/Admin/Movies';
// import AdminBookings from './Pages/Admin/Bookings';
// import AdminUsers from './Pages/Admin/Users';

// const HIDE_NAVBAR = ['/sign-in', '/sign-up', '/admin'];

// function NavbarWrapper() {
//   const location = useLocation();
//   if (HIDE_NAVBAR.some(r => location.pathname.startsWith(r))) return null;
//   return <Navbar />;
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <AdminAuthProvider>
//         <AuthProvider>
//           <BookingProvider>
//             <NavbarWrapper />

//             <Routes>
//               {/* ── User Routes ── */}
//               <Route path="/" element={<FilmShowCase />} />
//               <Route path="/movie/:id" element={<MovieDetails />} />
//               <Route path="/seat-selection" element={<SeatSelection />} />
//               <Route path="/my-ticket" element={<MyTicket />} />
//               <Route path="/sign-in" element={<SignIn />} />
//               <Route path="/sign-up" element={<SignUp />} />

//               {/* ── Admin Public (login page) ── */}
//               <Route path="/admin" element={<AdminPublicRoute />}>
//                 <Route path="login" element={<AdminLogin />} />
//               </Route>

//               {/* ── Admin Protected ── */}
//               <Route path="/admin" element={<AdminLayout />}>
//                 <Route path="dashboard" element={<AdminDashboard />} />
//                 <Route path="movies" element={<AdminMovies />} />
//                 <Route path="bookings" element={<AdminBookings />} />
//                 <Route path="users" element={<AdminUsers />} />
//               </Route>
//             </Routes>

//             <Toaster
//               position="top-right"
//               toastOptions={{
//                 style: {
//                   background: '#16161f',
//                   color: '#f0edf6',
//                   border: '1px solid rgba(255,255,255,0.08)',
//                   fontFamily: "'DM Sans', sans-serif",
//                   fontSize: '0.9rem',
//                 },
//                 success: { iconTheme: { primary: '#06d6a0', secondary: '#16161f' } },
//                 error: { iconTheme: { primary: '#e63946', secondary: '#16161f' } },
//               }}
//             />
//           </BookingProvider>
//         </AuthProvider>
//       </AdminAuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// User contexts
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

// Admin context
import { AdminAuthProvider } from './context/AdminAuthContext';

// Admin layout guards
import { AdminLayout, AdminPublicRoute } from './components/Admin/AdminLayout/index';

// User components
import Navbar from './components/Navbar/index';

// User pages
import FilmShowCase from './Pages/FilmShowCase/FilmShowCase';
import MovieDetails from './Pages/MovieDetails/MovieDetails';
import SeatSelection from './Pages/SeatSelection/SeatSelection';
import MyTicket from './Pages/MyTicket/MyTicket';
import SignIn from './Pages/SignIn/SignIn';
import SignUp from './Pages/SignUp/SignUp';

// Admin pages
import AdminLogin from './Pages/Admin/Login/index';
import AdminDashboard from './Pages/Admin/Dashboard/index';
import AdminMovies from './Pages/Admin/Movies/index';
import AdminBookings from './Pages/Admin/Bookings/index';
import AdminUsers from './Pages/Admin/Users/index';

const HIDE_NAVBAR = ['/sign-in', '/sign-up', '/admin'];

function NavbarWrapper() {
  const location = useLocation();
  if (HIDE_NAVBAR.some(r => location.pathname.startsWith(r))) return null;
  return <Navbar />;
}

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <AuthProvider>
          <BookingProvider>
            <NavbarWrapper />

            <Routes>
              {/* ── User Routes ── */}
              <Route path="/" element={<FilmShowCase />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/seat-selection" element={<SeatSelection />} />
              <Route path="/my-ticket" element={<MyTicket />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />

              {/* ── Admin Public (login — no auth needed) ── */}
              <Route path="/admin" element={<AdminPublicRoute />}>
                <Route path="login" element={<AdminLogin />} />
              </Route>

              {/* ── Admin Protected ── */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="movies" element={<AdminMovies />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
            </Routes>

            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#16161f',
                  color: '#f0edf6',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.9rem',
                },
                success: { iconTheme: { primary: '#06d6a0', secondary: '#16161f' } },
                error: { iconTheme: { primary: '#e63946', secondary: '#16161f' } },
              }}
            />
          </BookingProvider>
        </AuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;