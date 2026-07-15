# Phase 4 — Backend tests (T4.1–T4.4)

_Source: Cursor export — Support Ticket Management System_

**User**

Read tool-specific/cursor-workflow/acceptance-criteria.md — criterion #11 (state-machine
integration tests pass) and #9 (backend validation prevents invalid records) are what this
phase proves.

Execute only these tasks, in order, stopping after each for my review:

T4.1 — Set up test infrastructure: Jest + Supertest, configured against either an in-memory
MongoDB (mongodb-memory-server) or a separate test database (not the dev/seed database —
tests must never touch real seed data). Add an npm script "test" that runs it. Tell me
which approach you used and why.

T4.2 — Integration tests hitting the real PATCH /api/tickets/:id/status route (not just the
isolated stateMachine.js unit tests from Phase 2) for every valid transition from spec.md
§3: create a ticket via the API, walk it through each valid transition, assert 200 and the
persisted status actually changed in the DB.

T4.3 — Integration tests for invalid transitions through the same route: at minimum
Resolved->In Progress, Closed->Open, Cancelled->Open, and a same-status no-op (e.g.
Open->Open). Assert 400 and assert the ticket's status in the DB did NOT change.

T4.4 — Integration tests for ticket creation validation: missing title, missing
description, missing createdBy, and an invalid priority value each rejected with 400.
Also one test confirming a fully valid payload succeeds with 201/200 and persists.

Each test file should tear down/reset its test data between tests so they don't leak state
into each other. Run the full suite yourself and confirm all tests pass before telling me
it's done — don't report success without actually running it.

Append your entry to prompt-history.md after each task per the logging rule.

---

**Cursor**

Reading acceptance criteria and the current server/test setup, then implementing T4.1.


Refactoring the app for testability and setting up Jest, Supertest, and mongodb-memory-server for T4.1.


**T4.1 complete** — stopping here for your review.

## Approach: `mongodb-memory-server` (in-memory)

**Why this over a separate test database:**
- **Isolation** — each run gets a fresh in-memory MongoDB; dev/seed data is never touched
- **No external deps** — no local MongoDB or Atlas test cluster required (good for CI)
- **Speed** — starts/stops quickly per test run
- **Cleanup** — `afterEach` clears all collections so tests don't leak state

A separate `MONGO_URI_TEST` would also work but needs a running MongoDB instance and careful discipline to avoid hitting the wrong database.

## What changed

| File | Purpose |
|------|---------|
| `server/app.js` | Express app extracted for Supertest (no `listen`) |
| `server/index.js` | Imports `app.js`, connects DB, starts server |
| `server/db.js` | `connectDB(uri?)` accepts optional URI |
| `server/jest.config.js` | Jest config with `setupFilesAfterEnv` |
| `server/test/setup.js` | Global `beforeAll`/`afterAll`/`afterEach` for DB lifecycle |
| `server/test/helpers.js` | `startTestDatabase`, `stopTestDatabase`, `clearDatabase` |
| `server/test/infrastructure.test.js` | Smoke test: in-memory DB + `GET /health` |
| `server/package.json` | Added `mongodb-memory-server`, `supertest` |

## Test run (verified)

```
Test Suites: 2 passed, 2 total
Tests:       20 passed, 20 total
```

Includes Phase 2 `stateMachine.test.js` (19 tests) + infrastructure smoke test (1 test).

## To verify locally

```bash
cd server
npm install
npm test
```

### `prompt-history.md`
Appended the T4.1 log entry.

---

Reply when you're ready and I'll continue with **T4.2** (valid status transition integration tests).

---

**User**

I'll continue with T4.2

---

**Cursor**

Implementing T4.2 integration tests for valid status transitions via the API.


Cleaning up dead code in the test file, then running the suite.


**T4.2 complete** — stopping here for your review.

## What changed

### `server/test/helpers.js` (extended)
API test helpers:
- `createTestUser()` — inserts a user in the test DB
- `createTicketViaApi(userId)` — `POST /api/tickets`
- `patchTicketStatus(ticketId, status)` — `PATCH /api/tickets/:id/status`
- `getTicketFromDb(ticketId)` — reads persisted status from MongoDB

### `server/test/statusTransitions.valid.test.js` (new)

Tests the **real HTTP route**, not the isolated `stateMachine.js` unit tests.

**`it.each` over `VALID_TRANSITIONS`** — all 5 valid transitions:

| From | To |
|------|-----|
| Open | In Progress |
| Open | Cancelled |
| In Progress | Resolved |
| In Progress | Cancelled |
| Resolved | Closed |

Each test:
1. Creates a ticket via `POST /api/tickets`
2. Walks it to the required `from` status (setup transitions)
3. Calls `PATCH /api/tickets/:id/status`
4. Asserts **200** and response `status`
5. Asserts persisted status in DB via `Ticket.findById`

**Bonus:** full happy-path test — Open → In Progress → Resolved → Closed in one ticket.

## Test run (verified)

```
Test Suites: 3 passed, 3 total
Tests:       26 passed, 26 total
```

### `prompt-history.md`
Appended the T4.2 log entry.

---

Reply when you're ready and I'll continue with **T4.3** (invalid transition integration tests).

---

**User**

continue with T4.3

---

**Cursor**

Moving shared setup into helpers and adding invalid-transition integration tests.


**T4.3 complete** — stopping here for your review.

## What changed

### `server/test/helpers.js` (refactored)
Moved shared setup here:
- **`PATHS_TO_STATUS`** — steps to reach each status (including `Cancelled: ['Cancelled']` from Open)
- **`setupTicketAtStatus(fromStatus)`** — creates a ticket via API and walks it to the target status

### `server/test/statusTransitions.invalid.test.js` (new)

Tests invalid transitions through the real **`PATCH /api/tickets/:id/status`** route:

| From | To | Why it's invalid |
|------|-----|------------------|
| Resolved | In Progress | Backward move |
| Closed | Open | Terminal → reopen |
| Cancelled | Open | Terminal → reopen |
| Open | Open | Same-status no-op |

Each test asserts:
- **400** response
- `{ error: { message, field: 'status' } }` shape
- **DB status unchanged** via `getTicketFromDb`

### `server/test/statusTransitions.valid.test.js` (updated)
Now imports `setupTicketAtStatus` from helpers (no duplicated setup logic).

## Test run (verified)

```
Test Suites: 4 passed, 4 total
Tests:       30 passed, 30 total
```

### `prompt-history.md`
Appended the T4.3 log entry.

---

Reply when you're ready and I'll continue with **T4.4** (ticket creation validation integration tests).

---

**User**

continue with T4.4

---

**Cursor**

**T4.4 complete** — Phase 4 is done. Stopping here for your review.

## What changed

### `server/test/ticketCreate.validation.test.js` (new)

Integration tests for **`POST /api/tickets`**:

| Test | Asserts |
|------|---------|
| Missing `title` | **400**, `error.field: 'title'`, no ticket in DB |
| Missing `description` | **400**, `error.field: 'description'`, no ticket in DB |
| Missing `createdBy` | **400**, `error.field: 'createdBy'`, no ticket in DB |
| Invalid `priority` (`"critical"`) | **400**, `error.field: 'priority'`, no ticket in DB |
| Valid payload | **201**, correct response body, ticket persisted in MongoDB |

Rejection tests also assert `Ticket.countDocuments() === 0` so invalid records never land in the DB (acceptance criterion **#9**).

## Test run (verified)

```
Test Suites: 5 passed, 5 total
Tests:       35 passed, 35 total
```

This covers acceptance criterion **#11** (state-machine integration tests) and **#9** (backend validation).

### `prompt-history.md`
Appended the T4.4 log entry.

---

**Phase 4 summary**

| Task | Status |
|------|--------|
| T4.1 — Test infrastructure (Jest + Supertest + in-memory MongoDB) | Done |
| T4.2 — Valid status transition integration tests | Done |
| T4.3 — Invalid transition integration tests | Done |
| T4.4 — Ticket creation validation tests | Done |

Reply when you're ready to move on to **Phase 5** (frontend).

---
