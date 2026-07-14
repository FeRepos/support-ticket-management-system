# Tasks — ordered, committable one at a time

Each task = one focused Cursor session/prompt + one commit. Traces back to spec.md and
acceptance-criteria.md. Check off as you go; keep the commit hash next to each once done.

## Phase 0 — Project setup
- [ ] T0.1 — Init repo structure: `client/` (Vite React), `server/` (Express), root README stub
- [ ] T0.2 — Server: package.json, basic Express app, `/health` route, `.env.example` (MONGO_URI, PORT)
- [ ] T0.3 — MongoDB connection module + local run instructions in README
- [ ] T0.4 — Client: Vite React scaffold, basic routing shell (list page / detail page placeholders)

## Phase 1 — Data layer
- [ ] T1.1 — Mongoose schema: User (name, email, role)
- [ ] T1.2 — Mongoose schema: Ticket (all fields, enums for priority/status per spec.md §2)
- [ ] T1.3 — Mongoose schema: Comment (ticketId ref, message, createdBy ref)
- [ ] T1.4 — Seed script: seed users + a handful of sample tickets/comments; npm script to run it

## Phase 2 — State machine (the signature piece — isolate it)
- [ ] T2.1 — Pure function `isValidTransition(from, to)` in its own module, no DB/HTTP dependency
- [ ] T2.2 — Unit-level sanity check (can be part of the integration suite) covering every edge in spec.md §3, both directions (valid list + explicit invalid attempts)

## Phase 3 — Backend API
- [ ] T3.1 — GET /api/users
- [ ] T3.2 — POST /api/tickets (+ server-side validation per spec.md §5)
- [ ] T3.3 — GET /api/tickets (+ `?q=` keyword, `&status=` filter)
- [ ] T3.4 — GET /api/tickets/:id (include comments)
- [ ] T3.5 — PATCH /api/tickets/:id (field updates, not status)
- [ ] T3.6 — PATCH /api/tickets/:id/status (uses isValidTransition; 400 on invalid)
- [ ] T3.7 — GET/POST /api/tickets/:id/comments
- [ ] T3.8 — Centralized error handler → consistent `{error:{message,field?}}` shape

## Phase 4 — Backend tests (mandatory tier)
- [ ] T4.1 — Test setup: in-memory or test-DB config, Supertest wired up
- [ ] T4.2 — Integration tests: every valid status transition succeeds
- [ ] T4.3 — Integration tests: representative invalid transitions rejected with 400
- [ ] T4.4 — Integration tests: create-ticket validation (missing required fields rejected)

## Phase 5 — Frontend
- [ ] T5.1 — Ticket list view: fetch + render, loading/error states
- [ ] T5.2 — Search box + status filter dropdown wired to GET query params
- [ ] T5.3 — Create ticket form + client-side validation + error display on API rejection
- [ ] T5.4 — Ticket detail view: fields, reassign, edit
- [ ] T5.5 — Status change control: only render buttons for currently-valid transitions (mirrors backend rules — call this out explicitly since it's easy for AI to duplicate the state machine logic inconsistently between frontend and backend)
- [ ] T5.6 — Comments: list + add form on detail view

## Phase 6 — Polish & submission artifacts
- [ ] T6.1 — README: setup, env vars, seed command, run command, test command
- [ ] T6.2 — Final pass: no secrets committed, `.gitignore` covers `.env` and `node_modules`
- [ ] T6.3 — Write `tool-workflow.md` (Part A, 11 questions) from what actually happened
- [ ] T6.4 — Reflection + PR description
- [ ] T6.5 — Export/save full Cursor prompt history into the repo

## Deferred (Stretch — do not start until Phase 6 is done)
Priority/assignee filter, sort, pagination · unit tests · edge-case tests · Swagger ·
Docker/CI · auth · richer data model.
