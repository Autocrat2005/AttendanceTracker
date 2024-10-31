const express = require('express');
const jwt = require('jsonwebtoken');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.userId = user.userId;
        next();
    });
};

// Record attendance
router.post('/', authenticateToken, async (req, res) => {
    const { status } = req.body;
    const date = new Date().toISOString().slice(0, 10); // Set date to today's date

    try {
        const attendance = new Attendance({
            userId: req.userId,
            date,
            status
        });
        await attendance.save();
        res.status(201).json({ message: 'Attendance recorded successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Could not record attendance' });
    }
});

// Get attendance records for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find({ userId: req.userId });
        res.json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ error: 'Could not retrieve attendance records' });
    }
});

module.exports = router;
