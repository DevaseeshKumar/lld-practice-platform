const mongoose = require('mongoose');

/**
 * Submission model.
 * 
 * Stores the learner's structured design submission.
 * Once created, it is strictly immutable.
 * Retries create a new Submission document linked to the same Attempt.
 */
const submissionSchema = new mongoose.Schema({
  attemptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attempt',
    required: true,
    index: true
  },
  requirementsUnderstanding: {
    type: String,
    required: true,
    trim: true,
    minlength: 5
  },
  assumptions: {
    type: String,
    default: '',
    trim: true
  },
  classes: {
    type: String,
    required: true,
    trim: true,
    minlength: 5
  },
  responsibilities: {
    type: String,
    required: true,
    trim: true,
    minlength: 5
  },
  relationships: {
    type: String,
    required: true,
    trim: true,
    minlength: 5
  },
  edgeCases: {
    type: String,
    default: '',
    trim: true
  },
  submissionNumber: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

submissionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Submission', submissionSchema);
