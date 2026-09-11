# Research Note: LLD Practice Platform

## 1. The Learner Problem

Software engineers preparing for Low-Level Design (LLD) interviews face a significant feedback gap. Unlike Data Structures & Algorithms (DSA), where solutions have definitive correct answers and automated judges, LLD is inherently subjective — multiple valid designs exist for any given problem. This creates several pain points:

- **Passive learning trap**: Watching video walkthroughs creates false confidence. The design seems "obvious" when presented by an expert, but learners struggle to produce their own designs from scratch.
- **No structured feedback**: Without a mentor or automated review, learners repeat the same architectural mistakes (god classes, tight coupling, missing abstractions) without knowing what to improve.
- **"Blank editor" panic**: Under pressure, learners jump into coding without defining entities, responsibilities, or interfaces — skipping the design thinking that interviewers actually evaluate.
- **Subjectivity confusion**: Two senior engineers may disagree on the "best" approach, making it feel like a guessing game. Learners need rubric-based evaluation that rewards sound reasoning rather than one exact answer.
- **No practice history**: Learners cannot track improvement over time or identify recurring weaknesses across attempts.

## 2. Existing Approaches & Tools

### 2.1 awesome-low-level-design (GitHub)
A widely-used open-source repository aggregating LLD problems, solutions, and design patterns. **Strengths:** Comprehensive problem bank, community-contributed solutions, free. **Gaps:** No interactive practice loop, no submission mechanism, no automated feedback, no progress tracking. Learners must self-evaluate by comparing their design to a reference solution — which reinforces the single-answer mindset.

### 2.2 AlgoMaster.io
Offers a structured LLD curriculum with interactive coding problems and AI-powered mock interviews. **Strengths:** Structured curriculum, AI feedback simulation, interview-like scenarios. **Gaps:** Paid platform, feedback is interview-focused rather than rubric-based, limited emphasis on explaining *why* a design is strong or weak with evidence.

### 2.3 HelloInterview
Built by FAANG hiring managers, provides "in a hurry" guides and structured LLD preparation. **Strengths:** Expert-authored content, practical interview framing. **Gaps:** Primarily passive content (guides, not interactive practice), no submission/evaluation mechanism, no attempt history or improvement tracking.

### 2.4 LeetCode-style Platforms (CodeChef, LLDcoding)
Extend the familiar competitive-programming model to LLD with MCQs or coding tasks. **Strengths:** Familiar interface, some automated evaluation. **Gaps:** Code-focused rather than design-focused; evaluate whether code compiles/runs rather than whether the design is well-structured, extensible, and reasoned.

## 3. Key Gaps Identified

| Gap | Impact |
|---|---|
| **No explainable feedback** | Learners get pass/fail or a score without understanding *why* — they can't act on the feedback |
| **Single-answer grading** | Evaluators compare against one reference design, penalizing valid alternatives |
| **No repeated practice loop** | Platforms present problems but don't support submit → feedback → retry → improve |
| **No progress tracking** | Learners can't see whether they're improving on specific rubric dimensions over time |
| **No evidence-based critique** | Feedback like "your design is bad" doesn't point to specific parts of the submission |
| **Design vs. code confusion** | Most platforms evaluate code correctness, not design quality (responsibilities, coupling, extensibility) |

## 4. Product Direction

A focused LLD practice platform that closes the feedback gap with:

1. **A small, curated problem bank** (Vending Machine, Parking Lot) with rich requirements, scenarios, and constraints — enough context to attempt without a mentor.
2. **Structured text submission** capturing requirements understanding, assumptions, classes, responsibilities, relationships, and edge cases — the evidence needed for rubric-based evaluation.
3. **Rubric-based evaluation** with 5–7 criteria per problem, covering requirement understanding, class responsibilities, coupling/cohesion, encapsulation, extensibility, edge cases, and explanation quality.
4. **Explainable, evidence-based feedback** where every score points to specific evidence (or absence) in the learner's submission — not generic advice.
5. **Two evaluator strategies**: a deterministic `RuleBasedEvaluator` for structural checks and a `MockAIEvaluator` for judgment-heavy heuristics, both behind a shared interface that allows a future real LLM evaluator to be swapped in.
6. **Attempt history with score trends** so learners can see improvement across retries and identify persistent weaknesses.
7. **Retry without data loss** — every submission and evaluation is preserved, supporting the "review → improve → retry" learning loop.

The goal is not a large LMS or assessment platform, but a small, convincing product that demonstrates: a learner can practice an LLD problem, receive meaningful feedback, understand what to improve, retry, and measurably get better.
