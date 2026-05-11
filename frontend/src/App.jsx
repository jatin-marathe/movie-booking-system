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