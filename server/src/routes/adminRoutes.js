const express = require('express');
const router = express.Router();
const { 
  getDashboardMetrics, 
  getRiders, 
  getRiskZones, 
  updateRiskMultiplier, 
  getAllPayouts, 
  updatePayoutStatus, 
  suspendRider, 
  getSystemHealth 
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/metrics', protect, adminOnly, getDashboardMetrics);
router.get('/riders', protect, adminOnly, getRiders);
router.get('/zones', protect, adminOnly, getRiskZones);
router.put('/zones/:id/multiplier', protect, adminOnly, updateRiskMultiplier);
router.get('/payouts', protect, adminOnly, getAllPayouts);
router.put('/payouts/:id/status', protect, adminOnly, updatePayoutStatus);
router.put('/riders/:id/suspend', protect, adminOnly, suspendRider);
router.get('/system-health', protect, adminOnly, getSystemHealth);

module.exports = router;
