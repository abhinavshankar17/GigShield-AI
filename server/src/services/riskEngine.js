// AI logic for calculating dynamic risk and suggesting premiums
const validateWorkHours = require('../utils/timeUtils'); // We will mock this or build later

/**
 * Calculates a dynamic premium and recommends an insurance plan based on user profile
 */
const recommendPlan = (userProfile, zoneMetrics) => {
  let riskScore = 0; // 0 to 100
  
  // 1. Zone Risk Factor
  riskScore += (zoneMetrics.rainRisk || 0) * 0.4;
  riskScore += (zoneMetrics.trafficRisk || 0) * 0.3;
  riskScore += (zoneMetrics.aqiRisk || 0) * 0.3;
  // Apply external zone multiplier
  riskScore *= (zoneMetrics.pricingMultiplier || 1.0);

  // 2. Profile Factor
  const avgWeekly = userProfile.avgWeeklyEarnings || 3000;
  
  // Decide Recommended Plan
  let recommendedPlan = 'Standard Plan';
  let suggestedPremium = 59;
  let summary = '';
  let riskLevel = 'Medium';

  if (riskScore > 70 || avgWeekly > 5000) {
    recommendedPlan = 'Premium Plan';
    suggestedPremium = 89;
    riskLevel = 'High';
    summary = `Your delivery zone (${userProfile.primaryZone || 'current zone'}) has high historical disruption risk. Given your higher expected income, the Premium Plan ensures maximum protection.`;
  } else if (riskScore < 30 && avgWeekly < 2000) {
    recommendedPlan = 'Basic Plan';
    suggestedPremium = 39;
    riskLevel = 'Low';
    summary = `Your delivery zone has relatively low disruption risk. The Basic Plan covers most minor interruptions while keeping your premium low.`;
  } else {
    summary = `Your delivery zone has moderate rainfall and traffic disruption risk. Based on your average weekly income, the Standard Plan provides optimal coverage.`;
  }

  return {
    riskScore: Math.round(riskScore),
    riskLevel,
    recommendedPlan,
    suggestedPremium,
    reasoningSummary: summary
  };
};

/**
 * Generates AI upgrade suggestions for the user dashboard
 */
const generateUpgradeSuggestion = (user, currentPlan, upcomingRiskData) => {
  if (upcomingRiskData.highRainfallExpected && currentPlan.name !== 'Premium Plan') {
    return "High rainfall expected tomorrow — upgrade to Premium for better protection.";
  }
  if (upcomingRiskData.zoneShutdownRisk && currentPlan.name === 'Basic Plan') {
    return "Your zone is entering variable risk conditions this week. Standard plan provides better coverage.";
  }
  return null;
};

module.exports = { recommendPlan, generateUpgradeSuggestion };
