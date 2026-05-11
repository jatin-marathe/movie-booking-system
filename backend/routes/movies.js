const express = require('express');
const Movie = require('../models/Movie');
const router = express.Router();

// GET /api/movies  (supports ?search=&genre=&trending=&recommended=)
router.get('/', async (req, res) => {
  try {
    const { search, genre, trending, recommended } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (genre) filter.genre = { $in: [genre] };
    if (trending === 'true') filter.isTrending = true;
    if (recommended === 'true') filter.isRecommended = true;

    const movies = await Movie.find(filter).sort({ createdAt: -1 });
    res.json({ movies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/movies/:id
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json({ movie });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
