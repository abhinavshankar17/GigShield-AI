const User = require('../models/User');
const Policy = require('../models/Policy');
const Payout = require('../models/Payout');
const TriggerEvent = require('../models/TriggerEvent');

const getDashboardMetrics = async (req, res) => {
  try {
    const totalWorkers = await User.countDocuments({ role: 'worker' });
    const totalPolicies = await User.countDocuments({ activePolicy: { $ne: null } });
    
    // Financial Viability Calculations (Mock up using aggregate if real, simple loops for demo)
    const usersWithPolicy = await User.find({ activePolicy: { $ne: null } }).populate('activePolicy');
    let totalPremiumsCollected = 0;
    usersWithPolicy.forEach(u => {
      totalPremiumsCollected += u.activePolicy.weeklyPremium || 0;
    });

    const payouts = await Payout.find({});
    let totalPayoutsIssued = 0;
    let highRiskFlags = 0;
    let autoPaidCount = 0;

    payouts.forEach(p => {
      totalPayoutsIssued += p.finalPayoutAmount || 0;
      if (p.fraudScoreSnapshot > 60) highRiskFlags++;
      if (p.status === 'Auto-Paid') autoPaidCount++;
    });

    const lossRatio = totalPremiumsCollected > 0 ? (totalPayoutsIssued / totalPremiumsCollected) * 100 : 0;
    const reserveBalance = totalPremiumsCollected - totalPayoutsIssued;

    // Fraud alerts
    const fraudAlerts = await Payout.find({ fraudScoreSnapshot: { $gt: 40 } })
        .populate('user', 'name email primaryZone fraudScore')
        .populate('triggerEvent', 'type zone severity');

    res.json({
      totalWorkers,
      totalPolicies,
      financialViability: {
        totalPremiumsCollected,
        totalPayoutsIssued,
        lossRatio: lossRatio.toFixed(2),
        reserveBalance,
        profitabilityStatus: reserveBalance > 0 ? 'Sustainable' : 'Critical - Adjust Premiums'
      },
      payoutStats: {
        totalClaims: payouts.length,
        autoPaidCount,
        underReviewCount: payouts.filter(p => p.status === 'Under Review').length,
        highRiskFlags
      },
      recentFraudAlerts: fraudAlerts.slice(0, 10)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRiders = async (req, res) => {
  try {
    const riders = await User.find({ role: 'worker' })
      .select('-password')
      .populate('activePolicy');
    res.json(riders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRiskZones = async (req, res) => {
  try {
    const RiskZone = require('../models/RiskZone');
    const zones = await RiskZone.find({});
    res.json(zones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRiskMultiplier = async (req, res) => {
  try {
    const RiskZone = require('../models/RiskZone');
    const { id } = req.params;
    const { multiplier } = req.body;
    const zone = await RiskZone.findByIdAndUpdate(id, { pricingMultiplier: multiplier }, { new: true });
    res.json(zone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find({})
      .populate('user', 'name email fraudScore')
      .populate('policy', 'name')
      .populate('triggerEvent', 'type zone severity');
    res.json(payouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePayoutStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const payout = await Payout.findByIdAndUpdate(id, { status }, { new: true });
    res.json(payout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const suspendRider = async (req, res) => {
  try {
    const { id } = req.params;
    const { isSuspended } = req.body;
    const user = await User.findByIdAndUpdate(id, { isSuspended }, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSystemHealth = async (req, res) => {
  try {
    // Simulated health check
    res.json({
      googleMaps: { status: 'Operational', latency: '45ms' },
      openWeather: { status: 'Operational', latency: '120ms' },
      stripe: { status: 'Operational', latency: '85ms' },
      database: { status: 'Connected', latency: '2ms' },
      uptime: '14 days, 3 hours'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getDashboardMetrics, 
  getRiders, 
  getRiskZones, 
  updateRiskMultiplier, 
  getAllPayouts, 
  updatePayoutStatus, 
  suspendRider, 
  getSystemHealth 
};
