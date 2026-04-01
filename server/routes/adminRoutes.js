// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Order = require('../models/Order'); 
const { protect, adminOnly } = require('../middleware/authMiddleware');
const Settings = require('../models/Settings'); 
const Broadcast = require('../models/Broadcast');
const Payout = require('../models/Payout'); 
const Category = require('../models/Category'); 
const Notification = require('../models/Notification');

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

// ==========================================
// 2. GET ALL USERS (UPDATED WITH STATS)
// ==========================================
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').lean().sort({ createdAt: -1 });
    const courses = await Course.find().select('tutor enrolledStudents').lean();

    const enrichedUsers = users.map(user => {
      const createdCount = courses.filter(c => c.tutor?.toString() === user._id.toString()).length;
      const enrolledCount = courses.filter(c => c.enrolledStudents?.some(s => s.toString() === user._id.toString())).length;
      
      return { 
        ...user, 
        createdCount, 
        enrolledCount,
        isActive: user.isActive !== false 
      };
    });

    res.json(enrichedUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 3. DELETE A USER
// ==========================================
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete an admin account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/courses', protect, adminOnly, async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('tutor', 'name email') 
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 6. GET SINGLE COURSE FOR ADMIN PREVIEW
// ==========================================
router.get('/courses/:id', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('tutor', 'name email');
      
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 7. GET ALL FINANCIAL RECORDS (ORDERS)
// ==========================================
router.get('/orders', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('course', 'title price')
      .sort({ createdAt: -1 }); 
      
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 8. TOGGLE USER ACCOUNT STATUS (Suspend/Activate)
// ==========================================
router.put('/users/:id/toggle-status', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot modify another admin account' });
    }

    user.isActive = !user.isActive;
    await user.save();
    
    // INJECTED: NOTIFY USER OF ACCOUNT STATUS CHANGE 
    if (user.isActive) {
      Notification.create({
        user: user._id,
        title: "Account Activated ✅",
        message: "Your account has been fully restored by the administration team.",
        type: "system"
      }).catch(err => console.error(err));
    }

    res.json({ message: `User account has been ${user.isActive ? 'activated' : 'suspended'}.`, isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 9. GET PLATFORM SETTINGS
// ==========================================
router.get('/settings', protect, adminOnly, async (req, res) => {
  try {
    let settings = await Settings.findOne({ configId: 'global_config' });
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 10. UPDATE PLATFORM SETTINGS
// ==========================================
router.put('/settings', protect, adminOnly, async (req, res) => {
  try {
    const { maintenanceMode, allowTutorRegistrations, platformFeePercentage } = req.body;
    
    const settings = await Settings.findOneAndUpdate(
      { configId: 'global_config' },
      { maintenanceMode, allowTutorRegistrations, platformFeePercentage },
      { new: true, upsert: true } 
    );
    
    res.json({ message: 'Platform settings updated successfully', settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 11. GET ALL PAYOUT REQUESTS
// ==========================================
router.get('/payouts', protect, adminOnly, async (req, res) => {
  try {
    const payouts = await Payout.find()
      .populate('tutor', 'name email')
      .sort({ createdAt: -1 }); 
      
    res.json(payouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 12. PROCESS A PAYOUT (Approve/Reject)
// ==========================================
router.put('/payouts/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    const payout = await Payout.findById(req.params.id);
    if (!payout) return res.status(404).json({ message: 'Payout request not found' });
    if (payout.status !== 'pending') return res.status(400).json({ message: 'Payout has already been processed' });

    payout.status = status;
    payout.adminNotes = adminNotes || '';
    payout.processedAt = Date.now();
    
    await payout.save();

    // INJECTED: NOTIFY TUTOR ABOUT PAYOUT DECISION 
    const message = status === 'approved' 
      ? `Good news! Your payout of ₹${payout.amount} has been approved and processed.`
      : `Your payout of ₹${payout.amount} was rejected. Note: ${adminNotes || 'Please contact support.'}`;

    Notification.create({
      user: payout.tutor,
      title: `Payout ${status.toUpperCase()} 💳`,
      message: message,
      type: "payment"
    }).catch(err => console.error("Notification Error:", err));

    res.json({ message: `Payout successfully ${status}`, payout });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 13. GET ALL CATEGORIES (Enriched with Course Counts)
// ==========================================
router.get('/categories', async (req, res) => {
  try {
    // 1. Fetch all categories and courses using .lean() for faster processing
    const categories = await Category.find().lean().sort({ name: 1 }); 
    const courses = await Course.find().select('category').lean();

    // 2. Map through categories and count matching courses
    const enrichedCategories = categories.map(cat => {
      // Count how many courses have this exact category name
      const courseCount = courses.filter(c => c.category === cat.name).length;
      return { 
        ...cat, 
        courseCount 
      };
    });

    res.json(enrichedCategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 14. CREATE A CATEGORY
// ==========================================
router.post('/categories', protect, adminOnly, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) return res.status(400).json({ message: 'Category already exists' });

    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 15. DELETE A CATEGORY
// ==========================================
router.delete('/categories/:id', protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 16. NEW: GLOBAL BROADCAST NOTIFICATION 
// ==========================================
// ==========================================
// DEPLOY GLOBAL BROADCAST
// ==========================================
router.post('/broadcast', protect, adminOnly, async (req, res) => {
  try {
    const { title, message, targetRole, priority } = req.body;

    // 1. Save the broadcast to the historical ledger
    await Broadcast.create({
      title,
      message,
      targetRole,
      priority
    });

    // 2. Determine who receives this broadcast
    let query = {};
    if (targetRole !== 'all') {
      query.role = targetRole;
    }
    
    // Fetch only the IDs to save memory
    const users = await User.find(query).select('_id');

    // 3. Create the actual notifications in bulk
    const notifications = users.map(user => ({
      user: user._id,
      title: title,
      message: message,
      // If you have a 'type' or 'priority' field in your Notification schema, you can pass it here
    }));

    // Use insertMany for massive performance boost when sending to thousands of users
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(200).json({ message: `Broadcast successfully deployed to ${users.length} users.` });
  } catch (err) {
    console.error("Broadcast Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// GET BROADCAST HISTORY
// ==========================================
router.get('/broadcast-history', protect, adminOnly, async (req, res) => {
  try {
    // Fetch the 50 most recent broadcasts
    const history = await Broadcast.find().sort({ createdAt: -1 }).limit(50);
    res.json(history);
  } catch (err) {
    console.error("Broadcast History Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 17. GET NOTIFICATIONS (FOR ADMIN PANEL BELL)
// ==========================================
router.get('/notifications', protect, adminOnly, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 18. MARK NOTIFICATIONS AS READ
// ==========================================
router.patch('/notifications/read-all', protect, adminOnly, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { $set: { isRead: true } });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;