# AI Usage Documentation

## Overview

This document records meaningful AI-assisted decisions made during the development of the LLD Practice Platform. For each decision, it describes what the AI suggested, what was accepted, what was rejected, and why.

> **Important:** No live LLM API was used in the submitted runtime because no API key was available. The application contains a `MockAIEvaluator` that simulates the evaluation contract using deterministic heuristics and is designed to be replaced by a real LLM adapter later. The `MockAIEvaluator` does **not** call any AI model at runtime.

---

## Decision 1: Problem Selection

**Decision:** Which LLD problems to include in the MVP.

**AI Suggestion:** Start with 3 problems — Vending Machine, Parking Lot, and Elevator System — to demonstrate breadth.

**What I Accepted:** Vending Machine and Parking Lot as the initial two problems. Both are state-machine-shaped problems with clear requirements, multiple valid designs, and straightforward rubric evaluation.

**What I Rejected:** Including Elevator in the MVP. Elevator's behavioral complexity makes deterministic evaluation significantly harder, and the 2-day time budget doesn't justify the risk.

**Why:** Two well-implemented problems with thorough rubrics demonstrate the platform's value more convincingly than three problems with shallow evaluation. Elevator is documented as a post-MVP addition.

**Final Implementation:** Two seed problems with 5–7 rubric criteria each, stored as data (not hardcoded into evaluator logic).

---

## Decision 2: Evaluator Abstraction

**Decision:** How to structure the evaluation system.

**AI Suggestion:** Use a Strategy pattern with a shared `Evaluator` interface, implementing `RuleBasedEvaluator` for deterministic checks and `MockAIEvaluator` for judgment-heavy heuristics.

**What I Accepted:** The shared interface approach and the two-evaluator split. Both evaluators return an identical `EvaluationResult` shape, making a future real LLM provider a drop-in replacement.

**What I Rejected:** A single combined evaluator that mixes deterministic and heuristic logic. Also rejected introducing a complex pipeline/chain pattern — the simpler interface-based approach is sufficient for the MVP.

**Why:** Clean separation means each evaluator can be tested independently, and the interface contract ensures any future evaluator (real LLM, human reviewer) plugs in without touching the submission or practice flow.

**Final Implementation:** `Evaluator` interface with `evaluate(submission, problem): EvaluationResult`. Two implementations behind it. An `EvaluationService` orchestrates both and combines results.

---

## Decision 3: Submission Format

**Decision:** What format learners use to submit their LLD solutions.

**AI Suggestion:** Multiple options including code submission, visual diagram editor, and structured text fields.

**What I Accepted:** Structured text with sections for requirements understanding, assumptions, classes, responsibilities, relationships/design explanation, and edge cases.

**What I Rejected:** Diagram editor (too much implementation cost for a 2-day MVP) and raw code submission (doesn't capture design reasoning).

**Why:** Structured text captures enough evidence of design quality to evaluate against rubric criteria, while being the fastest format to build a rubric-based evaluator against. The submission format is abstracted so a future diagram format could be added without rewriting the practice flow.

**Final Implementation:** Six structured text sections, validated on submission, evaluated section-by-section against problem-specific rubric criteria.

---

## Decision 4: Architecture Choice

**Decision:** Whether to use microservices or a monolith.

**AI Suggestion:** Consider microservices to demonstrate distributed systems knowledge (separate evaluation service, problem service, etc.).

**What I Accepted:** Modular monolith with clear internal domain boundaries. The assignment explicitly states "a simple monolith is completely acceptable."

**What I Rejected:** Microservices, Kafka, Redis, and any distributed infrastructure. These add complexity without scoring value and risk incomplete implementation within 2 days.

**Why:** The assignment's highest-weighted criteria are LLD/domain design (25%) and evaluation/feedback (15%) — both are about code quality and design thinking, not infrastructure complexity. A clean monolith with well-separated domains demonstrates stronger engineering judgment than an overengineered distributed system.

**Final Implementation:** Single Node.js + Express backend with domain modules (problems, attempts, evaluation), a React frontend, and MongoDB persistence.

---

## Decision 5: Handling Evaluation Failure

**Decision:** What happens when evaluation fails after a learner submits.

**AI Suggestion:** Persist the submission before triggering evaluation, use explicit state transitions (Submitted → Evaluating → Completed/Failed), and allow retry without losing work.

**What I Accepted:** The full failure-handling approach. Submissions are saved to MongoDB immediately before evaluation begins. If evaluation throws, the attempt moves to "Failed" state but the submission remains intact and retrievable.

**What I Rejected:** Silently swallowing evaluation errors or requiring the learner to re-enter their submission after a failure.

**Why:** Losing a learner's design work due to an evaluator bug would be a terrible user experience. The persist-first pattern ensures data safety and maps cleanly to the Attempt lifecycle states.

**Final Implementation:** Submission persisted → status set to "Evaluating" → evaluation runs → on success, status = "Completed"; on failure, status = "Failed" with submission preserved. Retry creates a new evaluation attempt against the same submission.
