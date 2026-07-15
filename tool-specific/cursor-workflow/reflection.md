# Reflection — Support Ticket Management System

Personal reflection on building the Core scope with Cursor (Agent mode), following `tasks.md` phase-by-phase with review after each task.

---

## What I set out to prove

The brief’s signature piece is the **ticket status state machine**: a small set of legal transitions, enforced server-side, with integration tests as the acceptance bar. Everything else (CRUD, search, comments, UI) supports that core constraint. I wanted a codebase I could **explain line-by-line**, not just run — which aligned with the project rule to prefer explicit logic over clever abstractions.

---

## Technical decisions I’m satisfied with

**Isolating the state machine before HTTP (Phase 2).**  
`isValidTransition` and `VALID_TRANSITIONS` live in a pure module with no Mongoose or Express imports. Unit tests cover every valid edge, same-status no-ops, tempting invalid transitions, and unknown status strings. Only later did `PATCH /api/tickets/:id/status` call into that module, and Phase 4 tests hit the **real route** and assert the DB didn’t change on 400. That layering made debugging easy: if a transition fails, I know whether the pure function, the route, or persistence is wrong.

**Splitting status updates from field updates.**  
`PATCH /:id` explicitly rejects `status`; all lifecycle changes go through `PATCH /:id/status`. That matches the spec and gives integration tests one obvious target.

**Server-side validation as the contract.**  
Create/update/comment validation lives in `ticketValidation.js` and throws `AppError` consumed by centralized middleware. The UI adds client-side required-field checks for UX, but the backend’s `{ error: { message, field? } }` shape is what the forms map to for inline errors.

**In-memory MongoDB for tests.**  
`mongodb-memory-server` keeps tests fast and guarantees they never touch seeded dev data. `afterEach` collection clears prevent test leakage.

**Design system before feature pages (Phase 5).**  
CSS variables, `StatusBadge`, and `PriorityDot` upfront avoided three different status-color implementations. The list is dense; detail is spacious — intentional contrast for scan vs. read workflows.

---

## Tradeoffs I accept (and one I’d watch)

**Duplicated `VALID_TRANSITIONS` on the frontend (T5.5).**  
Status transition buttons only show legal next states by mirroring the backend map in `client/src/utils/stateMachine.js`. The backend remains authoritative; the UI copy can drift if the spec changes. I documented this in `prompt-history.md` rather than hiding it. A shared package or codegen would be cleaner at scale; for Core, explicit duplication plus integration tests on the API was the pragmatic call.

**Second query for comments on detail fetch.**  
`GET /api/tickets/:id` loads comments via `Comment.find({ ticketId })` instead of Mongoose virtual populate. Slightly more code in the route, but no schema changes and easy to read.

**Google Fonts for IBM Plex.**  
Fast to ship; self-hosting is a one-file swap if offline or privacy requirements appear later.

---

## Where friction showed up

1. **Environment setup** — `react-router-dom` was in `package.json` before `npm install` ran in `client/`; Vite failed until dependencies were installed. Lesson: run install in both packages right after scaffold tasks.

2. **Port alignment** — `server/.env` used `PORT=8081` while the Vite proxy defaulted to `3000`, and another process sometimes occupied the port. Fixing this required `VITE_API_PORT`, aligned `.env.example` files, and a habit of `curl /health` before trusting the UI.

3. **MongoDB Atlas** — TLS errors until the URI included a database name and my IP was on the Atlas allowlist. Local dev docs in README helped; Atlas checklist is now part of my mental model.

4. **Agent environment limits** — Early on, `npm create vite` and some install commands were blocked in the agent sandbox; I verified locally. Later test runs succeeded when network was available.

None of these were design flaws in the app; they were **integration and ops** issues worth documenting (README, troubleshooting section).

---

## AI-assisted workflow — what actually helped

- **Pinned spec + task list** at the start of each phase prevented scope creep.
- **“Stop after each task”** kept reviews manageable; I caught enum mismatches and proxy issues before they compounded.
- **`.cursor/rules/project.mdc` with `alwaysApply: true`** meant I didn’t re-paste state-machine and validation rules every session.
- **`prompt-history.md`** gave a lightweight audit trail of prompts, shipped changes, and corrections — useful for `tool-workflow.md` and this reflection.

What still required **me**: running seed/tests locally, fixing ports, Atlas access, and judging when frontend duplication was an acceptable tradeoff to name out loud.

---

## If I extended the project

Stretch items in `tasks.md` (auth, pagination, Swagger, CI) are correctly deferred. If I continued Core-adjacent work, I’d prioritize:

1. CI running `npm test` on every push.
2. A single source for `VALID_TRANSITIONS` shared by client and server (or generate from spec).
3. E2E smoke test (Playwright) for create → transition → comment on a running stack.

After the initial submission review, I also added integration tests beyond the mandatory state-machine tier: search/filter (`ticketList.searchFilter.test.js`), comments (`ticketComments.test.js`), field updates (`ticketUpdate.validation.test.js`), and validation unit tests (`ticketValidation.test.js`). That brought coverage in line with acceptance criteria #7, #12–#14, not just #6 and #11.

---

## Bottom line

The system meets the Core acceptance criteria: persistent tickets, search/filter, full UI flows, backend validation, no secrets in git, and **71 passing backend tests** across state machine, validation, search/filter, comments, and field updates. The architecture is boring in a good way — explicit routes, one enforcement point for status, readable validation — which is what I wanted for something I have to defend in review.
