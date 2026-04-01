// server/routes/tutorRoutes.js
const express = require('express');
const router = express.Router();
const { protect, tutorOnly } = require('../middleware/authMiddleware');
const Payout = require('../models/Payout');
const Order = require('../models/Order');
const Course = require('../models/Course');
const Settings = require('../models/Settings');
const Notification = require('../models/Notification');

// ==========================================
// 1. GET TUTOR PAYOUTS & WALLET BALANCE
// ==========================================
router.get('/payouts', protect, tutorOnly, async (req, res) => {
  try {
    const tutorId = req.user._id;

    // 1. Calculate Total Net Earnings
    const courses = await Course.find({ tutor: tutorId });
    const courseIds = courses.map(c => c._id);
    
    const orders = await Order.find({ 
      course: { $in: courseIds },
      status: { $in: ['completed', 'paid'] } 
    });
    
    const grossRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const settings = await Settings.findOne({ configId: 'global_config' });
    const feePercent = settings ? settings.platformFeePercentage : 10;
    const totalNetEarnings = grossRevenue - (grossRevenue * (feePercent / 100));

    // 2. Fetch Payout History
    const payouts = await Payout.find({ tutor: tutorId }).sort({ createdAt: -1 });

    // 3. Calculate Available Balance
    // Subtract any payouts that are 'approved' or 'pending' (so they can't double-request)
    const withdrawnOrPendingAmount = payouts
      .filter(p => p.status === 'approved' || p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
      
    const availableBalance = totalNetEarnings - withdrawnOrPendingAmount;

    res.json({
      balance: availableBalance > 0 ? availableBalance : 0,
      totalEarned: totalNetEarnings,
      totalWithdrawn: payouts.filter(p => p.status === 'approved').reduce((sum, p) => sum + p.amount, 0),
      history: payouts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  try {
    const tutorId = req.user._id;
    const courses = await Course.find({ tutor: tutorId });
    const courseIds = courses.map(c => c._id);
    const orders = await Order.find({ course: { $in: courseIds }, status: { $in: ['completed', 'paid'] } });
    const grossRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const settings = await Settings.findOne({ configId: 'global_config' });
    const feePercent = settings ? settings.platformFeePercentage : 10;
    const totalNetEarnings = grossRevenue - (grossRevenue * (feePercent / 100));
    const payouts = await Payout.find({ tutor: tutorId }).sort({ createdAt: -1 });
    const withdrawnOrPendingAmount = payouts
      .filter(p => p.status === 'approved' || p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
    const availableBalance = totalNetEarnings - withdrawnOrPendingAmount;

    res.json({
      balance: availableBalance > 0 ? availableBalance : 0,
      totalEarned: totalNetEarnings,
      totalWithdrawn: payouts.filter(p => p.status === 'approved').reduce((sum, p) => sum + p.amount, 0),
      history: payouts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 2. REQUEST A NEW PAYOUT
// ==========================================
router.post('/payouts', protect, tutorOnly, async (req, res) => {
  try {
    const { amount, paymentMethod, paymentDetails } = req.body;
    
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
    if (!paymentMethod || !paymentDetails) return res.status(400).json({ message: 'Payment details are required' });

    // (In a real app, you'd re-verify the balance here to prevent race conditions)
    
    const newPayout = await Payout.create({
      tutor: req.user._id,
      amount,
      paymentMethod,
      paymentDetails,
      status: 'pending'
    });

    Notification.create({
      user: req.user._id,
      title: "Payout Request Received ",
      message: `Your request to withdraw ₹${amount} via ${paymentMethod} is currently pending approval by the admin team.`,
      type: "system"
    }).catch(err => console.error("Notification Error:", err));

    res.status(201).json({ message: 'Payout request submitted successfully', payout: newPayout });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/dashboard-data', protect, tutorOnly, async (req, res) => {
  try {
    const tutorId = req.user._id;

    // 1. Fetch Tutor's Courses
    const courses = await Course.find({ tutor: tutorId });
    const courseIds = courses.map(c => c._id);

    // 2. Fetch Successful Orders for these courses
    const orders = await Order.find({ 
      course: { $in: courseIds },
      status: { $in: ['completed', 'paid'] } 
    }).populate('user', 'name email').populate('course', 'title').sort({ createdAt: -1 });

    // 3. Calculate Stats
    const totalCourses = courses.length;
    const totalEnrollments = orders.length;
    const grossRevenue = orders.reduce((sum, order) => sum + order.amount, 0);

    // Fetch Platform Fee from Admin Settings
    const settings = await Settings.findOne({ configId: 'global_config' });
    const feePercent = settings ? settings.platformFeePercentage : 10;
    const netEarnings = grossRevenue - (grossRevenue * (feePercent / 100));

    res.json({
      stats: {
        totalCourses,
        totalEnrollments,
        grossRevenue,
        netEarnings,
        feePercent
      },
      recentEnrollments: orders.slice(0, 5),
      allOrders: orders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 3. GET TUTOR'S STUDENTS (CRM Aggregation)
// ==========================================
router.get('/students', protect, tutorOnly, async (req, res) => {
  try {
    const tutorId = req.user._id;

    // 1. Find all courses owned by this tutor
    const courses = await Course.find({ tutor: tutorId });
    const courseIds = courses.map(c => c._id);

    // 2. Find all successful orders for these courses
    const orders = await Order.find({ 
      course: { $in: courseIds },
      status: { $in: ['completed', 'paid'] } 
    }).populate('user', 'name email').populate('course', 'title');

    // 3. Aggregate into a unique list of students
    const studentMap = {};

    orders.forEach(order => {
      // If the user was deleted, skip
      if (!order.user) return; 

      const studentId = order.user._id.toString();

      if (!studentMap[studentId]) {
        studentMap[studentId] = {
          _id: order.user._id,
          name: order.user.name,
          email: order.user.email,
          enrolledCourses: [],
          totalSpent: 0,
          firstJoined: order.createdAt
        };
      }

      // Add the course to their list if not already there
      if (!studentMap[studentId].enrolledCourses.includes(order.course?.title)) {
        studentMap[studentId].enrolledCourses.push(order.course?.title || 'Unknown Course');
      }

      // Add to their total lifetime value (LTV)
      studentMap[studentId].totalSpent += order.amount || 0;

      // Track their earliest join date
      if (new Date(order.createdAt) < new Date(studentMap[studentId].firstJoined)) {
        studentMap[studentId].firstJoined = order.createdAt;
      }
    });

    // Convert map object to an array and sort by total spent (highest first)
    const students = Object.values(studentMap).sort((a, b) => b.totalSpent - a.totalSpent);

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 4. GET SPECIFIC COURSE STATS
// ==========================================
router.get('/course/:id/stats', protect, tutorOnly, async (req, res) => {
  try {
    const courseId = req.params.id;
    const tutorId = req.user._id;

    // 1. Verify ownership
    const course = await Course.findOne({ _id: courseId, tutor: tutorId });
    if (!course) return res.status(404).json({ message: 'Course not found or unauthorized' });

    // 2. Fetch successful orders strictly for this course
    const orders = await Order.find({ 
      course: courseId,
      status: { $in: ['completed', 'paid'] } 
    });

    // 3. Calculate exact stats
    const enrollments = orders.length;
    const grossRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

    res.json({ enrollments, grossRevenue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add to the bottom of server/routes/tutorRoutes.js
router.get('/notifications', protect, tutorOnly, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
});

router.patch('/notifications/read-all', protect, tutorOnly, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { $set: { isRead: true } });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notifications', error: err.message });
  }
});

module.exports = router;