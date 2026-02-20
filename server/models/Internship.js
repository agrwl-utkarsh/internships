const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    domain: { type: String, required: true },
    skills: { type: [String], required: true },
    preference: { type: String, required: true, enum: ['Remote', 'On-site', 'Hybrid', 'Any'] },
    location: { type: String, required: true },
    deadline: { type: Date, required: true },
    logoColor: { type: String },
    logoText: { type: String },
    postedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const Internship = mongoose.model('Internship', internshipSchema);
module.exports = Internship;
