import React, { useState } from 'react';

export default function AttemptHistory({
  submissionsWithEvaluations = [],
  onClose,
  onLoadIntoWorkspace
}) {
  const [selectedIdx, setSelectedIdx] = useState(submissionsWithEvaluations.length - 1);

  const currentItem = submissionsWithEvaluations[selectedIdx] || null;

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>Iteration History & Progression</h3>
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
            {submissionsWithEvaluations.length} recorded submission(s) • Submissions are immutable
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={onClose}>
          Close History
        </button>
      </div>

      {/* Progression timeline bar */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
        {submissionsWithEvaluations.map((item, idx) => {
          const score = item.evaluationResult?.overallScore || 0;
          const scoreColor = score >= 80 ? '#059669' : score >= 60 ? '#d97706' : '#dc2626';
          const isSelected = idx === selectedIdx;

          return (
            <div
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              style={{
                background: isSelected ? '#eff6ff' : '#ffffff',
                border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px 18px',
                cursor: 'pointer',
                minWidth: '150px',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#0f172a' }}>
                  Iteration #{item.submission?.submissionNumber || idx + 1}
                </span>
                <span style={{ fontSize: '0.88rem', fontWeight: '700', color: scoreColor }}>
                  {score}%
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {item.submission?.createdAt ? new Date(item.submission.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Saved'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Iteration Detail */}
      {currentItem && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '1.02rem', color: '#0f172a' }}>
              Snapshot of Submission #{currentItem.submission?.submissionNumber} (Score: {currentItem.evaluationResult?.overallScore}%)
            </h4>

            {onLoadIntoWorkspace && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onLoadIntoWorkspace(currentItem.submission)}
                title="Load this submission into editor to continue improving"
              >
                Load This into Workspace
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.86rem' }}>
            <div>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: '4px' }}>Requirements Understanding:</strong>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '6px', color: '#334155', whiteSpace: 'pre-wrap' }}>
                {currentItem.submission?.requirementsUnderstanding}
              </div>
            </div>

            <div>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: '4px' }}>Classes & Entities:</strong>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '6px', color: '#334155', whiteSpace: 'pre-wrap' }}>
                {currentItem.submission?.classes}
              </div>
            </div>

            <div>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: '4px' }}>Responsibilities:</strong>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '6px', color: '#334155', whiteSpace: 'pre-wrap' }}>
                {currentItem.submission?.responsibilities}
              </div>
            </div>

            <div>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: '4px' }}>Relationships:</strong>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '6px', color: '#334155', whiteSpace: 'pre-wrap' }}>
                {currentItem.submission?.relationships}
              </div>
            </div>

            {currentItem.submission?.edgeCases && (
              <div>
                <strong style={{ color: '#2563eb', display: 'block', marginBottom: '4px' }}>Edge Cases & Concurrency:</strong>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '6px', color: '#334155', whiteSpace: 'pre-wrap' }}>
                  {currentItem.submission?.edgeCases}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
