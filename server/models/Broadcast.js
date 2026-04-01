const mongoose = require('mongoose');

const broadcastSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  targetRole: { 
    type: String, 
    enum: ['all', 'student', 'tutor'], 
    default: 'all' 
  },
  priority: { 
    type: String, 
    enum: ['normal', 'urgent'], 
    default: 'normal' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Broadcast', broadcastSchema);