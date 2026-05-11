const express = require('express');
const Movie = require('../models/Movie');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { protectAdmin } = require('../middleware/adminAuth');
const router = express.Router();

router.use(protectAdmin);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
    try {
        const [totalMovies, totalBookings, totalUsers, revenueData] = await Promise.all([
            Movie.countDocuments(),
            Booking.countDocuments({ status: 'confirmed' }),
            User.countDocuments(),
            Booking.aggregate([
                { $match: { status: 'confirmed' } },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } }
            ])
        ]);

        // Bookings per day for last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyBookings = await Booking.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo }, status: 'confirmed' } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalPrice' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Top movies by booking count
        const topMovies = await Booking.aggregate([
            { $match: { status: 'confirmed' } },
            { $group: { _id: '$movieId', bookings: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
            { $sort: { bookings: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'movies', localField: '_id', foreignField: '_id', as: 'movie' } },
            { $unwind: '$movie' },
            { $project: { bookings: 1, revenue: 1, 'movie.title': 1, 'movie.image': 1 } }
        ]);

        res.json({
            stats: {
                totalMovies,
                totalBookings,
                totalUsers,
                totalRevenue: revenueData[0]?.total || 0,
            },
            dailyBookings,
            topMovies,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/admin/bookings
router.get('/bookings', async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const bookings = await Booking.find()
            .populate('userId', 'name email')
            .populate('movieId', 'title image')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const total = await Booking.countDocuments();
        res.json({ bookings, total, pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({ users, total: users.length });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
