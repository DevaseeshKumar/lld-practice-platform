const DeterministicEvaluator = require('./DeterministicEvaluator');
const MockAiEvaluator = require('./MockAiEvaluator');
const EvaluationResult = require('../models/EvaluationResult');
const Attempt = require('../models/Attempt');
const Problem = require('../models/Problem');

/**
 * EvaluationService
 * 
 * Orchestrates evaluation workflow:
 * 1. Validates submission and parent attempt state
 * 2. Selects evaluator (deterministic or mock-ai)
 * 3. Transitions Attempt state (Submitted -> Evaluating -> Completed/Failed)
 * 4. Persists EvaluationResult record
 * 5. Updates Attempt latestScore
 */
class EvaluationService {
  constructor() {
    this.evaluators = {
      'deterministic': new DeterministicEvaluator(),
      'mock-ai': new MockAiEvaluator()
    };
  }

  /**
   * Register a custom evaluator plugin (supporting extensibility / Change Test B)
   * @param {string} name 
   * @param {Evaluator} evaluatorInstance 
   */
  registerEvaluator(name, evaluatorInstance) {
    this.evaluators[name] = evaluatorInstance;
  }

  getEvaluator(type = 'deterministic') {
    const evaluator = this.evaluators[type];
    if (!evaluator) {
      throw new Error(`Unsupported evaluator type: "${type}". Available: ${Object.keys(this.evaluators).join(', ')}`);
    }
    return evaluator;
  }

  /**
   * Run evaluation for a given submission.
   * 
   * @param {Object} submission - Mongoose Submission document or plain object
   * @param {string} evaluatorType - 'deterministic' | 'mock-ai'
   * @returns {Promise<Object>} The persisted EvaluationResult
   */
  async evaluateSubmission(submission, evaluatorType = 'deterministic') {
    const attempt = await Attempt.findById(submission.attemptId);
    if (!attempt) {
      throw new Error(`Attempt ${submission.attemptId} not found.`);
    }

    const problem = await Problem.findById(attempt.problemId);
    if (!problem) {
      throw new Error(`Problem ${attempt.problemId} not found.`);
    }

    // Transition Attempt to Evaluating
    try {
      attempt.transitionTo('Evaluating');
      await attempt.save();
    } catch (err) {
      // If already in evaluating or allowed status, log and proceed
      console.warn(`Attempt state notice: ${err.message}`);
    }

    const evaluator = this.getEvaluator(evaluatorType);

    try {
      const evaluationPayload = await evaluator.evaluate(submission, problem);

      const result = new EvaluationResult({
        submissionId: submission._id,
        attemptId: attempt._id,
        evaluatorType: evaluationPayload.evaluatorType,
        criterionResults: evaluationPayload.criterionResults,
        overallScore: evaluationPayload.overallScore,
        strengths: evaluationPayload.strengths,
        concerns: evaluationPayload.concerns,
        suggestions: evaluationPayload.suggestions
      });

      await result.save();

      // Transition Attempt to Completed and store latestScore
      attempt.latestScore = result.overallScore;
      attempt.transitionTo('Completed');
      await attempt.save();

      return result;
    } catch (evalError) {
      // Mark attempt as Failed if evaluation throws
      try {
        attempt.transitionTo('Failed');
        await attempt.save();
      } catch (tErr) {
        console.error('Failed to transition attempt to Failed status:', tErr);
      }
      throw evalError;
    }
  }
}

module.exports = new EvaluationService();
