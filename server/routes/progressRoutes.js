const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const { protect } = require('../middleware/authMiddleware');


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
      // Return empty progress if none exists
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
    // Find existing progress or create new one
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

    // Add lessonId if not already there
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      await progress.save();
    }

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;