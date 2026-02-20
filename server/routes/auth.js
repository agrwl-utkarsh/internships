const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, domain, skills, preference } = req.body;

        if (!name || !email || !password || !domain) {
            return res.status(400).json({ error: 'Please add all required fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            domain,
            skills: skills || [],
            preference: preference || 'Any'
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                domain: user.domain,
                skills: user.skills,
                preference: user.preference,
                token: generateToken(user._id),
                savedInternships: user.savedInternships
            });
        } else {
            res.status(400).json({ error: 'Invalid user data' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate a user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                domain: user.domain,
                skills: user.skills,
                preference: user.preference,
                token: generateToken(user._id),
                savedInternships: user.savedInternships
            });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   GET /api/auth/me
// @desc    Get user data
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
