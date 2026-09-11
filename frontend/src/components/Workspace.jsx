import React, { useState } from 'react';
import { SAMPLE_SUBMISSIONS } from '../data/templates';

export default function Workspace({
  problem,
  formData,
  setFormData,
  onSubmit,
  submitting,
  evaluatorType,
  submissionNumber = 1
}) {
  const [errorMsg, setErrorMsg] = useState('');
  const [openReferenceSections, setOpenReferenceSections] = useState({});
  const [showTopGuide, setShowTopGuide] = useState(true);

  const sampleData = SAMPLE_SUBMISSIONS[problem?.slug]?.comprehensive || {};

  const toggleReference = (field) => {
    setOpenReferenceSections(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errorMsg) setErrorMsg('');
  };

  const handleInsertSectionExample = (field) => {
    if (sampleData[field]) {
      handleInputChange(field, sampleData[field]);
    }
  };

  const handleLoadSample = (type) => {
    const templates = SAMPLE_SUBMISSIONS[problem?.slug];
    if (templates && templates[type]) {
      setFormData(templates[type]);
      setErrorMsg('');
    }
  };

  const handleClear = () => {
    setFormData({
      requirementsUnderstanding: '',
      assumptions: '',
      classes: '',
      responsibilities: '',
      relationships: '',
      edgeCases: ''
    });
    setErrorMsg('');
  };

  const validateAndSubmit = (e) => {
    e.preventDefault();

    if (!formData.requirementsUnderstanding || formData.requirementsUnderstanding.trim().length < 5) {
      setErrorMsg('Please complete "Requirements Understanding" (minimum 5 characters).');
      return;
    }
    if (!formData.classes || formData.classes.trim().length < 5) {
      setErrorMsg('Please complete "Classes & Domain Entities" (minimum 5 characters).');
      return;
    }
    if (!formData.responsibilities || formData.responsibilities.trim().length < 5) {
      setErrorMsg('Please complete "Class Responsibilities & Methods" (minimum 5 characters).');
      return;
    }
    if (!formData.relationships || formData.relationships.trim().length < 5) {
      setErrorMsg('Please complete "Relationships & Design Patterns" (minimum 5 characters).');
      return;
    }

    setErrorMsg('');
    onSubmit();
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', height: '100%', overflowY: 'auto' }}>
      {/* Workspace Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>Structured Design Workspace</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Submission Iteration #{submissionNumber} • Submissions are immutable and saved to history
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={() => handleLoadSample('comprehensive')}
            title="Populate all fields with a high-quality reference design"
          >
            Load Full Reference Sample
          </button>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={() => handleLoadSample('minimal')}
            title="Populate with a minimal/weak design to test constructive feedback"
          >
            Load Incomplete Sample
          </button>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Top Reference & Rubric Checklist (Tracker aligned) */}
      {showTopGuide && (
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '18px',
          fontSize: '0.84rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <strong style={{ color: '#1e40af' }}>
              Reference Guidance for {problem?.title || 'this Problem'}:
            </strong>
            <button
              type="button"
              onClick={() => setShowTopGuide(false)}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Dismiss
            </button>
          </div>
          <p style={{ color: '#1e3a8a', lineHeight: '1.5', marginBottom: '6px' }}>
            Per the LLD evaluation criteria, reviewers reward clear architectural trade-offs: separate controllers from inventory/data, model lifecycle transitions with design patterns (e.g. State or Strategy), and explicitly address edge cases (out-of-stock vs insufficient funds, thread-safe allocations).
          </p>
          <div style={{ fontSize: '0.78rem', color: '#2563eb' }}>
            Tip: Click <strong>"Show Reference Example"</strong> on any section below to see sample inputs you can use as inspiration or insert directly.
          </div>
        </div>
      )}

      {errorMsg && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#b91c1c',
          padding: '10px 14px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '0.85rem'
        }}>
          <strong>Note:</strong> {errorMsg}
        </div>
      )}

      <form onSubmit={validateAndSubmit}>
        {/* Section 1: Requirements Understanding */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>
              <span>1. Requirements Understanding <span style={{ color: '#dc2626' }}>*</span></span>
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => toggleReference('requirementsUnderstanding')}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {openReferenceSections.requirementsUnderstanding ? 'Hide Reference' : 'Show Reference Example'}
              </button>
              <span className="form-hint">{(formData.requirementsUnderstanding || '').length} chars</span>
            </div>
          </div>

          {openReferenceSections.requirementsUnderstanding && (
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px 12px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#0f172a' }}>Reference Example:</span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                  onClick={() => handleInsertSectionExample('requirementsUnderstanding')}
                >
                  Insert into Box
                </button>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: '1.45' }}>
                {sampleData.requirementsUnderstanding}
              </div>
            </div>
          )}

          <textarea
            className="form-textarea"
            placeholder="Summarize the core problem, boundaries, and primary capabilities..."
            value={formData.requirementsUnderstanding || ''}
            onChange={(e) => handleInputChange('requirementsUnderstanding', e.target.value)}
          />
        </div>

        {/* Section 2: Assumptions */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>
              <span>2. Assumptions & Constraints (Optional)</span>
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => toggleReference('assumptions')}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {openReferenceSections.assumptions ? 'Hide Reference' : 'Show Reference Example'}
              </button>
              <span className="form-hint">{(formData.assumptions || '').length} chars</span>
            </div>
          </div>

          {openReferenceSections.assumptions && (
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px 12px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#0f172a' }}>Reference Example:</span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                  onClick={() => handleInsertSectionExample('assumptions')}
                >
                  Insert into Box
                </button>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#334155', whiteSpace: 'pre-wrap', lineHeight: '1.45' }}>
                {sampleData.assumptions}
              </div>
            </div>
          )}

          <textarea
            className="form-textarea"
            style={{ minHeight: '80px' }}
            placeholder="Document operating assumptions (e.g. concurrency limits, payment types, capacity)..."
            value={formData.assumptions || ''}
            onChange={(e) => handleInputChange('assumptions', e.target.value)}
          />
        </div>

        {/* Section 3: Core Classes & Entities */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>
              <span>3. Core Classes & Domain Entities <span style={{ color: '#dc2626' }}>*</span></span>
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => toggleReference('classes')}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {openReferenceSections.classes ? 'Hide Reference' : 'Show Reference Example'}
              </button>
              <span className="form-hint">{(formData.classes || '').length} chars</span>
            </div>
          </div>

          {openReferenceSections.classes && (
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px 12px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#0f172a' }}>Reference Example:</span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                  onClick={() => handleInsertSectionExample('classes')}
                >
                  Insert into Box
                </button>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#334155', whiteSpace: 'pre-wrap', lineHeight: '1.45' }}>
                {sampleData.classes}
              </div>
            </div>
          )}

          <textarea
            className="form-textarea"
            placeholder="List your classes, interfaces, and enums (e.g., VendingMachine, State, Product, Inventory)..."
            value={formData.classes || ''}
            onChange={(e) => handleInputChange('classes', e.target.value)}
          />
        </div>

        {/* Section 4: Responsibilities */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>
              <span>4. Class Responsibilities & Methods <span style={{ color: '#dc2626' }}>*</span></span>
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => toggleReference('responsibilities')}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {openReferenceSections.responsibilities ? 'Hide Reference' : 'Show Reference Example'}
              </button>
              <span className="form-hint">{(formData.responsibilities || '').length} chars</span>
            </div>
          </div>

          {openReferenceSections.responsibilities && (
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px 12px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#0f172a' }}>Reference Example:</span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                  onClick={() => handleInsertSectionExample('responsibilities')}
                >
                  Insert into Box
                </button>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#334155', whiteSpace: 'pre-wrap', lineHeight: '1.45' }}>
                {sampleData.responsibilities}
              </div>
            </div>
          )}

          <textarea
            className="form-textarea"
            placeholder="Detail key methods and SRP boundaries for each class..."
            value={formData.responsibilities || ''}
            onChange={(e) => handleInputChange('responsibilities', e.target.value)}
          />
        </div>

        {/* Section 5: Relationships & Design Patterns */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>
              <span>5. Relationships & Applied Patterns <span style={{ color: '#dc2626' }}>*</span></span>
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => toggleReference('relationships')}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {openReferenceSections.relationships ? 'Hide Reference' : 'Show Reference Example'}
              </button>
              <span className="form-hint">{(formData.relationships || '').length} chars</span>
            </div>
          </div>

          {openReferenceSections.relationships && (
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px 12px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#0f172a' }}>Reference Example:</span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                  onClick={() => handleInsertSectionExample('relationships')}
                >
                  Insert into Box
                </button>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#334155', whiteSpace: 'pre-wrap', lineHeight: '1.45' }}>
                {sampleData.relationships}
              </div>
            </div>
          )}

          <textarea
            className="form-textarea"
            placeholder="Specify relationships (Composition, Inheritance) and patterns (State, Strategy, Factory)..."
            value={formData.relationships || ''}
            onChange={(e) => handleInputChange('relationships', e.target.value)}
          />
        </div>

        {/* Section 6: Edge Cases */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>
              <span>6. Edge Cases & Concurrency Handling</span>
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => toggleReference('edgeCases')}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {openReferenceSections.edgeCases ? 'Hide Reference' : 'Show Reference Example'}
              </button>
              <span className="form-hint">{(formData.edgeCases || '').length} chars</span>
            </div>
          </div>

          {openReferenceSections.edgeCases && (
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px 12px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#0f172a' }}>Reference Example:</span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                  onClick={() => handleInsertSectionExample('edgeCases')}
                >
                  Insert into Box
                </button>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#334155', whiteSpace: 'pre-wrap', lineHeight: '1.45' }}>
                {sampleData.edgeCases}
              </div>
            </div>
          )}

          <textarea
            className="form-textarea"
            style={{ minHeight: '90px' }}
            placeholder="Detail edge case handling: out-of-stock, cancellations, insufficient balance, race conditions..."
            value={formData.edgeCases || ''}
            onChange={(e) => handleInputChange('edgeCases', e.target.value)}
          />
        </div>

        {/* Submit & Evaluator selection footer */}
        <div style={{
          borderTop: '1px solid #e2e8f0',
          paddingTop: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Target Evaluator:</span>
            <span className="badge badge-evaluator">
              {evaluatorType === 'deterministic' ? 'Deterministic Rubric' : 'Mock AI Simulated LLM'}
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ minWidth: '180px' }}
          >
            {submitting ? 'Evaluating Design...' : 'Submit for Evaluation →'}
          </button>
        </div>
      </form>
    </div>
  );
}
