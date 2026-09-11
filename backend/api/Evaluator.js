/**
 * Abstract Evaluator Base Class.
 * 
 * Defines the contract that all evaluator implementations (Deterministic,
 * Mock-AI, or future real LLMs) must satisfy.
 */
class Evaluator {
  /**
   * @param {string} type - Identifier for the evaluator ('deterministic', 'mock-ai')
   */
  constructor(type) {
    if (new.target === Evaluator) {
      throw new Error('Evaluator is an abstract class and cannot be instantiated directly.');
    }
    this.type = type;
  }

  /**
   * Evaluate a structured submission against a problem rubric.
   * 
   * @param {Object} submission - Structured submission fields:
   *   requirementsUnderstanding, assumptions, classes, responsibilities, relationships, edgeCases
   * @param {Object} problem - Problem object with rubricCriteria array
   * @returns {Promise<Object>} Evaluation payload:
   *   - evaluatorType: string
   *   - criterionResults: Array<{ criterionId, criterionName, weight, score, evidence, concern, suggestion, confidence }>
   *   - overallScore: number (0-100)
   *   - strengths: string[]
   *   - concerns: string[]
   *   - suggestions: string[]
   */
  async evaluate(submission, problem) {
    throw new Error('evaluate() must be implemented by subclass.');
  }

  getType() {
    return this.type;
  }
}

module.exports = Evaluator;
