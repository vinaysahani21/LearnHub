const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware'); 

// --- 1. REGISTER ROUTE ---
router.post('/register', async (req, res) => {
  try {
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
    if (!user) return res.status(404).json({ message: "User not found" });

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
        role: user.role
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
        skills: updatedUser.skills
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;