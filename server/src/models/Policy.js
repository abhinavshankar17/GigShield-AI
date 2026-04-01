const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Basic, Standard, Premium
  weeklyPremium: { type: Number, required: true },
  maxPayout: { type: Number, required: true },
  coveredDisruptions: [{ type: String }], // 'Rain', 'Heat', 'Pollution', 'Traffic', 'Local Shutdown'
  recommendedWorkerType: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Policy', policySchema);
