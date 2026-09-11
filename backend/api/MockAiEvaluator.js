const Evaluator = require('./Evaluator');

/**
 * MockAiEvaluator
 * 
 * Simulates an LLM-powered evaluation layer without pretending to call an external API.
 * Demonstrates how an AI evaluation agent analyzes architectural trade-offs,
 * SOLID principles, design pattern suitability, and clean separation of concerns.
 * 
 * Returns identical output structure as DeterministicEvaluator for seamless swapping.
 */
class MockAiEvaluator extends Evaluator {
  constructor() {
    super('mock-ai');
  }

  async evaluate(submission, problem) {
    if (!problem || !problem.rubricCriteria || problem.rubricCriteria.length === 0) {
      throw new Error('Cannot evaluate submission: Problem has no rubric criteria defined.');
    }

    // Simulate minor asynchronous processing time for realism
    await new Promise(resolve => setTimeout(resolve, 80));

    const criterionResults = [];
    const strengths = [];
    const concerns = [];
    const suggestions = [];

    const textLength = (
      (submission.requirementsUnderstanding || '').length +
      (submission.classes || '').length +
      (submission.responsibilities || '').length +
      (submission.relationships || '').length
    );

    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const criterion of problem.rubricCriteria) {
      const result = this.generateAiCritique(criterion, submission, textLength);
      criterionResults.push(result);

      totalWeightedScore += result.score * (criterion.weight || 1);
      totalWeight += (criterion.weight || 1);

      if (result.score >= 75) {
        strengths.push(`[AI Review] ${criterion.name}: ${result.evidence}`);
      } else {
        concerns.push(`[AI Review] ${criterion.name}: ${result.concern}`);
        suggestions.push(`[AI Suggestion] ${result.suggestion}`);
      }
    }

    const overallScore = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;

    // Architectural high-level observations
    if (submission.classes && submission.classes.toLowerCase().includes('state')) {
      strengths.push('[AI Insight] Effective use of the State Pattern to decouple operational modes.');
    }
    if (submission.relationships && submission.relationships.toLowerCase().includes('composition')) {
      strengths.push('[AI Insight] Favors composition over inheritance, improving extensibility.');
    }

    return {
      evaluatorType: this.type,
      criterionResults,
      overallScore,
      strengths,
      concerns,
      suggestions,
      aiModelNote: 'Evaluated using simulated Mock AI heuristic adapter (Deterministic offline LLM simulation).'
    };
  }

  generateAiCritique(criterion, submission, textLength) {
    const isDetailed = textLength > 250;
    const criterionName = criterion.name.toLowerCase();

    let score = 70;
    let evidence = '';
    let concern = '';
    let suggestion = '';

    if (criterionName.includes('domain') || criterionName.includes('class')) {
      const classCount = (submission.classes || '').split('\n').filter(l => l.trim().length > 0).length;
      if (classCount >= 3) {
        score = isDetailed ? 88 : 78;
        evidence = `Good entity breakdown with distinct domain models identified: ${submission.classes.slice(0, 60)}...`;
        concern = 'Ensure data fields remain encapsulated with clear access boundaries.';
        suggestion = 'Consider identifying helper or value objects to avoid anemic domain models.';
      } else {
        score = 55;
        evidence = 'Minimal class definition detected.';
        concern = 'Too few domain entities identified to adequately represent the problem requirements.';
        suggestion = 'Decompose the primary system controller into specialized entity and service classes.';
      }
    } else if (criterionName.includes('responsibility') || criterionName.includes('srp') || criterionName.includes('pattern')) {
      const hasPattern = /(state|strategy|factory|observer|singleton)/i.test(submission.responsibilities || '');
      if (hasPattern) {
        score = 90;
        evidence = 'Demonstrates appropriate architectural pattern application and cohesive responsibilities.';
        concern = 'Avoid over-engineering if simpler abstractions suffice.';
        suggestion = 'Document the state transition triggers and failure rollbacks clearly.';
      } else {
        score = 65;
        evidence = 'Responsibilities are described in general terms.';
        concern = 'A single class may be shouldering too many responsibilities (potential God Object).';
        suggestion = 'Apply the Single Responsibility Principle: separate business logic from storage/hardware interfaces.';
      }
    } else if (criterionName.includes('edge') || criterionName.includes('concurrency') || criterionName.includes('error')) {
      const edgeCaseText = (submission.edgeCases || '').toLowerCase();
      if (edgeCaseText.length > 40) {
        score = 85;
        evidence = `Identified nuanced runtime edge cases: "${submission.edgeCases.slice(0, 60)}..."`;
        concern = 'Validate whether retry policies or idempotency tokens are required.';
        suggestion = 'Detail thread-safety mechanisms (e.g. locks, synchronized blocks, atomic primitives).';
      } else {
        score = 45;
        evidence = 'Edge cases section is sparse or omitted.';
        concern = 'System lacks concrete failure resilience mechanisms for race conditions or out-of-stock states.';
        suggestion = criterion.guidance || 'List at least 3 edge cases: e.g. concurrent requests, hardware failure, timeout.';
      }
    } else {
      score = isDetailed ? 80 : 68;
      evidence = `Addressed criterion requirements with reasonable clarity.`;
      concern = 'Could benefit from deeper analysis of system trade-offs.';
      suggestion = criterion.guidance || 'Provide more concrete rationale for your design choices.';
    }

    return {
      criterionId: criterion._id,
      criterionName: criterion.name,
      weight: criterion.weight,
      score,
      evidence,
      concern,
      suggestion,
      confidence: 'medium'
    };
  }
}

module.exports = MockAiEvaluator;
