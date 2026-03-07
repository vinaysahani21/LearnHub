const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'tutor', 'admin'],
    default: 'student'
  },

  // --- NEW FIELDS FOR TUTORS ONLY ---
  headline: { type: String }, // e.g. "Senior React Developer"
  bio: { type: String },
  skills: [{ type: String }], // e.g. ["Python", "Data Science"]

  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);