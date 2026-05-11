const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    banner: { type: String },
    genre: [{ type: String }],
    duration: { type: Number, required: true }, // minutes
    rating: { type: Number, min: 0, max: 10, default: 0 },
    description: { type: String, required: true },
    releaseYear: { type: Number, required: true },
    language: { type: String, default: 'English' },
    cast: [{ name: String, role: String }],
    director: { type: String },
    isTrending: { type: Boolean, default: false },
    isRecommended: { type: Boolean, default: false },
    theaters: [{
        name: String,
        location: String,
        times: [String]
    }]
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
