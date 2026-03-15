const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Course = require('../models/Course');

// ==========================================
// GET STUDENT DASHBOARD DATA
// ==========================================
router.get('/dashboard-data', protect, async (req, res) => {
  try {
    // 1. Fetch the user and populate their enrolled courses
    const user = await User.findById(req.user._id).populate({
      path: 'enrolledCourses',
      select: 'title description thumbnail category price lessons',
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const courses = user.enrolledCourses || [];

    // 2. Calculate Stats (Assuming you track progress. If you have a separate Progress model, you'd query it here. 
    // For this example, we'll calculate base stats from the courses array).
    
    // In a fully built app, you'd check a 'completedLessons' array per course.
    // We'll simulate the stat calculation structure here so your UI has data to consume.
    const stats = {
      activeCourses: courses.length,
      completedCourses: 0, // Update this based on your actual completion logic
      learningHours: courses.reduce((acc, curr) => acc + (curr.lessons?.length || 0) * 0.5, 0) // Est 30 mins per lesson
    };

    // 3. Format the courses to include a simulated 'progress' percentage for the UI
    // (Replace the '0' with actual database progress calculations when you build the video player)
    const formattedCourses = courses.map(course => ({
      ...course._doc,
      progress: 0 // e.g., (user.completedLessons.length / course.lessons.length) * 100
    }));

    res.json({
      stats,
      recentCourses: formattedCourses.slice(0, 3), // Show top 3 recent
      heroCourse: formattedCourses[0] || null // The course they should resume
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;