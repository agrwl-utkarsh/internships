const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uuid: { type: String, required: true, unique: true }, // Simple auth: we'll use a local UUID for MVP
    name: { type: String, required: true },
    domain: { type: String, required: true },
    skills: { type: [String], default: [] },
    preference: { type: String, default: 'Any' },
    savedInternships: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Internship' }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
