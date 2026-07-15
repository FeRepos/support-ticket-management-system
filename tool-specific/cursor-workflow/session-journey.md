# Session Journey — Support Ticket Management System

Chronological narrative of building the Core scope with **Cursor (Agent mode)**. Per-phase transcripts live in [`prompt-history/`](../../prompt-history/).

**AI tool:** Cursor (Agent mode)

---

## Phase 0 — Project setup (T0.1–T0.4)

Started from exercise spec in `tool-specific/cursor-workflow/`. Each prompt scoped one task with explicit review stops.

- Scaffolded `client/` (Vite + React) and `server/` (Express)
- Wired `GET /health`, MongoDB via `db.js`, routing shell for list/detail pages
- **Friction:** `npm create vite` blocked in agent sandbox — manual scaffold; user ran `npm install` locally

**Transcript:** [phase-0-project-setup.md](../../prompt-history/phase-0-project-setup.md)

---

## Phase 1 — Data layer (T1.1–T1.4)

Mongoose models for User, Ticket, Comment per `spec.md` §2. Seed script covers all ticket statuses.

**Transcript:** [phase-1-data-layer.md](../../prompt-history/phase-1-data-layer.md)

---

## Phase 2 — State machine (T2.1–T2.2)

Isolated pure `isValidTransition` + `VALID_TRANSITIONS` **before** any HTTP code. Unit tests for valid edges, same-status rejection, tempting invalid transitions.

This was the highest-risk Core item — deliberate layering prevented “helpful” invalid transitions in routes.

**Transcript:** [phase-2-state-machine.md](../../prompt-history/phase-2-state-machine.md)

---

## Phase 3 — Backend API (T3.1–T3.8)

REST routes for users, tickets (CRUD + search/filter), dedicated status endpoint, comments. Centralized `AppError` middleware for consistent `{ error: { message, field? } }`.

Key decision: `PATCH /:id/status` is the **only** path for lifecycle changes; general PATCH rejects `status`.

**Transcript:** [phase-3-backend-api.md](../../prompt-history/phase-3-backend-api.md)

---

## Phase 4 — Backend tests (T4.1–T4.4)

Supertest + `mongodb-memory-server`. Integration tests hit the real status route; invalid transitions assert DB unchanged.

**Transcript:** [phase-4-backend-tests.md](../../prompt-history/phase-4-backend-tests.md)

---

## Ops debugging (between phases)

- MongoDB Atlas TLS — fixed URI + IP allowlist
- Vite proxy `ECONNREFUSED` / wrong port — `VITE_API_PORT`, aligned `.env.example`, README troubleshooting

**Transcript:** [ops-debugging-sessions.md](../../prompt-history/ops-debugging-sessions.md)

---

## Phase 5 — Frontend (T5.1–T5.6)

Design system tokens → dense list → search/filter → create → spacious detail → status controls → comments.

**Tradeoff (T5.5):** Frontend duplicates `VALID_TRANSITIONS` for button rendering; backend remains authoritative.

**Transcript:** [phase-5-frontend.md](../../prompt-history/phase-5-frontend.md)

---

## Phase 6 — Polish & submission (T6.1–T6.9)

| Task | What |
|------|------|
| T6.1 | Full-stack README |
| T6.2 | Secrets audit |
| T6.3 | `tool-workflow.md` (Part A, 11 questions) |
| T6.4 | `reflection.md`, `PR_DESCRIPTION.md` |
| T6.5 | `prompt-history/` per-phase exports |
| T6.6 | Expanded tests (search, comments, updates) → 71 tests |
| T6.7 | Root `requirements.md` |
| T6.8 | Restored prompt-history folder layout |
| T6.9 | Reorganized artifacts to `tool-specific/cursor-workflow/` + `.cursor/` (reference layout) |

**Transcripts:** [phase-6-polish-part1.md](../../prompt-history/phase-6-polish-part1.md), [phase-6-polish-part2.md](../../prompt-history/phase-6-polish-part2.md), [phase-6-extensions.md](../../prompt-history/phase-6-extensions.md)

---

## Verification summary

| Check | Result |
|-------|--------|
| `cd server && npm test` | 71 tests, 9 suites |
| Manual UI flow | Create → transition → comment → search |
| Secrets | `.env` gitignored; only `.env.example` tracked |

---

## Related artifacts

- [tool-workflow.md](./tool-workflow.md) — Part A workflow reflection
- [reflection.md](./reflection.md) — Technical decisions
- [requirements.md](./requirements.md) — Edge cases
- [.cursor/templates/prompt-history.md](../../.cursor/templates/prompt-history.md) — Prompt log index
