const User = require('../models/User');
const TriggerEvent = require('../models/TriggerEvent');
const Payout = require('../models/Payout');
const { evaluateTriggerEventForUser } = require('../services/triggerEngine');

// Helper to wait to mock realistic delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const triggerMockEvent = async (req, res) => {
  try {
    const { type, zone, severity, metricValue, fraudScenario } = req.body;

    // 1. Log the Trigger Event
    const trigger = await TriggerEvent.create({
      type,
      zone,
      severity,
      metricValue,
      startTime: new Date(),
      isSimulated: true
    });

    // 2. Find eligible workers in this zone with active policies
    const users = await User.find({ primaryZone: zone, activePolicy: { $ne: null } }).populate('activePolicy');
    
    let processedResults = [];

    // 3. Evaluate Trigger Engine for each eligible worker
    for (let u of users) {
      
      // Inject simulated fraud behaviour if admin selects fraud override for demo
      if (fraudScenario) {
        // Force GPS mismatch or high fraud history to demonstrate AI fraud engine catching it
        u.primaryZone = 'Mismatched Zone';
        u.fraudScore = 80;
      }

      const evalResult = await evaluateTriggerEventForUser(u, trigger);

      // Save Payout log
      const newPayout = await Payout.create({
        user: u._id,
        policy: u.activePolicy._id,
        triggerEvent: trigger._id,
        estimatedIncomeLoss: evalResult.payout.estimatedIncomeLoss,
        eligiblePayout: evalResult.payout.eligiblePayout,
        finalPayoutAmount: evalResult.payout.finalPayoutAmount,
        confidenceScore: evalResult.fraudDetails.confidenceScore,
        fraudScoreSnapshot: evalResult.fraudDetails.fraudScore,
        status: evalResult.finalStatus,
        payoutReasoning: evalResult.reason
      });

      processedResults.push({
        worker: u.name,
        evalResult,
        payoutRecord: newPayout
      });
    }

    res.json({
      message: `Trigger event ${type} executed in ${zone}`,
      trigger,
      workersAffected: users.length,
      results: processedResults
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { triggerMockEvent };
