const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Course = require('../models/Course');
const Progress = require('../models/Progress'); 
const Notification = require('../models/Notification');


// ==========================================
// LOCAL MULTER CONFIGURATION
// ==========================================
// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save directly to server/uploads
  },
  filename: function (req, file, cb) {
    // Creates a clean, unique filename like: profile-12345abcde-1678901234.jpg
    cb(null, `profile-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// ==========================================
// POST: UPLOAD PROFILE PIC (LOCAL)
// ==========================================
router.post('/upload', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Construct the public URL using your existing static folder setup
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.status(200).json({
      message: 'Upload successful',
      url: fileUrl
    });

  } catch (error) {
    console.error('Local Upload Error:', error);
    res.status(500).json({ message: 'Server error during file upload', error: error.message });
  }
});

// ==========================================
// GET: STUDENT DASHBOARD DATA
// ==========================================
router.get('/dashboard-data', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'enrolledCourses',
      select: 'title description thumbnail category price lessons',
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const courses = user.enrolledCourses || [];
    
    // FIX 1: Search using 'userId' to match your Progress model
    const progressRecords = await Progress.find({ userId: req.user._id });
    
    const progressMap = {};
    progressRecords.forEach(record => {
       // FIX 2: Use 'courseId' to match your Progress model
       if (record.courseId) {
         progressMap[record.courseId.toString()] = record.completedLessons?.length || 0;
       }
    });

    // FIX 3: Pull completed courses directly from the User model!
    const completedCoursesCount = user.completedCourses?.length || 0;
    let totalCompletedLessons = 0;

    const formattedCourses = courses.map(course => {
      const totalLessons = course.lessons?.length || 0;
      const completedCount = progressMap[course._id.toString()] || 0;
      
      totalCompletedLessons += completedCount;
      
      let progressPercent = 0;
      if (totalLessons > 0) {
        progressPercent = Math.round((completedCount / totalLessons) * 100);
      }

      return {
        ...course._doc,
        progress: progressPercent,
        completedLessonsCount: completedCount,
        totalLessons
      };
    });

    const sortedCourses = formattedCourses.reverse();

    const stats = {
      activeCourses: courses.length - completedCoursesCount,
      completedCourses: completedCoursesCount,
      learningHours: (totalCompletedLessons * 0.5).toFixed(1) 
    };

    res.json({
      stats,
      recentCourses: sortedCourses.slice(0, 3), 
      heroCourse: sortedCourses[0] || null      
    });

  } catch (err) {
    console.error("Dashboard Data Error:", err);
    res.status(500).json({ message: 'Failed to load dashboard data', error: err.message });
  }
});

// ==========================================
// GET: ALL NOTIFICATIONS FOR USER
// ==========================================
router.get('/notifications', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20); // Get last 20 notifications
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
});

// ==========================================
// PATCH: MARK ALL NOTIFICATIONS AS READ
// ==========================================
router.patch('/notifications/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notifications', error: err.message });
  }
});

module.exports = router;