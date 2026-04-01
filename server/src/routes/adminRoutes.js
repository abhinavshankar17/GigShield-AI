const express = require('express');
const router = express.Router();
const { getDashboardMetrics } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/metrics', protect, adminOnly, getDashboardMetrics);

module.exports = router;
