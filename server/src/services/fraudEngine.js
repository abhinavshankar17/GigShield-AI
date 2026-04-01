/**
 * Calculates a fraud score and confidence level for a claim
 */
const evaluateFraud = (userProfile, triggerEvent, activePolicy) => {
  let score = 0; // The higher the score, the higher the risk. Out of 100.
  let flagReasons = [];

  // Mismatch Check: Policy Zone vs Trigger Zone
  if (userProfile.primaryZone !== triggerEvent.zone) {
    score += 45;
    flagReasons.push('Zone Mismatch (Trigger did not happen in primary zone)');
  }

  // Work Pattern Anomaly Check
  if (userProfile.avgDailyEarnings < 100 && userProfile.fraudScore > 20) {
    score += 25;
    flagReasons.push('Suspicious Activity: High claim despite low average earnings');
  }

  // Combine with historic user fraud score (carried forward)
  score += userProfile.fraudScore || 0;

  // Cap Score 100
  score = Math.min(score, 100);

  let confidence = 100 - score; 
  let status = 'Low Risk';
  let recommendedAction = 'Approved'; // Auto Pay
  
  if (score > 60) {
    status = 'High Risk';
    recommendedAction = 'Rejected';
    confidence = Math.max(10, confidence);
  } else if (score > 35) {
    status = 'Medium Risk';
    recommendedAction = 'Under Review';
  }

  return {
    fraudScore: score,
    confidenceScore: confidence,
    status,
    recommendedAction,
    flaggedReasons: flagReasons
  };
};

module.exports = { evaluateFraud };
