const Policy = require('../models/Policy');
const User = require('../models/User');
const RiskZone = require('../models/RiskZone');
const { recommendPlan } = require('../services/riskEngine');

const getPlans = async (req, res) => {
  try {
    const plans = await Policy.find({});
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecommendedPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let zone = await RiskZone.findOne({ name: user.primaryZone });
    
    // Fallback if zone isn't seeded yet
    if (!zone) {
      zone = { rainRisk: 50, trafficRisk: 50, aqiRisk: 30, pricingMultiplier: 1.0 };
    }

    const recommendation = recommendPlan(user, zone);
    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const buyPlan = async (req, res) => {
  try {
    const { policyId } = req.body;
    const user = await User.findById(req.user.id);
    const policy = await Policy.findById(policyId);

    if (!policy) return res.status(404).json({ message: 'Policy not found' });

    user.activePolicy = policy._id;
    // Set expiry to 7 days from now
    user.policyExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await user.save();

    res.json({ message: 'Policy purchased successfully', activePolicy: policy, expiry: user.policyExpiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPlans, getRecommendedPlan, buyPlan };
