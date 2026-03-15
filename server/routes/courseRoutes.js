const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect, tutorOnly } = require('../middleware/authMiddleware'); 
const upload = require('../utils/localUpload'); 
const Comment = require('../models/Comment'); 

// 1. GET ALL PUBLIC COURSES
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).populate('tutor', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. GET TUTOR'S COURSES
router.get('/my-courses', protect, tutorOnly, async (req, res) => {
  try {
    const courses = await Course.find({ tutor: req.user.id });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. CREATE COURSE
router.post('/', protect, tutorOnly, upload.single('thumbnail'), async (req, res) => {
  try {
    let thumbnailUrl = '';
    if (req.file) {
      thumbnailUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const newCourse = new Course({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      thumbnail: thumbnailUrl, 
      tutor: req.user.id
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. GET SINGLE COURSE
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('tutor', 'name bio headline');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. ENROLL IN COURSE (Fixed)
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    // 1. Get User AND Course
    const user = await require('../models/User').findById(userId);
    const course = await Course.findById(courseId); // <--- Added this

    if (!course) return res.status(404).json({ message: "Course not found" });

    // 2. Check if already enrolled
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: "You are already enrolled in this course" });
    }

    // 3. Update BOTH User and Course
    user.enrolledCourses.push(courseId);
    course.enrolledStudents.push(userId); // <--- CRITICAL FIX: Add student to course

    // 4. Save both (Parallel save is faster)
    await Promise.all([user.save(), course.save()]);

    res.status(200).json({ message: "Enrollment successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 6. ADD LESSON (FIXED FOR QUIZZES) 
// ==========================================
router.post('/:id/lessons', protect, tutorOnly, upload.single('video'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Auth Check
    if (course.tutor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this course" });
    }

    const { title, type, questions } = req.body;

    // --- NEW LOGIC START ---

    // BRANCH A: QUIZ (No file check needed)
    if (type === 'quiz') {
      if (!questions || questions.length === 0) {
        return res.status(400).json({ message: "Quiz must have at least one question" });
      }

      course.lessons.push({
        title,
        type: 'quiz',
        questions: questions, // Frontend sends JSON questions
        videoUrl: null
      });
    }
    
    // BRANCH B: VIDEO (File check IS needed)
    else {
      if (!req.file) {
        return res.status(400).json({ message: "No video file uploaded" });
      }

      const fullUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

      course.lessons.push({
        title,
        type: 'video', // Default type
        videoUrl: fullUrl,
        publicId: req.file.filename,
        questions: []
      });
    }
    

    await course.save();
    res.status(201).json(course);

  } catch (err) {
    console.error("Add Lesson Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 7. TOGGLE COURSE STATUS
router.patch('/:id/status', protect, tutorOnly, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.tutor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    course.isActive = !course.isActive;
    await course.save();
    res.json({ message: `Course is now ${course.isActive ? 'Active' : 'Inactive'}`, isActive: course.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 8. GET COMMENTS
router.get('/:id/lessons/:lessonId/comments', protect, async (req, res) => {
  try {
    const comments = await Comment.find({ courseId: req.params.id, lessonId: req.params.lessonId })
      .populate('user', 'name')
      .populate('replies.user', 'name')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 9. POST COMMENT
router.post('/:id/lessons/:lessonId/comments', protect, async (req, res) => {
  try {
    const newComment = new Comment({
      courseId: req.params.id,
      lessonId: req.params.lessonId,
      user: req.user.id,
      text: req.body.text
    });
    const savedComment = await newComment.save();
    await savedComment.populate('user', 'name');
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id/lessons/:lessonId', protect, tutorOnly, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Security Check: Only the owner can delete lessons
    if (course.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this course' });
    }

    // Filter out the lesson to be deleted
    const initialLength = course.lessons.length;
    course.lessons = course.lessons.filter(
      (lesson) => lesson._id.toString() !== req.params.lessonId
    );

    if (course.lessons.length === initialLength) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    await course.save();
    res.json({ message: 'Lesson deleted successfully', lessons: course.lessons });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;