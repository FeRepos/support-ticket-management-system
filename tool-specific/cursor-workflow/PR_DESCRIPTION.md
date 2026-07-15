# Pull Request: Support Ticket Management System (Core)

## Summary

Implements the **Core** scope of the support ticket management system: a React (Vite) frontend and Express + MongoDB backend for creating, searching, updating, and commenting on tickets, with a **fixed server-enforced status state machine** and integration test coverage.

Built incrementally per `tool-specific/cursor-workflow/tasks.md` (Phases 0–6), with spec-driven API design and validation.

---

## What's included

### Backend (`server/`)

- Express API: users, tickets (CRUD + search/filter), status transitions, comments
- Mongoose models: `User`, `Ticket`, `Comment` (per `spec.md` §2)
- Pure state machine: `isValidTransition` + `VALID_TRANSITIONS` (`server/utils/stateMachine.js`)
- Dedicated `PATCH /api/tickets/:id/status` — only path for lifecycle changes
- Centralized error handling: `{ error: { message, field? } }`
- Seed script: `npm run seed` (4 users, 6 tickets all statuses, 3 comments)
- **71 tests** (Jest + Supertest + mongodb-memory-server)

### Frontend (`client/`)

- Ticket list: dense table, debounced keyword search, status filter, create flow
- Ticket detail: view/edit fields, assignee, status transition controls (valid transitions only)
- Comments: list + add (any ticket status)
- Design system: CSS tokens, IBM Plex fonts, shared `StatusBadge` / `PriorityDot`
- Vite dev proxy: `/api` → backend (`VITE_API_PORT` must match server `PORT`)

### Docs & hygiene

- Root `README.md` — full-stack setup, ports, troubleshooting, submission package links
- `requirements.md` — requirement breakdown and edge cases
- `tool-workflow.md` — Cursor workflow reflection (Part A)
- `prompt-history.md` — AI prompt and task log (root)
- `prompt-history/` — Per-phase transcripts + index
- `.cursor/templates/prompt-history.md` — Prompt history index for reviewers
- `reflection.md` — technical reflection
- `.env.example` in `server/` and `client/`; `.env` gitignored; secrets audit (T6.2)

---

## Acceptance criteria mapping

| # | Criterion | How met |
|---|-----------|---------|
| 1 | Create ticket via UI | `CreateTicket` → `POST /api/tickets` |
| 2 | View all tickets | `TicketList` → `GET /api/tickets` |
| 3 | Ticket detail view | `TicketDetail` → `GET /api/tickets/:id` |
| 4 | Update fields / reassign | Edit mode → `PATCH /api/tickets/:id` |
| 5 | Add comments | `CommentsSection` → `POST /api/tickets/:id/comments` |
| 6 | Valid transitions only (backend) | `PATCH /:id/status` + `isValidTransition`; 400 on invalid |
| 7 | Keyword search + status filter | `?q=` + `&status=` on list page; `ticketList.searchFilter.test.js` |
| 8 | Persistence after restart | MongoDB (Atlas or local) |
| 9 | Backend validation | `ticketValidation.js` + integration/unit tests |
| 10 | No secrets in repo | `.gitignore` audit; only `.env.example` tracked |
| 11 | State-machine integration tests | `statusTransitions.valid/invalid.test.js` |
| 12 | Comments regardless of status | `ticketComments.test.js` (Closed ticket case) |
| 13 | Fields editable when Closed/Cancelled | `ticketUpdate.validation.test.js` |
| 14 | Case-insensitive search | `ticketList.searchFilter.test.js` |

---

## Key design decisions

1. **State machine in a pure module** — tested alone (T2.2) and via HTTP (T4.2–T4.3).
2. **Status not settable on create or general PATCH** — single enforcement point.
3. **Frontend duplicates `VALID_TRANSITIONS`** for transition buttons (T5.5) — backend authoritative; documented tradeoff.
4. **Tests use in-memory MongoDB** — isolated from dev/seed data.

---

## Test plan

### Automated

```bash
cd server
npm test
```

Expected: **9 suites, 71 tests passed** (state machine, validation, search/filter, comments, field updates, infrastructure).

| Suite | Covers |
|-------|--------|
| `stateMachine.test.js` | Pure transition logic |
| `ticketValidation.test.js` | Validation helper unit tests |
| `statusTransitions.*.test.js` | Valid/invalid HTTP status transitions |
| `ticketCreate.validation.test.js` | Create-ticket validation |
| `ticketList.searchFilter.test.js` | Keyword search, status filter, regex escape |
| `ticketComments.test.js` | Comment create/list/detail; Closed ticket |
| `ticketUpdate.validation.test.js` | Field updates; reject status on PATCH |
| `infrastructure.test.js` | DB + `/health` smoke |

### Manual — prerequisites

```bash
# Terminal 1
cd server && cp .env.example .env   # set MONGO_URI, PORT=3000
npm run seed && npm run dev

# Terminal 2
cd client && npm run dev            # http://localhost:5173
```

Verify API first: `curl http://localhost:3000/health` → `{"status":"ok"}`

### Manual — checklist

- [ ] List loads seeded tickets; empty state when filters match nothing
- [ ] Search by keyword (case-insensitive); filter by status; combine both
- [ ] Create ticket with validation errors shown inline on bad input
- [ ] Open detail; edit title, priority, assignee; save
- [ ] From **Open**: transition to In Progress and Cancelled only; invalid options not offered / API returns 400
- [ ] Walk happy path Open → In Progress → Resolved → Closed
- [ ] Attempt invalid transition via API returns 400; status unchanged in UI after refresh
- [ ] Add comment on Open ticket; add comment on Closed ticket
- [ ] Restart server; data still present (MongoDB persistence)

---

## Setup for reviewers

See [README.md](./README.md) for prerequisites, env vars, ports, and troubleshooting (Atlas IP allowlist, proxy port alignment).

**Ports (default):** frontend `5173`, API `3000`.

---

## Out of scope (Stretch — not in this PR)

Auth, user CRUD UI, priority/assignee server-side filters, pagination, Swagger, Docker/CI, frontend component tests.

---

## Files worth reviewing first

| Area | Path |
|------|------|
| State machine | `server/utils/stateMachine.js` |
| Status route | `server/routes/tickets.js` (`PATCH /:id/status`) |
| Integration tests | `server/test/statusTransitions.*.test.js`, `ticketList.searchFilter.test.js`, `ticketComments.test.js`, `ticketUpdate.validation.test.js` |
| UI transitions | `client/src/components/StatusTransitionControls.jsx` |
| Spec reference | `requirements.md`, `tool-specific/cursor-workflow/spec.md` |
