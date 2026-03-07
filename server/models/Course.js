const mongoose = require('mongoose');

// Define Lesson Schema separately (if it's not already)
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  
  // NEW: Distinguish between Video and Quiz
  type: { 
    type: String, 
    enum: ['video', 'quiz'], 
    default: 'video' 
  },

  // For Video Lessons
  videoUrl: { type: String }, 
  duration: { type: Number }, // in seconds

  // For Quiz Lessons
  questions: [{
    question: { type: String },
    options: [{ type: String }], // Array of 4 strings
    correctAnswer: { type: Number } // Index (0, 1, 2, or 3)
  }]
});

const courseSchema = new mongoose.Schema({
  // ... existing fields (title, description, price, tutor, etc.) ...
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, default: 0 },
  thumbnail: { type: String },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  // Embed the updated Lesson Schema
  lessons: [lessonSchema], 

  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);