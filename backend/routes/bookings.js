const express = require('express');
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const { protect } = require('../middleware/auth');
const router = express.Router();

// POST /api/bookings/book-seat
router.post('/book-seat', protect, async (req, res) => {
    try {
        const { movieId, theater, seats, date, time, totalPrice } = req.body;
        if (!movieId || !theater || !seats?.length || !date || !time || !totalPrice)
            return res.status(400).json({ message: 'All booking fields are required' });

        // Check if any of the requested seats are already booked for this show
        const existing = await Booking.findOne({
            movieId, theater, date, time,
            seats: { $in: seats },
            status: 'confirmed'
        });
        if (existing) return res.status(409).json({ message: 'One or more selected seats are already booked' });

        const booking = await Booking.create({
            userId: req.user._id,
            movieId, theater, seats, date, time, totalPrice
        });

        const populated = await booking.populate('movieId', 'title image genre duration rating');
        res.status(201).json({ booking: populated });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/bookings/my-bookings
router.get('/my-bookings', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id, status: 'confirmed' })
            .populate('movieId', 'title image genre duration rating')
            .sort({ createdAt: -1 });
        res.json({ bookings });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/bookings/booked-seats?movieId=&theater=&date=&time=
router.get('/booked-seats', async (req, res) => {
    try {
        const { movieId, theater, date, time } = req.query;
        if (!movieId || !theater || !date || !time)
            return res.status(400).json({ message: 'movieId, theater, date, and time are required' });

        const bookings = await Booking.find({ movieId, theater, date, time, status: 'confirmed' });
        const bookedSeats = bookings.flatMap(b => b.seats);
        res.json({ bookedSeats });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/bookings/:id (cancel)
router.delete('/:id', protect, async (req, res) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        booking.status = 'cancelled';
        await booking.save();
        res.json({ message: 'Booking cancelled' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
