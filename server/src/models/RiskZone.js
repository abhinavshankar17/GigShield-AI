const mongoose = require('mongoose');

const riskZoneSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., T. Nagar
  disruptionScore: { type: Number, default: 0 }, // 0 to 100
  rainRisk: { type: Number, default: 0 },
  aqiRisk: { type: Number, default: 0 },
  trafficRisk: { type: Number, default: 0 },
  pricingMultiplier: { type: Number, default: 1.0 }
}, { timestamps: true });

module.exports = mongoose.model('RiskZone', riskZoneSchema);
