# Design Note: LLD Practice Platform

## 1. Executive Summary & MVP Scope

The LLD Practice Platform (**LLD Studio**) is an interactive environment built to close the feedback loop in Low-Level Design interview preparation. Unlike conventional code-checking judges (which test syntax and runtime execution) or passive video tutorials (which induce false confidence), this platform evaluates **architectural thinking**: domain entity decomposition, single-responsibility boundaries, design pattern suitability, and edge-case handling.

### MVP Scope Boundaries
- **In Scope (MUST)**:
  - Curated problem bank (Vending Machine, Multi-Floor Parking Lot) with explicit requirements, constraints, and weighted rubrics.
  - 6-dimension structured text submission (Requirements, Assumptions, Classes, Responsibilities, Relationships, Edge Cases).
  - Pluggable evaluator strategy (`RuleBasedEvaluator` and `MockAIEvaluator`) sharing a unified evaluation contract.
  - Granular, evidence-based feedback explaining *why* a design scored as it did.
  - Immutable submission history with retry capability, allowing candidates to refine designs without overwriting previous attempts.
- **Explicit Non-Goals (HLD / Out of Scope)**:
  - Microservices, distributed message brokers (Kafka/RabbitMQ), Redis caching clusters, Kubernetes, or multi-region deployment.
  - Diagram canvas editors or code compilation sandboxes (distracting from architectural reasoning in a 2-day MVP).
  - External paid LLM API dependency (simulated offline via honest, heuristic mock evaluator).

---

## 2. Learner Journey & Practice Loop

The platform enforces a continuous improvement cycle:

```
[Problem Catalog] 
       ↓ (Select Problem)
[Read Specification & Rubrics] 
       ↓ (Draft 6 Structured Sections)
[Submit for Evaluation] 
       ↓ (State: Submitted → Evaluating)
[Persist Submission (MongoDB)] 
       ↓ (Run Pluggable Evaluator)
[Receive Explainable Feedback] (Evidence, Scores, Recommendations)
       ↓
[Review History] ←── (Compare Attempts & Score Progression)
       ↓
[Iterate & Try Again] ───→ (Refine Design Without Data Loss)
```

---

## 3. Domain Model & Architecture

The backend is architected as a **Modular Monolith** with clean domain boundaries:

```
React (Frontend SPA)
       │ HTTP / JSON
       ▼
Express API Router (`/api/problems`, `/api/attempts`)
       │
Application Services (`evaluationService`)
       │
Domain Evaluators (Strategy Pattern)
  ├── RuleBasedEvaluator (Deterministic keyword & structural checks)
  └── MockAiEvaluator (Heuristic architectural trade-off simulation)
       │
Mongoose Repositories / Models
       ▼
MongoDB Persistence Layer
```

### Core Domain Entities & Responsibilities

| Entity | Primary Responsibility | Key Fields |
|---|---|---|
| **Problem** | Stores challenge specification, functional requirements, operational constraints, and evaluation rubrics. | `id`, `slug`, `title`, `difficulty`, `requirements[]`, `scenarios[]`, `constraints[]`, `rubricCriteria[]` |
| **RubricCriterion** | Defines an individual evaluation dimension with target concepts, guidance tips, and weight. | `id`, `name`, `description`, `weight`, `evaluationType`, `keywords[]`, `guidance` |
| **Attempt** | Represents a learner's overarching practice session on a specific problem. Tracks progression and lifecycle state. | `id`, `learnerId`, `problemId`, `status`, `currentSubmissionNumber`, `submissions[]` |
| **Submission** | An immutable snapshot of the learner's design for an iteration. | `id`, `attemptId`, `submissionNumber`, `requirementsUnderstanding`, `assumptions`, `classes`, `responsibilities`, `relationships`, `edgeCases` |
| **Evaluator** (Interface) | Strategy contract declaring `evaluate(submission, problem): Promise<EvaluationResult>`. | `type`, `evaluate()` |
| **EvaluationResult** | Granular evaluation output containing overall score, per-criterion evidence, identified gaps, and recommendations. | `evaluatorType`, `overallScore`, `criterionResults[]`, `strengths[]`, `concerns[]`, `suggestions[]` |

---

## 4. Evaluation Strategy & Explainable Feedback

To ensure feedback is objective and avoids enforcing a single "correct" reference answer, evaluation is decomposed into two complementary strategies:

### 4.1 `RuleBasedEvaluator` (Deterministic)
- **Mechanism**: Scans structured sections against problem rubric criteria keywords and structural entity presence.
- **Scoring**: Calculates deterministic weighted scores (0–100%) scaled by concept coverage.
- **Evidence Extraction**: Directly quotes snippets from the learner's text to prove *where* concepts were identified (e.g., `Found key concept "Vehicle" in context: "..."`).
- **Gaps & Guidance**: Identifies specific missing concepts (e.g., State Pattern, Inventory separation) and surfaces actionable tips.

### 4.2 `MockAIEvaluator` (Simulated LLM Heuristics)
- **Mechanism**: Simulates qualitative architectural review without external API calls or token costs.
- **Heuristics**: Analyzes design pattern declarations (State, Strategy, Factory), single-responsibility separation, class count ratios, and concurrency handling.
- **Uniform Contract**: Outputs the exact same `EvaluationResult` schema as the deterministic evaluator, ensuring the frontend and history tracking remain completely decoupled from the evaluation engine.

---

## 5. Resilience, Failure Handling & Persistence

1. **Submission Persistence Before Evaluation**:
   - When `/api/attempts/:id/submit` is called, the learner's `Submission` is written to MongoDB **before** evaluation executes. If an evaluator throws an unhandled error or times out, the user's written design is never lost.
2. **Attempt Lifecycle States**:
   - States: `Started → Submitted → Evaluating → Completed | Failed`.
   - On evaluation failure, the attempt state marks `Failed`, and the learner can trigger a retry on the exact same submission.
3. **Immutability of Practice History**:
   - Each attempt maintains an ordered list of all historical submissions and their corresponding evaluation results. Clicking "Iterate & Try Again" increments the submission counter without mutating or overwriting past attempts.

---

## 6. Extensibility Verification (Change Tests)

### Change Test A: Transitioning from Text to Diagram/Code Submission
- **Question**: How much of the domain model changes if learners submit a visual UML class diagram or code instead of structured text?
- **Analysis**:
  - `Attempt`, `Problem`, `RubricCriterion`, and `EvaluationResult` remain 100% unchanged.
  - `Submission` simply adds a polymorphic `content` payload (e.g., `format: 'text' | 'diagram' | 'code'`, `diagramJson`, or `codeFiles[]`).
  - An AST-parser or diagram-parser adapter is added to feed parsed entities and relationships into the existing `Evaluator` interface.
  - **Verdict**: Fully isolated; practice loop and persistence layer remain intact.

### Change Test B: Swapping Evaluator Strategy (Live LLM or Human Review)
- **Question**: Can a live OpenAI/Claude/Gemini API evaluator or human reviewer be added without rewriting the platform?
- **Analysis**:
  - The `Evaluator` interface standardizes `evaluate(submission, problem): Promise<EvaluationResult>`.
  - Adding a `LiveLlmEvaluator` or `HumanReviewEvaluator` only requires implementing this single method and registering it in `EvaluationService`.
  - The frontend, REST endpoints, and attempt history require zero changes because the output shape is identical.
  - **Verdict**: Complies with the Open-Closed Principle (OCP).

---

## 7. Key Trade-Offs & Decisions

| Decision | Chosen Approach | Alternative Considered | Rationale |
|---|---|---|---|
| **Architecture** | Modular Monolith | Microservices with event bus | Monolith is simpler to run, test, and seed; avoids premature distributed complexity in a 2-day MVP. |
| **Submission Input** | Structured Text (6 fields) | Interactive UML Canvas or Code IDE | Captures core design reasoning (classes, patterns, edge cases) without front-loading canvas editor bugs. |
| **AI Evaluation** | Heuristic Mock Evaluator | Live third-party LLM API | Zero external API key dependencies, deterministic offline testability, zero latency failures. |
| **Database** | MongoDB (Mongoose) | PostgreSQL / SQLite | Hierarchical attempt-submission-evaluation document structure maps naturally to document collections. |
