require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// User routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const bookingRoutes = require('./routes/bookings');

// Admin routes
const adminAuthRoutes = require('./routes/adminAuth');
const adminMovieRoutes = require('./routes/adminMovies');
const adminStatsRoutes = require('./routes/adminStats');

const app = express();

// Middleware
app.use(cors({ origin: 'https://eliteshow.netlify.app' || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ── User API ──────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);

// ── Admin API ─────────────────────────────────────────────────────
app.use('/api/admin/auth', adminAuthRoutes);   // login, me
app.use('/api/admin/movies', adminMovieRoutes);  // CRUD movies
app.use('/api/admin', adminStatsRoutes);  // /stats, /bookings, /users

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch(err => { console.error('❌ DB connection failed:', err.message); process.exit(1); });
