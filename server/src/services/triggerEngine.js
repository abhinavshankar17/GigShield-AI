const { evaluateFraud } = require('./fraudEngine');
const { calculateSmartPayout } = require('./payoutEngine');
const { isWorkingHourOverlap } = require('../utils/timeUtils');

/**
 * Automates Trigger Evaluation
 * Maps Trigger Event to an Eligible Worker and Computes Payout Result
 */
const evaluateTriggerEventForUser = async (user, triggerEvent) => {
  // 1. Is there an active policy?
  if (!user.activePolicy) {
    return { status: 'Discarded', reason: 'No active policy' };
  }
  const policy = typeof user.activePolicy === 'object' ? user.activePolicy : null; // In real app we populate this
  
  // 2. Is disruption covered by policy?
  if (policy && policy.coveredDisruptions && !policy.coveredDisruptions.includes(triggerEvent.type)) {
    return { status: 'Discarded', reason: `Policy does not cover ${triggerEvent.type}` };
  }

  // 3. Zone Match (Fraud Engine will also catch this but we can discard early if totally mismatched)
  if (user.primaryZone !== triggerEvent.zone) {
      return { status: 'Discarded', reason: 'Trigger occurred outside worker primary zone' };
  }

  // 4. Time Overlap (Working hours)
  // Disable strict time checking for simple hacking demo if needed, but we keep it here.
  // const overlap = isWorkingHourOverlap(triggerEvent, user.preferredWorkingHours);
  // if (!overlap) return { status: 'Discarded', reason: 'Event occurred outside preferred work hours' };

  // 5. Fraud Check & Confidence Score
  const fraudCheck = evaluateFraud(user, triggerEvent, policy);
  
  // 6. Compute Payout
  const durationHours = 4; // Mock 4 hours disruption
  const payoutMath = calculateSmartPayout(user, policy, durationHours);
  
  // Determine Final Status based on fraud check
  let finalStatus = 'Pending';
  if (fraudCheck.recommendedAction === 'Approved') finalStatus = 'Auto-Paid';
  else if (fraudCheck.recommendedAction === 'Under Review') finalStatus = 'Under Review';
  else finalStatus = 'Rejected';

  return {
    isEligible: finalStatus !== 'Rejected',
    payout: payoutMath,
    fraudDetails: fraudCheck,
    finalStatus,
    reason: fraudCheck.flaggedReasons.join(', ') || 'Met all criteria for payout'
  };
};

module.exports = { evaluateTriggerEventForUser };
