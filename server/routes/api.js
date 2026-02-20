const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const User = require('../models/User');

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

    // Score is percentage of required skills the user has (max 100%)
    const matchScore = Math.round((matchCount / internshipSkills.length) * 100);

    return { matchScore, missingSkills };
};

// --- ROUTES ---

// 1. Get Internships tailored to User
// Query Params: ?uuid=user_123
router.get('/internships', async (req, res) => {
    try {
        const { uuid } = req.query;
        let internships = await Internship.find().lean(); // .lean() returns plain JS objects

        if (uuid) {
            const user = await User.findOne({ uuid });
            if (user) {
                // Filter by Domain (Primary requirement)
                internships = internships.filter(job => job.domain === user.domain);

                // Filter by Work Preference
                if (user.preference !== 'Any') {
                    internships = internships.filter(job =>
                        job.preference === user.preference || job.preference === 'Hybrid'
                    );
                }

                // Calculate Skill Match Score and Missing Skills
                internships = internships.map(job => {
                    const matchInfo = calculateMatch(job.skills, user.skills);

                    // Add isNew badge logic (posted within last 48 hours)
                    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
                    const isNew = job.postedAt > twoDaysAgo;

                    // Check if saved by this user
                    const isSaved = user.savedInternships.some(id => id.toString() === job._id.toString());

                    return {
                        ...job,
                        matchScore: matchInfo.matchScore,
                        missingSkills: matchInfo.missingSkills,
                        isNew,
                        isSaved
                    };
                });

                // Sort by highest match score descending
                internships.sort((a, b) => b.matchScore - a.matchScore);
            }
        }

        res.json(internships);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Create or Update User Profile
router.post('/users', async (req, res) => {
    try {
        const { uuid, name, domain, skills, preference } = req.body;

        let user = await User.findOne({ uuid });

        if (user) {
            // Update
            user.name = name;
            user.domain = domain;
            user.skills = skills;
            user.preference = preference;
            await user.save();
        } else {
            // Create
            user = new User({ uuid, name, domain, skills, preference });
            await user.save();
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Toggle Save Internship for User
router.post('/users/:uuid/save', async (req, res) => {
    try {
        const { uuid } = req.params;
        const { internshipId } = req.body;

        const user = await User.findOne({ uuid });
        if (!user) return res.status(404).json({ error: "User not found" });

        const index = user.savedInternships.indexOf(internshipId);
        let action = '';

        if (index > -1) {
            // Unsave
            user.savedInternships.splice(index, 1);
            action = 'unsaved';
        } else {
            // Save
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
