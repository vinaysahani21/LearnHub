const Course = require('../models/Course');

// @desc    Add a lesson (Video or Quiz) to a course
// @route   POST /api/courses/:id/lessons
// @access  Private (Tutor only)
exports.addLesson = async (req, res) => {
  try {
    // 1. Find the course
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // 2. Authorization Check (Only the Course Owner can add lessons)
    if (course.tutor.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this course' });
    }

    // 3. Extract Data
    // Note: If it's a video upload, req.body fields come from Multer.
    // If it's a quiz (JSON), req.body comes from express.json().
    const { title, type, questions } = req.body;

    // 4. Logic Switch based on Lesson Type
    let newLesson = {};

    if (type === 'quiz') {
      // === QUIZ LOGIC ===
      // Validate that questions exist
      if (!questions || questions.length === 0) {
        return res.status(400).json({ message: "Quiz must have at least one question." });
      }

      newLesson = {
        title,
        type: 'quiz',
        questions: questions, // Store the array of questions
        videoUrl: null,       // No video for quizzes
        duration: 0
      };

    } else {
      // === VIDEO LOGIC (Default) ===
      // Validate that a file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: "Please upload a video file." });
      }

      // Construct the file path (Assuming you are using local storage)
      // If you are using Cloudinary/S3, use req.file.path instead
      const videoPath = `/uploads/${req.file.filename}`;

      newLesson = {
        title,
        type: 'video',
        videoUrl: videoPath,
        questions: [] // No questions for videos
      };
    }

    // 5. Save to Database
    course.lessons.push(newLesson);
    await course.save();

    res.status(201).json(course);

  } catch (err) {
    console.error("Error adding lesson:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};