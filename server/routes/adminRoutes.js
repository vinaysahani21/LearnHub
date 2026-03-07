const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Order = require('../models/Order'); // Ensure you have this model from payment setup
const { protect, adminOnly } = require('../middleware/authMiddleware');

// 1. GET DASHBOARD STATS
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTutors = await User.countDocuments({ role: 'tutor' });
    const totalCourses = await Course.countDocuments({});
    
    // Calculate Revenue
    const orders = await Order.find({ status: 'completed' });
    const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);

    res.json({
      totalStudents,
      totalTutors,
      totalCourses,
      totalRevenue
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. GET ALL USERS
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. DELETE USER (Ban)
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;