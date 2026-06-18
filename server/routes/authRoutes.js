const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const Settings = require('../models/Settings');
const Notification = require('../models/Notification');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --- HELPER FUNCTION: GENERATE COOKIE ---
const generateTokenAndCookie = (res, userId, role) => {
  const token = jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET || 'secretkey123',
    { expiresIn: '30d' }
  );

  const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
  res.cookie('token', token, {
    httpOnly: true, // Prevents XSS attacks (JS cannot read it)
    secure: isProd, // Requires HTTPS in production
    sameSite: isProd ? 'none' : 'lax', // 'none' required for cross-domain cookies
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
};

// --- 1. REGISTER ROUTE ---
router.post('/register', async (req, res) => {
  try {
    const settings = await Settings.findOne({ configId: 'global_config' });

    if (settings) {
      if (settings.maintenanceMode) return res.status(503).json({ message: "Platform is under maintenance." });
      if (req.body.role === 'tutor' && !settings.allowTutorRegistrations) return res.status(403).json({ message: "Tutor registrations closed." });
    }

    const { name, email, password, role, headline, bio, skills } = req.body;

    // We must ensure manual registration provides a password
    if (!password) return res.status(400).json({ message: "Password is required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name, email, password: hashedPassword, role: role || 'student',
      headline: role === 'tutor' ? headline : undefined,
      bio: role === 'tutor' ? bio : undefined,
      skills: role === 'tutor' ? skills : undefined,
    });

    await newUser.save();

    const roleMessage = role === 'tutor'
      ? "Welcome to LearnHub! Head over to the Creator Studio."
      : "Welcome to LearnHub! Explore the catalog to start learning.";

    Notification.create({ user: newUser._id, title: "Welcome aboard! 🚀", message: roleMessage, type: "system" }).catch(console.error);

    // Automatically log them in after registration
    generateTokenAndCookie(res, newUser._id, newUser.role);

    res.status(201).json({
      message: "Registered successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, profilePic: newUser.profilePicture }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 2. GOOGLE TUTOR REGISTRATION ROUTE ---
router.post('/google-tutor-register', async (req, res) => {
  try {
    const { credential, headline, bio, skills } = req.body;
    
    // Verify the Google Token
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID, 
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    const settings = await Settings.findOne({ configId: 'global_config' });
    
    // Check maintenance mode and if tutor registrations are open
    if (settings) {
      if (settings.maintenanceMode) return res.status(503).json({ message: "Platform under maintenance." });
      if (!settings.allowTutorRegistrations) return res.status(403).json({ message: "Tutor registrations are closed." });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (user.isActive === false) return res.status(403).json({ message: "Account suspended." });
      
      // If they exist but want to upgrade to a tutor, update their role and info
      if (user.role !== 'tutor') {
        user.role = 'tutor';
        user.headline = headline;
        user.bio = bio;
        user.skills = skills;
      }
      
      // Link Google ID if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePicture = user.profilePicture || picture;
      }
      
      await user.save();
    } else {
      // Create brand new tutor account
      user = await User.create({
        name,
        email,
        googleId,
        role: 'tutor', // Explicitly set role
        headline,
        bio,
        skills,
        profilePicture: picture
      });

      Notification.create({
        user: user._id,
        title: "Welcome aboard! 🚀",
        message: "Welcome to LearnHub! Head over to the Creator Studio to build your first course.",
        type: "system"
      }).catch(console.error);
    }

    // Generate secure HTTP-Only Cookie
    generateTokenAndCookie(res, user._id, user.role);

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, profilePic: user.profilePicture }
    });

  } catch (err) {
    res.status(500).json({ message: "Google Tutor Registration failed. " + err.message });
  }
});

// --- 3. LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const settings = await Settings.findOne({ configId: 'global_config' });

    if (settings && settings.maintenanceMode) {
      if (user && user.role !== 'admin') return res.status(503).json({ message: "Platform under maintenance." });
    }

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isActive === false) return res.status(403).json({ message: "Account suspended." });

    // Handle Google users trying to log in with a password
    if (!user.password && user.googleId) {
      return res.status(400).json({ message: "Please log in using Google." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT and attach to Cookie
    generateTokenAndCookie(res, user._id, user.role);

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, profilePic: user.profilePicture }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 4. GOOGLE LOGIN ROUTE ---
router.post('/google-login', async (req, res) => {
  try {
    const { credential } = req.body;

    // Verify the Google Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    const settings = await Settings.findOne({ configId: 'global_config' });
    if (settings && settings.maintenanceMode) {
      return res.status(503).json({ message: "Platform under maintenance." });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (user.isActive === false) return res.status(403).json({ message: "Account suspended." });

      // If user exists but doesn't have googleId mapped yet, link it
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePicture = user.profilePicture || picture;
        await user.save();
      }
    } else {
      // Create new student account automatically
      user = await User.create({
        name,
        email,
        googleId,
        role: 'student', // Force Google signups to be students
        profilePicture: picture
      });

      Notification.create({
        user: user._id,
        title: "Welcome aboard! 🚀",
        message: "Welcome to LearnHub! We're thrilled to have you.",
        type: "system"
      }).catch(console.error);
    }

    // Generate Cookie
    generateTokenAndCookie(res, user._id, user.role);

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, profilePic: user.profilePicture }
    });

  } catch (err) {
    res.status(500).json({ message: "Google Authentication failed. " + err.message });
  }
});

// --- 5. LOGOUT ROUTE ---
router.post('/logout', (req, res) => {
  const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  }); // Destroys the HTTP-Only cookie
  res.status(200).json({ message: 'Logged out successfully' });
});

// --- 6. GET CURRENT USER PROFILE (Protected) ---
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('enrolledCourses');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 7. UPDATE USER PROFILE (Protected) ---
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