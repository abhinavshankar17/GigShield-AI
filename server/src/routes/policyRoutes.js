const express = require('express');
const router = express.Router();
const { getPlans, getRecommendedPlan, buyPlan } = require('../controllers/policyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPlans);
router.get('/recommendation', protect, getRecommendedPlan);
router.post('/buy', protect, buyPlan);

module.exports = router;
