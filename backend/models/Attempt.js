const mongoose = require('mongoose');

/**
 * Valid state transitions for an Attempt lifecycle:
 * Started -> Submitted -> Evaluating -> Completed
 *                                    -> Failed
 * Completed -> Submitted (Retry: new submission preserved on same attempt session)
 * Failed -> Submitted (Retry after failure)
 */
const VALID_TRANSITIONS = {
  'Started': ['Submitted'],
  'Submitted': ['Evaluating'],
  'Evaluating': ['Completed', 'Failed'],
  'Completed': ['Submitted'],
  'Failed': ['Submitted']
};

const attemptSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
    index: true
  },
  learnerId: {
    type: String,
    required: true,
    default: 'guest_learner',
    index: true
  },
  status: {
    type: String,
    enum: ['Started', 'Submitted', 'Evaluating', 'Completed', 'Failed'],
    default: 'Started'
  },
  currentSubmissionNumber: {
    type: Number,
    default: 0
  },
  latestScore: {
    type: Number,
    default: null
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

attemptSchema.methods.transitionTo = function(newStatus) {
  const allowed = VALID_TRANSITIONS[this.status];
  if (!allowed || !allowed.includes(newStatus)) {
    throw new Error(
      `Invalid state transition: ${this.status} → ${newStatus}. ` +
      `Allowed transitions from ${this.status}: ${allowed ? allowed.join(', ') : 'none'}`
    );
  }
  this.status = newStatus;
  if (newStatus === 'Completed' || newStatus === 'Failed') {
    this.completedAt = new Date();
  }
  return this;
};

attemptSchema.statics.VALID_TRANSITIONS = VALID_TRANSITIONS;

module.exports = mongoose.model('Attempt', attemptSchema);
