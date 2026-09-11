const Attempt = require('../models/Attempt');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const EvaluationResult = require('../models/EvaluationResult');

/**
 * Attempt Controller
 * 
 * Handles starting sessions, retrieving status, and listing attempt history.
 */

// POST /api/attempts
const startAttempt = async (req, res) => {
  try {
    const { problemId, learnerId = 'guest_learner' } = req.body;

    if (!problemId) {
      return res.status(400).json({
        success: false,
        message: 'problemId is required to start an attempt.'
      });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found.'
      });
    }

    const attempt = new Attempt({
      problemId: problem._id,
      learnerId,
      status: 'Started'
    });

    await attempt.save();

    return res.status(201).json({
      success: true,
      message: 'Practice attempt started successfully.',
      data: attempt
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to start attempt.',
      error: error.message
    });
  }
};

// GET /api/attempts/:id
const getAttemptById = async (req, res) => {
  try {
    const { id } = req.params;
    const attempt = await Attempt.findById(id).populate('problemId');

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found.'
      });
    }

    // Fetch all submissions for this attempt
    const submissions = await Submission.find({ attemptId: attempt._id }).sort({ submissionNumber: 1 });
    
    // Fetch all evaluation results for this attempt
    const evaluations = await EvaluationResult.find({ attemptId: attempt._id }).sort({ evaluatedAt: 1 });

    return res.status(200).json({
      success: true,
      data: {
        attempt,
        submissions,
        evaluations
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve attempt.',
      error: error.message
    });
  }
};

// GET /api/attempts/problem/:problemId
const getAttemptsByProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { learnerId = 'guest_learner' } = req.query;

    const attempts = await Attempt.find({ problemId, learnerId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve attempts for problem.',
      error: error.message
    });
  }
};

module.exports = {
  startAttempt,
  getAttemptById,
  getAttemptsByProblem
};
