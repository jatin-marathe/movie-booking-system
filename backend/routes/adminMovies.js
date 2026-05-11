const express = require('express');
const Movie = require('../models/Movie');
const { protectAdmin } = require('../middleware/adminAuth');
const router = express.Router();

// All routes protected
router.use(protectAdmin);

// GET /api/admin/movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.json({ movies, total: movies.length });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/admin/movies
router.post('/', async (req, res) => {
    try {
        const { title, image, banner, genre, duration, rating, description, releaseYear, language, director, cast, theaters, isTrending, isRecommended } = req.body;
        if (!title || !image || !duration || !description || !releaseYear)
            return res.status(400).json({ message: 'title, image, duration, description and releaseYear are required' });

        const movie = await Movie.create({
            title, image, banner, genre, duration, rating, description,
            releaseYear, language, director, cast, theaters, isTrending, isRecommended
        });
        res.status(201).json({ movie });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/admin/movies/:id
router.put('/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json({ movie });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/admin/movies/:id
router.delete('/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json({ message: 'Movie deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
