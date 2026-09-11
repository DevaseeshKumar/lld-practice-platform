import React from 'react';

export default function HelpPage({ onNavigateCatalog }) {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px', paddingTop: '12px' }}>
        <span className="badge badge-evaluator" style={{ marginBottom: '12px' }}>Platform Guide & Documentation</span>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '12px', color: '#0f172a' }}>
          Welcome to LLD Studio
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: '680px', margin: '0 auto' }}>
          A focused Low-Level Design (LLD) practice and interview evaluation environment designed to help you think, architect, submit, and iteratively improve.
        </p>
      </div>

      {/* Quick Navigation / CTA */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '4px', color: '#0f172a' }}>Ready to practice?</h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            Choose a problem from our curated catalog and start designing your solution.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onNavigateCatalog}>
          View Problem Catalog →
        </button>
      </div>

      {/* Guide Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Section 1: The Core Philosophy */}
        <section className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '12px', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
            1. Why Structured Text Instead of Full Code?
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: '1.6', marginBottom: '12px' }}>
            In actual Low-Level Design and Object-Oriented Design interviews at top technology companies, interviewers rarely expect candidates to write hundreds of lines of compilable code within 45 minutes.
          </p>
          <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: '1.6' }}>
            Instead, the interview focuses on <strong>architectural judgment</strong>: identifying core entities, separating responsibilities, selecting appropriate design patterns (like State, Strategy, or Factory), and reasoning about edge cases and concurrency. This platform mirrors that format by guiding you through structured design sections.
          </p>
        </section>

        {/* Section 2: Step-by-Step Practice Loop */}
        <section className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
            2. The Practice Loop: 4 Simple Steps
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontWeight: '700', color: '#2563eb', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '6px' }}>Step 1</div>
              <h4 style={{ fontSize: '0.98rem', marginBottom: '6px', color: '#0f172a' }}>Analyze Requirements</h4>
              <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: '1.5' }}>
                Read the functional requirements, constraints, and rubric criteria shown on the left panel.
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontWeight: '700', color: '#2563eb', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '6px' }}>Step 2</div>
              <h4 style={{ fontSize: '0.98rem', marginBottom: '6px', color: '#0f172a' }}>Draft Structured Design</h4>
              <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: '1.5' }}>
                Fill in the 6 sections using concise bullet points. You can also load our sample templates to test.
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontWeight: '700', color: '#2563eb', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '6px' }}>Step 3</div>
              <h4 style={{ fontSize: '0.98rem', marginBottom: '6px', color: '#0f172a' }}>Get Rubric Evaluation</h4>
              <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: '1.5' }}>
                Receive instant granular feedback: weighted score, strengths, evidence found, and actionable suggestions.
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontWeight: '700', color: '#2563eb', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '6px' }}>Step 4</div>
              <h4 style={{ fontSize: '0.98rem', marginBottom: '6px', color: '#0f172a' }}>Iterate & Improve</h4>
              <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: '1.5' }}>
                Click "Iterate & Try Again". Your previous submission is saved in history while you refine your design.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: The 6 Design Sections */}
        <section className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '14px', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
            3. How to Fill Each Section (Tips for High Scores)
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
              <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>1. Requirements Understanding:</strong>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                Summarize the primary purpose, operational goals, and boundaries of the system in 2-3 sentences.
              </p>
            </div>

            <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
              <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>2. Assumptions & Constraints:</strong>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                State operational assumptions (e.g., single terminal concurrency, hardware sensor triggers, payment denominations).
              </p>
            </div>

            <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
              <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>3. Core Classes & Domain Entities:</strong>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                List your primary classes, interfaces, and enums (e.g., VendingMachine, State, Inventory, Product, Coin).
              </p>
            </div>

            <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
              <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>4. Class Responsibilities & Methods:</strong>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                Detail what each class is responsible for and outline essential methods. Follow the Single Responsibility Principle.
              </p>
            </div>

            <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
              <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>5. Relationships & Design Patterns:</strong>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                Identify relationships (Composition, Aggregation, Inheritance) and state patterns used (e.g., State Pattern for machine states, Strategy Pattern for spot allocation).
              </p>
            </div>

            <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
              <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>6. Edge Cases & Concurrency:</strong>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                Explain handling for out-of-stock, cancellations, insufficient balance, change shortages, and race conditions.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Evaluator Comparison */}
        <section className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '14px', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
            4. Understanding Evaluator Strategies
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ border: '1px solid #bfdbfe', background: '#eff6ff', borderRadius: '10px', padding: '16px' }}>
              <span className="badge badge-evaluator" style={{ marginBottom: '8px' }}>Deterministic (Rule-Based)</span>
              <h4 style={{ fontSize: '1rem', color: '#1e3a8a', marginBottom: '8px' }}>Consistent Structural Rubric</h4>
              <p style={{ fontSize: '0.85rem', color: '#1e40af', lineHeight: '1.5' }}>
                Scans your submission for concrete domain entities, state lifecycle definitions, edge case considerations, and keywords. Provides transparent evidence quotes and missing concept warnings.
              </p>
            </div>

            <div style={{ border: '1px solid #e9d5ff', background: '#faf5ff', borderRadius: '10px', padding: '16px' }}>
              <span className="badge badge-ai" style={{ marginBottom: '8px' }}>Mock AI (Simulated LLM)</span>
              <h4 style={{ fontSize: '1rem', color: '#581c87', marginBottom: '8px' }}>Heuristic Architectural Review</h4>
              <p style={{ fontSize: '0.85rem', color: '#6b21a8', lineHeight: '1.5' }}>
                Simulates an interviewer's qualitative critique of SOLID principles, potential "God Object" anti-patterns, abstraction quality, and concurrency guarantees without calling external paid APIs.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: FAQ */}
        <section className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '14px', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
            5. Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', color: '#0f172a', marginBottom: '4px' }}>
                Do I have to write lengthy essays?
              </h4>
              <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: '1.5' }}>
                No! Concise, structured bullet points are preferred. In interviews, clarity and structure beat verbosity.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', color: '#0f172a', marginBottom: '4px' }}>
                What does the "Load High-Quality Sample" button do?
              </h4>
              <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: '1.5' }}>
                It fills the editor with a complete, reference-grade design. You can submit it immediately to see how a high-scoring evaluation report looks, or use it as inspiration.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', color: '#0f172a', marginBottom: '4px' }}>
                Does submitting again overwrite my past work?
              </h4>
              <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: '1.5' }}>
                Never. Every submission is saved as an immutable snapshot. You can open "View Timeline History" at any point to view past scores and reload any previous version back into your workspace.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
