// server/routes/progressRoutes.js
const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Course = require('../models/Course'); 
const User = require('../models/User');     
const { protect } = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');

// 1. GET ALL PROGRESS FOR USER (For MyLearning Page)
router.get('/all', protect, async (req, res) => {
  try {
    const allProgress = await Progress.find({ userId: req.user.id });
    res.json(allProgress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. GET PROGRESS (Check which lessons are done)
router.get('/:courseId', protect, async (req, res) => {
  try {
    let progress = await Progress.findOne({ 
      userId: req.user.id, 
      courseId: req.params.courseId 
    });

    if (!progress) {
      return res.json({ completedLessons: [] });
    }

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. MARK LESSON AS COMPLETED
router.post('/mark-complete', protect, async (req, res) => {
  const { courseId, lessonId } = req.body;

  try {
    // 1. Find existing progress or create new one
    let progress = await Progress.findOne({ 
      userId: req.user.id, 
      courseId: courseId 
    });

    if (!progress) {
      progress = new Progress({
        userId: req.user.id,
        courseId: courseId,
        completedLessons: []
      });
    }

    // 2. Add lessonId if not already there
    let isNewlyCompleted = false;
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      await progress.save();
      isNewlyCompleted = true; // Flag to trigger course completion check
    }

    // 3. Check if the entire course is now complete
    if (isNewlyCompleted) {
      const course = await Course.findById(courseId);
      
      // Compare watched lessons vs total course lessons
      if (course && course.lessons && progress.completedLessons.length === course.lessons.length) {
        
        const user = await User.findById(req.user.id);
        
        // Prevent duplicates in the completedCourses array
        if (user && !user.completedCourses.includes(courseId)) {
          user.completedCourses.push(courseId);
          await user.save();

          // Notification is now INSIDE the exact moment they finish the final lesson!
          // We also removed 'await' so it doesn't slow down the video player moving to the next screen.
          Notification.create({
            user: req.user.id,
            title: "Course Completed! 🏆",
            message: `You just mastered "${course.title}". Check your profile to view your certificate!`,
            type: "achievement"
          }).catch(err => console.error("Notification Error:", err));
        }
      }
    }

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;