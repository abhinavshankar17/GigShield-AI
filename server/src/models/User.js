const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['worker', 'admin'], default: 'worker' },
  
  // Worker Specific Fields
  city: { type: String },
  deliveryPlatform: { type: String }, // Swiggy, Zomato, etc.
  primaryZone: { type: String }, // e.g., T. Nagar
  vehicleType: { type: String },
  preferredWorkingHours: {
    start: { type: String }, // e.g., "12:00"
    end: { type: String },   // e.g., "20:00"
    shift: { type: String } // Morning, Afternoon, Evening, Night
  },
  avgDailyEarnings: { type: Number, default: 0 },
  avgWeeklyEarnings: { type: Number, default: 0 },
  
  // AI Module specific features
  fraudScore: { type: Number, default: 12 }, // out of 100
  fraudStatus: { type: String, enum: ['Low Risk', 'Medium Risk', 'High Risk'], default: 'Low Risk' },
  activePolicy: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy' },
  policyExpiry: { type: Date },
  isSuspended: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
