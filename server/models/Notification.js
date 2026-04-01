const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['system', 'course', 'payment', 'achievement'], 
    default: 'system' 
  },
  isRead: { type: Boolean, default: false },
  actionUrl: { type: String } // Optional: link to a specific course or page
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);