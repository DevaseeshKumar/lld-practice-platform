import React from 'react';

export default function Navbar({
  currentPage,
  onNavigateHome,
  onNavigateHelp,
  activeProblem,
  evaluatorType,
  onEvaluatorChange
}) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand" onClick={onNavigateHome} title="Return to catalog">
          <div className="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </div>
          <div>
            <div className="brand-title">LLD Studio</div>
            <div className="brand-subtitle">Low-Level Design Practice Platform</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Navigation Links */}
          <button 
            className={`btn btn-sm ${currentPage === 'catalog' && !activeProblem ? 'btn-primary' : 'btn-secondary'}`}
            onClick={onNavigateHome}
          >
            Problems
          </button>

          <button 
            className={`btn btn-sm ${currentPage === 'help' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={onNavigateHelp}
          >
            Help & Guide
          </button>

          {activeProblem && (
            <button 
              className="btn btn-outline btn-sm"
              onClick={onNavigateHome}
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>←</span>
              <span>Back to Catalog</span>
            </button>
          )}

          {/* Evaluator Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f8fafc',
            padding: '5px 10px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0'
          }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '500' }}>Evaluator:</span>
            <select
              value={evaluatorType}
              onChange={(e) => onEvaluatorChange(e.target.value)}
              style={{
                background: '#ffffff',
                color: '#0f172a',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                outline: 'none',
                fontWeight: '500'
              }}
            >
              <option value="deterministic">Deterministic (Rule-Based)</option>
              <option value="mock-ai">Mock AI (Simulated LLM)</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669', display: 'inline-block' }}></span>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>API Connected</span>
          </div>
        </div>
      </div>
    </header>
  );
}
