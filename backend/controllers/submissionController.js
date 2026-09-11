const Submission = require('../models/Submission');
const Attempt = require('../models/Attempt');
const EvaluationResult = require('../models/EvaluationResult');
const evaluationService = require('../api/evaluationService');

/**
 * Submission Controller
 * 
 * Handles structured design submission, validation, triggering evaluation,
 * and retrieval of submission history.
 */

// POST /api/submissions
const createSubmission = async (req, res) => {
  try {
    const {
      attemptId,
      requirementsUnderstanding,
      assumptions = '',
      classes,
      responsibilities,
      relationships,
      edgeCases = '',
      evaluatorType = 'deterministic'
    } = req.body;

    if (!attemptId) {
      return res.status(400).json({
        success: false,
        message: 'attemptId is required.'
      });
    }

    // Required structured sections validation
    const missingFields = [];
    if (!requirementsUnderstanding || requirementsUnderstanding.trim().length < 5) {
      missingFields.push('requirementsUnderstanding (minimum 5 characters)');
    }
    if (!classes || classes.trim().length < 5) {
      missingFields.push('classes (minimum 5 characters)');
    }
    if (!responsibilities || responsibilities.trim().length < 5) {
      missingFields.push('responsibilities (minimum 5 characters)');
    }
    if (!relationships || relationships.trim().length < 5) {
      missingFields.push('relationships (minimum 5 characters)');
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Incomplete structured submission. Missing or too short: ${missingFields.join(', ')}`
      });
    }

    const attempt = await Attempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: `Attempt ${attemptId} not found.`
      });
    }

    // Attempt state check: must be in Started, Completed, or Failed to accept new submission (retry)
    if (attempt.status === 'Evaluating') {
      return res.status(409).json({
        success: false,
        message: 'Attempt is currently being evaluated. Please wait for completion before submitting again.'
      });
    }

    // Increment submission count for retry support
    const nextSubmissionNumber = (attempt.currentSubmissionNumber || 0) + 1;

    // Transition attempt to Submitted
    attempt.transitionTo('Submitted');
    attempt.currentSubmissionNumber = nextSubmissionNumber;
    await attempt.save();

    // Create immutable submission
    const submission = new Submission({
      attemptId: attempt._id,
      requirementsUnderstanding: requirementsUnderstanding.trim(),
      assumptions: assumptions.trim(),
      classes: classes.trim(),
      responsibilities: responsibilities.trim(),
      relationships: relationships.trim(),
      edgeCases: edgeCases.trim(),
      submissionNumber: nextSubmissionNumber
    });

    await submission.save();

    // Trigger evaluation service
    const evaluationResult = await evaluationService.evaluateSubmission(submission, evaluatorType);

    // Refresh attempt status
    const updatedAttempt = await Attempt.findById(attempt._id);

    return res.status(201).json({
      success: true,
      message: 'Design submitted and evaluated successfully.',
      data: {
        submission,
        evaluationResult,
        attempt: updatedAttempt
      }
    });
  } catch (error) {
    console.error('Submission creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process submission',
      error: error.message
    });
  }
};

// GET /api/submissions/attempt/:attemptId
const getSubmissionsByAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const submissions = await Submission.find({ attemptId }).sort({ submissionNumber: 1 });

    // Join evaluation results
    const submissionsWithEvaluations = await Promise.all(
      submissions.map(async (sub) => {
        const evaluation = await EvaluationResult.findOne({ submissionId: sub._id });
        return {
          submission: sub,
          evaluationResult: evaluation
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: submissionsWithEvaluations.length,
      data: submissionsWithEvaluations
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve submissions',
      error: error.message
    });
  }
};

// GET /api/submissions/:id
const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findById(id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    const evaluationResult = await EvaluationResult.findOne({ submissionId: submission._id });

    return res.status(200).json({
      success: true,
      data: {
        submission,
        evaluationResult
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve submission details',
      error: error.message
    });
  }
};

module.exports = {
  createSubmission,
  getSubmissionsByAttempt,
  getSubmissionById
};
