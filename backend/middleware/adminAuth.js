const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protectAdmin = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) return res.status(401).json({ message: 'Not authorised' });

        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id).select('-password');
        if (!admin) return res.status(401).json({ message: 'Admin not found' });

        req.admin = admin;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid admin token' });
    }
};

module.exports = { protectAdmin };
