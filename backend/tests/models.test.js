const mongoose = require('mongoose');
const Attempt = require('../models/Attempt');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const EvaluationResult = require('../models/EvaluationResult');

describe('Domain Models & State Lifecycle', () => {
  describe('Attempt State Machine', () => {
    it('should initialize with status "Started" and 0 submissions', () => {
      const attempt = new Attempt({
        problemId: new mongoose.Types.ObjectId(),
        learnerId: 'student_123'
      });

      expect(attempt.status).toBe('Started');
      expect(attempt.currentSubmissionNumber).toBe(0);
      expect(attempt.latestScore).toBeNull();
      expect(attempt.startedAt).toBeInstanceOf(Date);
      expect(attempt.completedAt).toBeNull();
    });

    it('should allow valid transition: Started -> Submitted -> Evaluating -> Completed', () => {
      const attempt = new Attempt({
        problemId: new mongoose.Types.ObjectId(),
        learnerId: 'student_123'
      });

      expect(attempt.status).toBe('Started');

      attempt.transitionTo('Submitted');
      expect(attempt.status).toBe('Submitted');

      attempt.transitionTo('Evaluating');
      expect(attempt.status).toBe('Evaluating');

      attempt.transitionTo('Completed');
      expect(attempt.status).toBe('Completed');
      expect(attempt.completedAt).toBeInstanceOf(Date);
    });

    it('should allow retry transition: Completed -> Submitted', () => {
      const attempt = new Attempt({
        problemId: new mongoose.Types.ObjectId(),
        learnerId: 'student_123'
      });

      attempt.transitionTo('Submitted');
      attempt.transitionTo('Evaluating');
      attempt.transitionTo('Completed');

      // Retry
      attempt.transitionTo('Submitted');
      expect(attempt.status).toBe('Submitted');
    });

    it('should throw an error on illegal state transition: Started -> Completed directly', () => {
      const attempt = new Attempt({
        problemId: new mongoose.Types.ObjectId(),
        learnerId: 'student_123'
      });

      expect(() => {
        attempt.transitionTo('Completed');
      }).toThrow(/Invalid state transition/);
    });

    it('should throw an error on illegal transition: Evaluating -> Started', () => {
      const attempt = new Attempt({
        problemId: new mongoose.Types.ObjectId(),
        learnerId: 'student_123'
      });

      attempt.transitionTo('Submitted');
      attempt.transitionTo('Evaluating');

      expect(() => {
        attempt.transitionTo('Started');
      }).toThrow(/Invalid state transition/);
    });
  });

  describe('Submission Validation', () => {
    it('should require all essential structured text sections', async () => {
      const submission = new Submission({
        attemptId: new mongoose.Types.ObjectId(),
        // missing required fields
        submissionNumber: 1
      });

      let validationError;
      try {
        await submission.validate();
      } catch (err) {
        validationError = err;
      }
      expect(validationError).toBeDefined();
      expect(validationError.errors.requirementsUnderstanding).toBeDefined();
      expect(validationError.errors.classes).toBeDefined();
      expect(validationError.errors.responsibilities).toBeDefined();
      expect(validationError.errors.relationships).toBeDefined();
    });

    it('should pass validation when all structured fields are provided', async () => {
      const submission = new Submission({
        attemptId: new mongoose.Types.ObjectId(),
        requirementsUnderstanding: 'Design an automated vending machine with item dispensing.',
        assumptions: 'Exact change currency is always available.',
        classes: 'VendingMachine, State, Inventory, Product, Coin.',
        responsibilities: 'VendingMachine orchestrates state. Inventory manages product counts.',
        relationships: 'VendingMachine has-a Inventory. State transitions on events.',
        edgeCases: 'Out of stock items reject payment.',
        submissionNumber: 1
      });

      let validationError;
      try {
        await submission.validate();
      } catch (err) {
        validationError = err;
      }
      expect(validationError).toBeUndefined();
    });
  });

  describe('EvaluationResult Structure', () => {
    it('should validate score boundaries and evaluatorType', async () => {
      const evalResult = new EvaluationResult({
        submissionId: new mongoose.Types.ObjectId(),
        attemptId: new mongoose.Types.ObjectId(),
        evaluatorType: 'deterministic',
        overallScore: 85,
        criterionResults: [
          {
            criterionName: 'Domain Entity Modeling',
            weight: 0.5,
            score: 90,
            evidence: 'Identified VendingMachine and Product',
            confidence: 'high'
          }
        ]
      });

      let validationError;
      try {
        await evalResult.validate();
      } catch (err) {
        validationError = err;
      }
      expect(validationError).toBeUndefined();
      expect(evalResult.overallScore).toBe(85);
    });
  });
});
