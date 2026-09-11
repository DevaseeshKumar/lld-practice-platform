# LLD Practice Platform

> A focused Low-Level Design practice platform that helps learners choose a problem, design a solution, submit structured text, receive rubric-based explainable feedback, review their work, and retry to improve.

## Problem Statement

Learners preparing for LLD/system-design interviews lack structured practice environments with meaningful feedback. Most resources are passive (articles, videos) or provide only pass/fail grading without explaining *why* a design is strong or weak. This platform addresses that gap with a guided practice loop:

**Choose Problem → Think/Design → Submit → Get Feedback → Review → Try Again**

## MVP Scope

### Included (MUST)
- **2 LLD Problems**: Vending Machine, Parking Lot
- **Structured text submission**: requirements understanding, assumptions, classes, responsibilities, relationships/design explanation, edge cases
- **Rubric-based evaluation**: 5–7 criteria per problem
- **Two evaluator strategies**:
  - `RuleBasedEvaluator` — deterministic structural/keyword checks
  - `MockAIEvaluator` — heuristic-based judgment simulation (NOT a live AI model)
- **Explainable feedback**: per-criterion scores with evidence, concerns, and suggestions
- **Attempt history**: view all past submissions and feedback, score trend across attempts
- **Retry**: new submission without overwriting previous work
- **Failure handling**: submission persisted before evaluation; graceful failure + retry
- **MongoDB persistence**
- **Documentation**: README.md, AI_USAGE.md, RESEARCH_NOTE.md, DESIGN_NOTE.md
- **Tests**: domain models, evaluators (deterministic & mock AI), REST API, edge cases

### Excluded (Non-Goals for MVP)
- Microservices, Kafka, Redis, Kubernetes, CDN, sharding
- Complex authentication (simple learner ID only)
- Diagram/code editor for submission
- Real LLM API integration (no API key available)
- Real-time updates / WebSockets
- Multi-region / production deployment
- Large LMS functionality

## Architecture

**Modular Monolith** — a single backend application with clear internal domain boundaries.

```
React (Frontend)
       ↓
Express API (Backend)
       ↓
Application / Domain Services
       ↓
Repositories
       ↓
MongoDB
```

### Evaluation Architecture

```
EvaluationService
       ↓
  Evaluator Interface
       ↓
 ┌──────┴──────────────┐
 ↓                     ↓
RuleBased           MockAI
Evaluator           Evaluator
(deterministic)     (heuristic, NOT live AI)
```

Both evaluators return the same `EvaluationResult` shape, so a future real LLM evaluator can be swapped in without changing the practice flow.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose ODM) |
| Testing | Jest |
| Architecture | Modular monolith |

## Quick Start (Docker)

> **Recommended for GitHub visitors.** Run the entire stack with one command — no local Node.js or MongoDB install needed.

**Prerequisites:** [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

```bash
git clone https://github.com/DevaseeshKumar/lld-practice-platform.git
cd lld-practice-platform
docker compose up --build
```

Once all three containers are running:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/health
- **MongoDB:** localhost:27017

The database is automatically seeded with LLD problems on first startup.

To stop:
```bash
docker compose down
```

To reset the database:
```bash
docker compose down -v
docker compose up --build
```

---

## Manual Setup (Without Docker)

### Prerequisites

- Node.js (v18+)
- npm (v9+)
- MongoDB (local instance or MongoDB Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/DevaseeshKumar/lld-practice-platform.git
cd lld-practice-platform
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB connection string
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

### 4. Seed the database

```bash
cd backend
npm run seed
```

### 5. Run the application

```bash
# Terminal 1 — Backend (Port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (Port 5173)
cd frontend
npm run dev
```

## Environment Variables

See `backend/.env.example` for required variables:

| Variable | Description | Example |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/lld_platform` |
| `PORT` | Backend server port | `5000` |
| `CLIENT_URL` | Frontend client origin | `http://localhost:5173` |
| `EVALUATOR_DEFAULT` | Default evaluation strategy | `deterministic` |

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/problems` | List all problems |
| `GET` | `/api/problems/:id` | Get problem details |
| `POST` | `/api/attempts` | Start a new attempt |
| `GET` | `/api/attempts/:id` | Get attempt details with submissions & evaluations |
| `POST` | `/api/attempts/:id/submit` | Submit a solution for evaluation |
| `GET` | `/api/attempts?learnerId=` | Get attempt history for a learner |

## Testing

```bash
cd backend
npm test
```

## Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Architecture | Modular monolith | Assignment explicitly permits; focus stays on LLD quality |
| Database | MongoDB | MERN stack alignment; suitable for prototype |
| Submission format | Structured text | Sufficient design evidence without diagram-editor complexity |
| Evaluation | Deterministic + Mock AI | No API key available; same output shape enables future real LLM swap |
| Problems | 2 (Vending Machine + Parking Lot) | Strong LLD coverage within 2-day scope |

## Limitations

- **No real LLM API**: `MockAIEvaluator` simulates LLM-style feedback using deterministic heuristics — it does not call any AI model
- **No authentication**: Uses a simple session-based learner identifier
- **Small problem bank**: 2 problems (Vending Machine, Parking Lot)
- **Simple monolith**: No distributed system features
- **No background job system**: Evaluation runs synchronously (structured for future async)
- **Prototype-level security and scaling**

## Future Improvements

- Real LLM evaluator (OpenAI/Gemini/Claude adapter)
- Diagram/code submission format
- Human reviewer evaluator
- More LLD problems (Elevator, BookMyShow, etc.)
- User authentication and profiles
- Background evaluation worker
- Progress analytics and weakness tracking
- Responsive mobile experience

## License

This project was built as a 2-day engineering assignment for CipherSchools.
