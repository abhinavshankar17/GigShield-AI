const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  policy: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy', required: true },
  triggerEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'TriggerEvent', required: true },
  estimatedIncomeLoss: { type: Number, required: true },
  eligiblePayout: { type: Number, required: true }, // the raw calculated payload before caps
  finalPayoutAmount: { type: Number, required: true }, // actual payout after applying policy map cap
  confidenceScore: { type: Number, required: true }, // 0 to 100
  fraudScoreSnapshot: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Auto-Paid', 'Under Review', 'Rejected'], 
    default: 'Pending' 
  },
  payoutReasoning: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payout', payoutSchema);
