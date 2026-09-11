import React from 'react';

export default function EvaluationView({
  evaluationResult,
  submission,
  onRetry,
  onViewHistory
}) {
  if (!evaluationResult) return null;

  const score = evaluationResult.overallScore || 0;
  const scoreClass = score >= 80 ? 'score-high' : score >= 60 ? 'score-med' : 'score-low';
  const scoreColor = score >= 80 ? '#059669' : score >= 60 ? '#d97706' : '#dc2626';

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '28px', height: '100%', overflowY: 'auto' }}>
      {/* Top Banner: Score & Evaluator Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        paddingBottom: '24px',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className={`score-circle ${scoreClass}`}>
            <span className="score-number" style={{ color: scoreColor }}>{score}</span>
            <span className="score-label">Score / 100</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.35rem', color: '#0f172a' }}>Evaluation Report</h2>
              <span className={`badge ${evaluationResult.evaluatorType === 'mock-ai' ? 'badge-ai' : 'badge-evaluator'}`}>
                {evaluationResult.evaluatorType === 'mock-ai' ? 'Mock AI (Simulated LLM)' : 'Deterministic Evaluator'}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Submission #{submission?.submissionNumber || 1} • Evaluated against weighted rubric criteria
            </p>
            {evaluationResult.evaluatorType === 'mock-ai' && (
              <div style={{ fontSize: '0.78rem', color: '#7c3aed', marginTop: '4px' }}>
                Note: Simulated offline LLM heuristic adapter (demonstrates architectural feedback without external API calls).
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={onViewHistory}>
            View Timeline History
          </button>
          <button className="btn btn-primary" onClick={onRetry}>
            Iterate & Try Again →
          </button>
        </div>
      </div>

      {/* Strengths & Suggestions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {/* Key Strengths */}
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '16px' }}>
          <h4 style={{ color: '#065f46', fontSize: '0.92rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Key Strengths & Evidence
          </h4>
          <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {evaluationResult.strengths?.map((str, idx) => (
              <li key={idx} style={{ fontSize: '0.85rem', color: '#047857', lineHeight: '1.45' }}>
                {str}
              </li>
            ))}
          </ul>
        </div>

        {/* Priority Suggestions */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '16px' }}>
          <h4 style={{ color: '#1e40af', fontSize: '0.92rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Priority Recommendations
          </h4>
          <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {evaluationResult.suggestions?.map((sug, idx) => (
              <li key={idx} style={{ fontSize: '0.85rem', color: '#1d4ed8', lineHeight: '1.45' }}>
                {sug}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Criterion Breakdown */}
      <div>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '14px', color: '#0f172a' }}>
          Granular Rubric Breakdown ({evaluationResult.criterionResults?.length || 0} Dimensions)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {evaluationResult.criterionResults?.map((cr, idx) => {
            const cScore = cr.score || 0;
            const cColor = cScore >= 80 ? '#059669' : cScore >= 60 ? '#d97706' : '#dc2626';
            const cBg = cScore >= 80 ? '#ecfdf5' : cScore >= 60 ? '#fffbeb' : '#fef2f2';
            const cBorder = cScore >= 80 ? '#a7f3d0' : cScore >= 60 ? '#fde68a' : '#fecaca';

            return (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontWeight: '700',
                      fontSize: '1.05rem',
                      color: cColor,
                      background: cBg,
                      border: `1px solid ${cBorder}`,
                      padding: '2px 10px',
                      borderRadius: '6px'
                    }}>
                      {cScore}%
                    </span>
                    <span style={{ fontWeight: '600', fontSize: '0.95rem', color: '#0f172a' }}>
                      {cr.criterionName}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {cr.weight && (
                      <span className="badge badge-evaluator">{Math.round(cr.weight * 100)}% Weight</span>
                    )}
                  </div>
                </div>

                {/* Evidence */}
                {cr.evidence && (
                  <div style={{
                    fontSize: '0.82rem',
                    color: '#334155',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    marginBottom: '8px',
                    borderLeft: `3px solid ${cColor}`
                  }}>
                    <strong style={{ color: '#0f172a' }}>Evidence Found: </strong>
                    {cr.evidence}
                  </div>
                )}

                {/* Concern */}
                {cr.concern && cr.concern !== 'No major concerns identified for this criterion.' && (
                  <div style={{ fontSize: '0.82rem', color: '#b91c1c', marginBottom: '6px' }}>
                    <strong>Identified Gap: </strong> {cr.concern}
                  </div>
                )}

                {/* Suggestion */}
                {cr.suggestion && (
                  <div style={{ fontSize: '0.82rem', color: '#1d4ed8' }}>
                    <strong>Actionable Advice: </strong> {cr.suggestion}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
