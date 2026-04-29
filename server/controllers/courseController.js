const Course = require('../models/Course');
const cloudinary = require('../utils/cloudinary');

// @desc    Add a lesson (Video or Quiz) to a course
// @route   POST /api/courses/:id/lessons
// @access  Private (Tutor only)
exports.addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.tutor.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this course' });
    }

    const { title, type, questions } = req.body;

    if (type === 'quiz') {
      // === QUIZ LOGIC (Unchanged) ===
      if (!questions || questions.length === 0) {
        return res.status(400).json({ message: "Quiz must have at least one question." });
      }

      const newLesson = {
        title,
        type: 'quiz',
        questions: questions, 
        videoUrl: null,       
        duration: 0
      };

      course.lessons.push(newLesson);
      await course.save();
      return res.status(201).json(course);

    } else {
      // === VIDEO LOGIC (Cloudinary Integration) ===
      if (!req.file) {
        return res.status(400).json({ message: "Please upload a video file." });
      }

      // 1. Create an upload stream to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video", // MUST specify 'video' for mp4 files
          folder: "learnhub/lessons", // Keeps your Cloudinary dashboard organized
        },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return res.status(500).json({ message: "Video upload failed", error: error.message });
          }

          // 2. Cloudinary succeeded! Create the lesson with the secure URL
          const newLesson = {
            title,
            type: 'video',
            videoUrl: result.secure_url, 
            questions: [] 
          };

          // 3. Save to database
          course.lessons.push(newLesson);
          await course.save();

          return res.status(201).json(course);
        }
      );

      // 4. Feed the file buffer from RAM into the Cloudinary stream
      uploadStream.end(req.file.buffer);
    }

  } catch (err) {
    console.error("Error adding lesson:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};