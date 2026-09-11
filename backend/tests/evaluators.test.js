const Evaluator = require('../api/Evaluator');
const DeterministicEvaluator = require('../api/DeterministicEvaluator');
const MockAiEvaluator = require('../api/MockAiEvaluator');
const evaluationService = require('../api/evaluationService');
const { initialProblems } = require('../config/seedData');

describe('Evaluator Engine & Implementations', () => {
  const vendingMachineProblem = initialProblems.find(p => p.slug === 'vending-machine');

  describe('Abstract Evaluator Interface', () => {
    it('should not allow direct instantiation of Evaluator', () => {
      expect(() => new Evaluator('base')).toThrow(/cannot be instantiated directly/);
    });

    it('subclasses must implement evaluate()', async () => {
      class UnimplementedEvaluator extends Evaluator {
        constructor() {
          super('unimplemented');
        }
      }
      const testEvaluator = new UnimplementedEvaluator();
      await expect(testEvaluator.evaluate({}, {})).rejects.toThrow(/must be implemented by subclass/);
    });
  });

  describe('DeterministicEvaluator', () => {
    const evaluator = new DeterministicEvaluator();

    it('should give high score and clear evidence to a comprehensive submission', async () => {
      const comprehensiveSubmission = {
        requirementsUnderstanding: 'The VendingMachine accepts coins and notes, manages inventory of products, dispenses items upon payment, and returns exact change or refunds if cancelled.',
        assumptions: 'Machine has limited capacity for coin storage. Hardware sensor handles physical dispensing.',
        classes: 'VendingMachine, State, IdleState, HasMoneyState, DispensingState, SoldOutState, Product, Inventory, Coin, CoinTray.',
        responsibilities: 'VendingMachine coordinates states. State handles user actions. Inventory tracks item counts. CoinTray dispenses refund and change balance.',
        relationships: 'VendingMachine has-a Inventory and current State (State pattern). Inventory aggregates Products.',
        edgeCases: 'Handles out of stock with refund, insufficient funds, exact change reservoir depletion, and mid-transaction cancellation.'
      };

      const result = await evaluator.evaluate(comprehensiveSubmission, vendingMachineProblem);

      expect(result.evaluatorType).toBe('deterministic');
      expect(result.overallScore).toBeGreaterThanOrEqual(75);
      expect(result.criterionResults.length).toBe(vendingMachineProblem.rubricCriteria.length);
      expect(result.strengths.length).toBeGreaterThan(0);
      
      // Check each criterion has transparent details
      result.criterionResults.forEach(cr => {
        expect(cr).toHaveProperty('criterionName');
        expect(cr).toHaveProperty('score');
        expect(cr).toHaveProperty('evidence');
        expect(cr).toHaveProperty('suggestion');
      });
    });

    it('should give constructive feedback and lower score to an incomplete submission', async () => {
      const minimalSubmission = {
        requirementsUnderstanding: 'A machine that sells snacks to people.',
        assumptions: '',
        classes: 'SnackMachine',
        responsibilities: 'Does everything.',
        relationships: 'None.',
        edgeCases: ''
      };

      const result = await evaluator.evaluate(minimalSubmission, vendingMachineProblem);

      expect(result.overallScore).toBeLessThan(65);
      expect(result.concerns.length).toBeGreaterThan(0);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('MockAiEvaluator', () => {
    const aiEvaluator = new MockAiEvaluator();

    it('should generate simulated LLM critique matching standard evaluator shape', async () => {
      const sampleSubmission = {
        requirementsUnderstanding: 'Vending machine with state management and currency processing.',
        assumptions: 'Single user at a time.',
        classes: 'VendingMachine, State, IdleState, HasMoneyState, Product, Inventory.',
        responsibilities: 'State pattern handles lifecycle. Inventory tracks stock.',
        relationships: 'VendingMachine uses composition with State interface.',
        edgeCases: 'Sold out item rejection, invalid coin rejection, power failure state recovery.'
      };

      const result = await aiEvaluator.evaluate(sampleSubmission, vendingMachineProblem);

      expect(result.evaluatorType).toBe('mock-ai');
      expect(result.overallScore).toBeGreaterThanOrEqual(60);
      expect(result.criterionResults.length).toBe(vendingMachineProblem.rubricCriteria.length);
      expect(result.aiModelNote).toContain('simulated Mock AI');
    });
  });

  describe('Evaluator Extensibility (Change Test B)', () => {
    it('should allow registering a new custom evaluator plugin seamlessly', async () => {
      // Define a custom Rubric / Linter Evaluator
      class StrictKeywordEvaluator extends Evaluator {
        constructor() {
          super('strict-keyword-linter');
        }

        async evaluate(submission, problem) {
          return {
            evaluatorType: this.type,
            criterionResults: problem.rubricCriteria.map(c => ({
              criterionName: c.name,
              score: 100,
              evidence: 'Passed strict linter plugin',
              concern: '',
              suggestion: 'Plugin check satisfied',
              confidence: 'high'
            })),
            overallScore: 100,
            strengths: ['All keywords matched custom plugin criteria'],
            concerns: [],
            suggestions: []
          };
        }
      }

      const customEvaluator = new StrictKeywordEvaluator();
      evaluationService.registerEvaluator('strict-keyword-linter', customEvaluator);

      const retrieved = evaluationService.getEvaluator('strict-keyword-linter');
      expect(retrieved).toBe(customEvaluator);
      expect(retrieved.getType()).toBe('strict-keyword-linter');

      const evaluation = await retrieved.evaluate({}, vendingMachineProblem);
      expect(evaluation.overallScore).toBe(100);
      expect(evaluation.evaluatorType).toBe('strict-keyword-linter');
    });
  });
});
