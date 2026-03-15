const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Only ever allow one document by giving it a fixed string ID
  configId: { type: String, default: 'global_config', unique: true },
  maintenanceMode: { type: Boolean, default: false },
  allowTutorRegistrations: { type: Boolean, default: true },
  platformFeePercentage: { type: Number, default: 10 } // Admin takes 10% cut
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);