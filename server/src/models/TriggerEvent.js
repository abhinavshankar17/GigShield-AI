const mongoose = require('mongoose');

const triggerEventSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'Heavy Rain', 'Extreme Heat', 'High Pollution', 'Traffic Gridlock', 'Local Shutdown'
  zone: { type: String, required: true }, // e.g., 'T. Nagar'
  severity: { type: String, required: true }, // 'Moderate', 'Severe', 'Extreme'
  metricValue: { type: Number }, // e.g., 45 (for mm of rain)
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  isSimulated: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('TriggerEvent', triggerEventSchema);
