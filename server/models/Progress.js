const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  
  // Array of lessons the user has COMPLETED
  completedLessons: [{ type: String }], 
  
  // Optional: Track specific timestamp for "Resume Watching" (e.g., 5:20)
  // For now, we will just track "Completed" vs "Not Completed"
}, { timestamps: true });

// Ensure a user has only one progress document per course
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);