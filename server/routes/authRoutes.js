const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const Settings = require('../models/Settings');
const Notification = require('../models/Notification');

// --- 1. REGISTER ROUTE ---
router.post('/register', async (req, res) => {
  try {
    // Fetch global settings
    const settings = await Settings.findOne({ configId: 'global_config' });

    if (settings) {
      // Enforce Maintenance Mode (Block all new registrations)
      if (settings.maintenanceMode) {
        return res.status(503).json({ message: "Platform is currently under maintenance. Please try again later." });
      }

      // Enforce Tutor Registration Toggle
      if (req.body.role === 'tutor' && !settings.allowTutorRegistrations) {
        return res.status(403).json({ message: "Tutor registrations are currently closed by the Administrator." });
      }
    }

    // Destructure new fields
    const { name, email, password, role, headline, bio, skills } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      // Save tutor specific info if provided
      headline: role === 'tutor' ? headline : undefined,
      bio: role === 'tutor' ? bio : undefined,
      skills: role === 'tutor' ? skills : undefined,
    });

    await newUser.save();

    // 🔥 INJECTED: WELCOME NOTIFICATION 🔥
    const roleSpecificMessage = role === 'tutor' 
      ? "Welcome to LearnHub! Head over to the Creator Studio to build your first course."
      : "Welcome to LearnHub! We're thrilled to have you. Explore the catalog to start learning.";

    Notification.create({
      user: newUser._id,
      title: "Welcome aboard! 🚀",
      message: roleSpecificMessage,
      type: "system"
    }).catch(err => console.error("Notification Error:", err));

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 2. LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    
    // Fetch global settings
    const settings = await Settings.findOne({ configId: 'global_config' });

    if (settings && settings.maintenanceMode) {
      // Allow Admins to bypass maintenance mode so they don't lock themselves out!
      if (user && user.role !== 'admin') {
        return res.status(503).json({ message: "Platform is currently under maintenance. Please try again later." });
      }
    }

    if (!user) return res.status(404).json({ message: "User not found" });
    
    if (user && user.isActive === false) {
      return res.status(403).json({ message: "Your account has been suspended by an Administrator." });
    }

    // Validate Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate Token (The Digital ID Card)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secretkey123', // Use .env in production
      { expiresIn: '1d' }
    );

    // Send back the token and user info (but NOT the password)
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePicture // Add this so the frontend has their avatar instantly!
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    // Find user and POPULATE the course details
    const user = await User.findById(req.user.id).populate('enrolledCourses');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. UPDATE USER PROFILE (Protected)
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      // Update fields if they are sent in the body
      user.name = req.body.name || user.name;
      user.headline = req.body.headline || user.headline;
      user.bio = req.body.bio || user.bio;
      
      // Update profile picture if provided
      if (req.body.profilePic !== undefined) {
        user.profilePicture = req.body.profilePic;
      }

      // If user is a tutor, they might update skills
      if (req.body.skills) {
        user.skills = req.body.skills.split(',').map(skill => skill.trim());
      }

      const updatedUser = await user.save();

      // Return new user data (excluding password)
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        headline: updatedUser.headline,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        profilePic: updatedUser.profilePicture
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;