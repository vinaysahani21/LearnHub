const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Order = require('../models/Order'); 
const { protect, adminOnly } = require('../middleware/authMiddleware');
const Settings = require('../models/Settings'); 
const Payout = require('../models/Payout'); 
const Category = require('../models/Category'); // Import at the top!


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

    // Map through users and calculate their stats dynamically
    const enrichedUsers = users.map(user => {
      // If Tutor: Count how many courses they created
      const createdCount = courses.filter(c => c.tutor?.toString() === user._id.toString()).length;
      // If Student: Count how many courses they are inside the enrolledStudents array
      const enrolledCount = courses.filter(c => c.enrolledStudents?.some(s => s.toString() === user._id.toString())).length;
      
      return { 
        ...user, 
        createdCount, 
        enrolledCount,
        isActive: user.isActive !== false // Defaults to true if undefined
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
      .populate('tutor', 'name email') // Gets the tutor's details
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
      .sort({ createdAt: -1 }); // Newest first
      
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

    // Flip the status
    user.isActive = !user.isActive;
    await user.save();
    
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
    
    // If it's the first time booting up, create the default settings
    if (!settings) {
      settings = await Settings.create({});
    }
    
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
      { new: true, upsert: true } // upsert ensures it creates one if missing
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
      .sort({ createdAt: -1 }); // Newest requests first
      
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
    
    // Ensure valid status
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    const payout = await Payout.findById(req.params.id);
    if (!payout) return res.status(404).json({ message: 'Payout request not found' });
    if (payout.status !== 'pending') return res.status(400).json({ message: 'Payout has already been processed' });

    // Update the payout
    payout.status = status;
    payout.adminNotes = adminNotes || '';
    payout.processedAt = Date.now();
    
    await payout.save();

    res.json({ message: `Payout successfully ${status}`, payout });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 13. GET ALL CATEGORIES
// ==========================================
router.get('/categories', async (req, res) => {
  // Note: We don't use 'protect' or 'adminOnly' here because the frontend 
  // needs to fetch these for the Tutor's "Create Course" dropdown too!
  try {
    const categories = await Category.find().sort({ name: 1 }); // Sort A-Z
    res.json(categories);
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

module.exports = router;