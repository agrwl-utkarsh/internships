const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const User = require('../models/User');
const { protect, optionalAuth } = require('../middleware/auth');

// --- HELPER: Advanced Matching Logic ---
const calculateMatch = (internshipSkills, userSkills) => {
    if (!userSkills || userSkills.length === 0) {
        return { matchScore: 0, missingSkills: internshipSkills };
    }

    let matchCount = 0;
    let missingSkills = [];

    internshipSkills.forEach(reqSkill => {
        if (userSkills.includes(reqSkill)) {
            matchCount++;
        } else {
            missingSkills.push(reqSkill);
        }
    });

    const matchScore = Math.round((matchCount / internshipSkills.length) * 100);
    return { matchScore, missingSkills };
};

// --- ROUTES ---

// 1. Get Internships (optional auth for personalized matches)
router.get('/internships', optionalAuth, async (req, res) => {
    try {
        let internships = await Internship.find().lean();
        const user = req.user; // from optionalAuth

        if (user) {
            internships = internships.filter(job => job.domain === user.domain);

            if (user.preference !== 'Any') {
                internships = internships.filter(job =>
                    job.preference === user.preference || job.preference === 'Hybrid'
                );
            }

            internships = internships.map(job => {
                const matchInfo = calculateMatch(job.skills, user.skills);
                const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
                const isNew = job.postedAt > twoDaysAgo;
                const isSaved = user.savedInternships.some(id => id.toString() === job._id.toString());

                return {
                    ...job,
                    matchScore: matchInfo.matchScore,
                    missingSkills: matchInfo.missingSkills,
                    isNew,
                    isSaved
                };
            });

            internships.sort((a, b) => b.matchScore - a.matchScore);
        } else {
            // For unauthenticated users, just add the new badge
            internships = internships.map(job => {
                const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
                return { ...job, isNew: job.postedAt > twoDaysAgo };
            });
        }

        res.json(internships);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Update User Profile (Protected)
router.put('/users/profile', protect, async (req, res) => {
    try {
        const { name, domain, skills, preference } = req.body;
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = name || user.name;
            user.domain = domain || user.domain;
            user.skills = skills || user.skills;
            user.preference = preference || user.preference;

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Toggle Save Internship for User (Protected)
router.post('/users/save', protect, async (req, res) => {
    try {
        const { internshipId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ error: "User not found" });

        const index = user.savedInternships.indexOf(internshipId);
        let action = '';

        if (index > -1) {
            user.savedInternships.splice(index, 1);
            action = 'unsaved';
        } else {
            user.savedInternships.push(internshipId);
            action = 'saved';
        }

        await user.save();
        res.json({ message: `Internship ${action} successfully`, savedInternships: user.savedInternships });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
