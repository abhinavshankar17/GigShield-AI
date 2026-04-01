const express = require('express');
const router = express.Router();
const { triggerMockEvent } = require('../controllers/simulationController');
// Temporarily avoiding protect/adminOnly middleware on this route for simpler hackathon setup
// const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/trigger', triggerMockEvent);

module.exports = router;
