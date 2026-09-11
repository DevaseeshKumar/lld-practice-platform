import React from 'react';

export default function CatalogPage({ problems, onSelectProblem, loading, onNavigateHelp }) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ fontSize: '1rem', color: '#64748b' }}>Loading available LLD challenges...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '36px', textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }}>
        <span className="badge badge-evaluator" style={{ marginBottom: '12px' }}>
          Interview Preparation
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '12px', color: '#0f172a' }}>
          Master Object-Oriented System Design
        </h1>
        <p style={{ fontSize: '1.02rem', color: '#475569', lineHeight: '1.6' }}>
          Practice real-world LLD problems, submit structured designs, and receive transparent rubric-based evaluations with constructive feedback.
        </p>

        <div style={{ marginTop: '16px' }}>
          <button 
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onNavigateHelp}
            style={{ color: '#2563eb', borderColor: '#bfdbfe', background: '#eff6ff' }}
          >
            New here? Read the Platform Guide & FAQ →
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px',
        maxWidth: '1020px',
        margin: '0 auto'
      }}>
        {problems.map((prob) => {
          const badgeClass = prob.difficulty === 'Easy' ? 'badge-easy' : prob.difficulty === 'Hard' ? 'badge-hard' : 'badge-medium';
          return (
            <div 
              key={prob._id || prob.slug}
              className="glass-panel"
              style={{
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
              }}
              onClick={() => onSelectProblem(prob)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span className={`badge ${badgeClass}`}>{prob.difficulty}</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {prob.rubricCriteria?.length || 4} Rubric Criteria
                  </span>
                </div>

                <h2 style={{ fontSize: '1.35rem', marginBottom: '10px', color: '#0f172a' }}>{prob.title}</h2>
                <p style={{ fontSize: '0.92rem', marginBottom: '24px', lineHeight: '1.6', color: '#334155' }}>
                  {prob.description}
                </p>
              </div>

              <div>
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Practice Loop: <strong>Design → Submit → Evaluate</strong>
                  </div>
                  <button className="btn btn-primary btn-sm">
                    Start Session →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
