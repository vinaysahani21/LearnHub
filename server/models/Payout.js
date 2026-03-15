const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  tutor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  paymentMethod: { 
    type: String, 
    default: 'Bank Transfer' // e.g., UPI, Bank Transfer, PayPal
  },
  paymentDetails: { 
    type: String,
    required: true // e.g., their UPI ID or Account Number
  },
  adminNotes: {
    type: String // Optional notes if rejected (e.g., "Invalid UPI ID")
  },
  processedAt: { 
    type: Date 
  }
}, { timestamps: true });

module.exports = mongoose.model('Payout', payoutSchema);