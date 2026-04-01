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
  profilePicture: { type: String }, 

  // --- NEW FIELDS FOR TUTORS ONLY ---
  headline: { type: String }, 
  bio: { type: String },
  skills: [{ type: String }], 
  isActive: {
    type: Boolean,
    default: true
  },

  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  
  completedLessons: [{ 
    type: mongoose.Schema.Types.ObjectId, 
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);