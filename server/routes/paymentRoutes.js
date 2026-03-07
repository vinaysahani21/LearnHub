const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User'); 
const { protect } = require('../middleware/authMiddleware');

// Initialize Razorpay with Environment Variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 1. CREATE ORDER (Real Razorpay)
router.post('/create-order', protect, async (req, res) => {
  try {
    const { courseId, amount } = req.body;

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    // Call Razorpay API
    const order = await razorpay.orders.create(options);

    // Save pending order to DB
    const newOrder = new Order({
      user: req.user.id,
      course: courseId,
      razorpayOrderId: order.id,
      amount: amount,
      status: 'pending'
    });

    await newOrder.save();

    res.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      key_id: process.env.RAZORPAY_KEY_ID // Send Public Key to Frontend
    });

  } catch (err) {
    console.error("Razorpay Error:", err);
    res.status(500).json({ message: "Payment initiation failed" });
  }
});

// 2. VERIFY PAYMENT (Real Security Check)
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    // Verify Signature using your Secret Key
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Update Order Status
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { 
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: 'completed'
        }
      );

      // Enroll User
      const user = await User.findById(req.user.id);
      if (!user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        await user.save();
      }

      res.json({ message: "Payment successful", success: true });
    } else {
      res.status(400).json({ message: "Invalid signature", success: false });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

module.exports = router;