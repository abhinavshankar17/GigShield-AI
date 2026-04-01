/**
 * Estimates lost income and computes Smart Payout
 */
const calculateSmartPayout = (userProfile, policy, disruptionDurationHours) => {
  // We cap effective interrupted hours at 6 max for a single event logic
  const actualDuration = Math.min(disruptionDurationHours || 4, 6);
  
  // e.g. 500 average daily / 10 hours a day roughly = 50 INR per hour
  const hourlyRate = (userProfile.avgDailyEarnings || 500) / 10;
  const estimatedIncomeLoss = hourlyRate * actualDuration;

  // Actual payout is a percentage of lost income (e.g., 80% coverage)
  const coverageRatio = 0.8;
  const eligiblePayout = estimatedIncomeLoss * coverageRatio;

  // Enforce Max Cap
  const finalPayoutAmount = Math.min(eligiblePayout, policy.maxPayout || 300);

  return { estimatedIncomeLoss, eligiblePayout, finalPayoutAmount };
};

/**
 * AI Income Protection Score 
 * 0 to 100 based on policy vs avg income
 */
const getIncomeProtectionScore = (userProfile, policy) => {
  if (!policy || !policy.maxPayout) return 0;
  const maxPayout = policy.maxPayout;
  const avgWeekly = userProfile.avgWeeklyEarnings || 3000;
  
  let score = (maxPayout / (avgWeekly * 0.5)) * 100; // if policy covers 50% of weekly income -> 100 score
  score = Math.min(score, 100);
  score = Math.max(score, 0);

  return Math.round(score);
};

module.exports = { calculateSmartPayout, getIncomeProtectionScore };
