const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const bookingSchema = new mongoose.Schema({
    bookingId: { type: String, default: () => 'BK' + uuidv4().replace(/-/g, '').substring(0, 10).toUpperCase(), unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theater: { type: String, required: true },
    seats: [{ type: String, required: true }], // e.g. ["A1", "A2"]
    date: { type: String, required: true }, // "2025-08-10"
    time: { type: String, required: true }, // "7:00 PM"
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
}, { timestamps: true });

// Compound index to make seat lookups fast
bookingSchema.index({ movieId: 1, theater: 1, date: 1, time: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
