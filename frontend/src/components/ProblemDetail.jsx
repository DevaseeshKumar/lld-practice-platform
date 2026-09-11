import React, { useState } from 'react';

export default function ProblemDetail({ problem }) {
  const [activeTab, setActiveTab] = useState('requirements'); // 'requirements' | 'scenarios' | 'constraints' | 'rubric'

  if (!problem) return null;

  return (
    <div className="glass-panel" style={{ padding: '24px', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className={`badge ${problem.difficulty === 'Easy' ? 'badge-easy' : problem.difficulty === 'Hard' ? 'badge-hard' : 'badge-medium'}`}>
            {problem.difficulty}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>LLD Problem Specification</span>
        </div>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '6px', color: '#0f172a' }}>{problem.title}</h2>
        <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.5' }}>{problem.context}</p>
      </div>

      {/* Navigation Tabs (Without 'All' tag) */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'requirements' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('requirements')}
        >
          Requirements ({problem.requirements?.length || 0})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'scenarios' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('scenarios')}
        >
          Scenarios ({problem.scenarios?.length || 0})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'constraints' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('constraints')}
        >
          Constraints ({problem.constraints?.length || 0})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'rubric' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('rubric')}
        >
          Rubric ({problem.rubricCriteria?.length || 0})
        </button>
      </div>

      {/* Main Content Area */}
      <div className="animate-fade-in">
        
        {/* SECTION 1: Functional Requirements */}
        {activeTab === 'requirements' && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#0f172a', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Functional Requirements</span>
              <span className="badge badge-evaluator">{problem.requirements?.length || 0} Items</span>
            </h4>
            <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {problem.requirements?.map((req, idx) => (
                <li key={idx} style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.5' }}>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* SECTION 2: Example Scenarios & Walkthroughs */}
        {activeTab === 'scenarios' && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#0f172a', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Example Scenarios & Use Cases</span>
              <span className="badge badge-evaluator">{problem.scenarios?.length || 0} Scenarios</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {problem.scenarios?.map((sc, idx) => (
                <div key={idx} style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderLeft: '3px solid #2563eb',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  fontSize: '0.86rem',
                  color: '#334155',
                  lineHeight: '1.45'
                }}>
                  <strong style={{ color: '#0f172a' }}>Case {idx + 1}: </strong>
                  {sc}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: Design Constraints */}
        {activeTab === 'constraints' && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#0f172a', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Design Constraints & Rules</span>
              <span className="badge badge-medium">{problem.constraints?.length || 0} Rules</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {problem.constraints?.map((c, idx) => (
                <div key={idx} style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderLeft: '3px solid #d97706',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  fontSize: '0.86rem',
                  color: '#92400e',
                  lineHeight: '1.45'
                }}>
                  <strong style={{ color: '#78350f' }}>Constraint {idx + 1}: </strong>
                  {c}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: Rubric Dimensions */}
        {activeTab === 'rubric' && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#0f172a', marginBottom: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Evaluation Rubric</span>
              <span className="badge badge-ai">{problem.rubricCriteria?.length || 0} Dimensions</span>
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>
              Submissions are scored strictly against these criteria:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {problem.rubricCriteria?.map((crit, idx) => (
                <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.88rem', color: '#0f172a' }}>{crit.name}</span>
                    <span className="badge badge-evaluator">{Math.round(crit.weight * 100)}% Weight</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '6px' }}>{crit.description}</p>
                  {crit.guidance && (
                    <div style={{ fontSize: '0.8rem', color: '#1d4ed8', background: '#eff6ff', padding: '5px 8px', borderRadius: '4px' }}>
                      <strong>Tip:</strong> {crit.guidance}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
