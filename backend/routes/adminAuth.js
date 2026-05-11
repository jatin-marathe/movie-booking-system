const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { protectAdmin } = require('../middleware/adminAuth');
const router = express.Router();

const signToken = (id) =>
    jwt.sign({ id }, process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/admin/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Email and password required' });

        const admin = await Admin.findOne({ email });
        if (!admin || !(await admin.comparePassword(password)))
            return res.status(401).json({ message: 'Invalid credentials' });

        const token = signToken(admin._id);
        res.json({ token, admin });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/admin/auth/me
router.get('/me', protectAdmin, (req, res) => {
    res.json({ admin: req.admin });
});

module.exports = router;
