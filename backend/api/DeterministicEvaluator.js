const Evaluator = require('./Evaluator');

/**
 * DeterministicEvaluator
 * 
 * Performs rule-based rubric evaluation:
 * - Scans structured text sections for rubric-specific concepts and keywords
 * - Checks structural completeness (classes, responsibilities, relationships, edge cases)
 * - Quotes direct evidence from the student's submission
 * - Highlights missing components as specific concerns
 * - Provides targeted suggestions for improvement
 * - Calculates transparent, deterministic weighted scores
 */
class DeterministicEvaluator extends Evaluator {
  constructor() {
    super('deterministic');
  }

  /**
   * Evaluates submission deterministically against problem rubric criteria.
   */
  async evaluate(submission, problem) {
    if (!problem || !problem.rubricCriteria || problem.rubricCriteria.length === 0) {
      throw new Error('Cannot evaluate submission: Problem has no rubric criteria defined.');
    }

    const fullText = [
      submission.requirementsUnderstanding || '',
      submission.assumptions || '',
      submission.classes || '',
      submission.responsibilities || '',
      submission.relationships || '',
      submission.edgeCases || ''
    ].join(' \n ');

    const criterionResults = [];
    const strengths = [];
    const concerns = [];
    const suggestions = [];

    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const criterion of problem.rubricCriteria) {
      const result = this.evaluateCriterion(criterion, submission, fullText);
      criterionResults.push(result);

      totalWeightedScore += result.score * (criterion.weight || 1);
      totalWeight += (criterion.weight || 1);

      if (result.score >= 80) {
        strengths.push(`${criterion.name}: Strong coverage. Evidence: "${result.evidence.slice(0, 80)}..."`);
      } else if (result.score < 60) {
        if (result.concern) concerns.push(`${criterion.name}: ${result.concern}`);
        if (result.suggestion) suggestions.push(result.suggestion);
      }
    }

    const overallScore = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;

    // Ensure at least one suggestion and one strength or constructive note
    if (strengths.length === 0) {
      strengths.push('Clean submission format following structured design sections.');
    }
    if (suggestions.length === 0 && overallScore < 95) {
      suggestions.push('Consider elaborating further on concurrency guarantees and design pattern justifications.');
    }

    return {
      evaluatorType: this.type,
      criterionResults,
      overallScore,
      strengths,
      concerns,
      suggestions
    };
  }

  evaluateCriterion(criterion, submission, fullText) {
    const keywords = criterion.keywords || [];
    const matchedKeywords = [];
    const missingKeywords = [];

    const lowerFullText = fullText.toLowerCase();

    for (const kw of keywords) {
      if (lowerFullText.includes(kw.toLowerCase())) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    }

    // Baseline score calculation
    let score = 50;
    if (keywords.length > 0) {
      const matchRatio = matchedKeywords.length / keywords.length;
      score = Math.round(matchRatio * 70) + 30; // Scale 30 - 100 based on coverage
    }

    // Section specific quality modifiers
    if (criterion.name.toLowerCase().includes('edge case') || criterion.name.toLowerCase().includes('concurrency')) {
      if (!submission.edgeCases || submission.edgeCases.trim().length < 20) {
        score = Math.min(score, 45);
      }
    }

    if (criterion.name.toLowerCase().includes('class') || criterion.name.toLowerCase().includes('domain')) {
      if (!submission.classes || submission.classes.trim().length < 20) {
        score = Math.min(score, 40);
      }
    }

    score = Math.max(0, Math.min(100, score));

    // Extract evidence snippet
    let evidence = '';
    if (matchedKeywords.length > 0) {
      const firstMatch = matchedKeywords[0];
      const matchIndex = lowerFullText.indexOf(firstMatch.toLowerCase());
      if (matchIndex !== -1) {
        const start = Math.max(0, matchIndex - 30);
        const end = Math.min(fullText.length, matchIndex + firstMatch.length + 50);
        evidence = `Found key concept "${firstMatch}" in context: "${fullText.substring(start, end).trim()}"`;
      } else {
        evidence = `Identified relevant concepts: ${matchedKeywords.join(', ')}`;
      }
    } else {
      evidence = 'No direct keyword or conceptual matches detected in the submission text.';
    }

    // Generate concern & suggestion
    let concern = '';
    let suggestion = '';

    if (missingKeywords.length > 0) {
      concern = `Missing explicit handling for key concepts: ${missingKeywords.slice(0, 3).join(', ')}.`;
      suggestion = criterion.guidance
        ? `For ${criterion.name}: ${criterion.guidance}`
        : `Consider explicitly addressing ${missingKeywords.slice(0, 2).join(' and ')} in your design.`;
    } else {
      concern = 'No major concerns identified for this criterion.';
      suggestion = `Maintain this level of depth in subsequent iterations.`;
    }

    return {
      criterionId: criterion._id,
      criterionName: criterion.name,
      weight: criterion.weight,
      score,
      evidence,
      concern,
      suggestion,
      confidence: 'high'
    };
  }
}

module.exports = DeterministicEvaluator;
