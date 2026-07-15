# Prompt History — Support Ticket Management System

> **Index:** [`prompt-history/README.md`](./prompt-history/README.md) — per-phase transcripts (`phase-0` … `phase-6`) + [`task-log.md`](./prompt-history/task-log.md).  
> Combined exports archived under [`prompt-history/archive/`](./prompt-history/archive/).

**AI tool:** Cursor (Agent mode)

Structured log per `.cursor/rules/project.mdc`. See also [`.cursor/templates/prompt-history.md`](./.cursor/templates/prompt-history.md), [`tool-specific/cursor-workflow/session-journey.md`](./tool-specific/cursor-workflow/session-journey.md), [`tool-specific/cursor-workflow/tool-workflow.md`](./tool-specific/cursor-workflow/tool-workflow.md), and [`requirements.md`](./requirements.md).

---

## [2026-07-13 15:01] Task T0.1–T0.4
**Prompt (my own words, summarized):** Scaffold repo (client Vite+React, server Express), wire `/health`, MongoDB connection, and routing shell — one task at a time with review stops.
**What you did:** Created `client/` and `server/` structure, `package.json` files, health route, `db.js`, `.env.example`, placeholder `TicketList`/`TicketDetail` routes via react-router-dom.
**Corrections/iteration:** `npm create vite` blocked in agent sandbox — scaffold created manually; user ran `npm install` locally.

## [2026-07-13 15:30] Task T1.1
**Prompt (my own words, summarized):** Create a Mongoose User schema in server/models/User.js with name, email (unique), and role enum (agent|admin), matching spec.md §2 exactly.
**What you did:** Added server/models/User.js with a User schema: name and email (required, unique), role (required enum: agent|admin). No routes or auth fields.
**Corrections/iteration:** none

## [2026-07-13 15:32] Task T1.2
**Prompt (my own words, summarized):** Create a Mongoose Ticket schema with all spec.md §2 fields, length constraints, enums, User refs, and Mongoose timestamps for createdAt/updatedAt.
**What you did:** Added server/models/Ticket.js with title (1–200), description (1–5000), priority (low|medium|high|urgent), status (Open|In Progress|Resolved|Closed|Cancelled, default Open), assignedTo (nullable User ref), createdBy (required User ref), and `{ timestamps: true }`.
**Corrections/iteration:** none

## [2026-07-13 15:34] Task T1.3
**Prompt (my own words, summarized):** Create a Mongoose Comment schema with ticketId, message (1–2000 chars), createdBy refs, and createdAt via timestamps.
**What you did:** Added server/models/Comment.js with ticketId (required Ticket ref), message (1–2000), createdBy (required User ref), and timestamps with only createdAt (no updatedAt, per spec §2).
**Corrections/iteration:** none

## [2026-07-13 15:36] Task T1.4
**Prompt (my own words, summarized):** Create server/seed.js to clear and reseed users, tickets (all statuses), and comments; add npm run seed.
**What you did:** Added server/seed.js (connects via db.js, clears Comment/Ticket/User, inserts 4 users, 6 tickets covering every status with varied priorities, 3 comments on different tickets). Added `"seed": "node seed.js"` to server/package.json.
**Corrections/iteration:** none

## [2026-07-14 11:52] Task T2.1
**Prompt (my own words, summarized):** Create a pure isValidTransition(from, to) module with VALID_TRANSITIONS constant, matching spec §3 exactly with no DB/Express dependencies.
**What you did:** Added server/utils/stateMachine.js exporting VALID_TRANSITIONS map and isValidTransition — rejects same-status moves, unknown statuses (returns false, no throw), and only allows the five spec transitions. Terminal states have empty target lists.
**Corrections/iteration:** none

## [2026-07-14 11:54] Task T2.2
**Prompt (my own words, summarized):** Add isolated unit tests for isValidTransition covering all valid transitions, same-status false cases, tempting invalid transitions, and unrecognized statuses without throwing.
**What you did:** Added server/utils/stateMachine.test.js with Jest tests for all five valid transitions, all same-status pairs, five specified invalid transitions, and unrecognized status handling. Added jest devDependency and npm test script with ESM support in server/package.json.
**Corrections/iteration:** none

## [2026-07-14 11:56] Task T3.1
**Prompt (my own words, summarized):** Implement GET /api/users returning all seeded users with id, name, email, and role.
**What you did:** Added server/routes/users.js with GET / listing all users sorted by name, mapping _id to id in the JSON response. Mounted the router at /api/users in server/index.js.
**Corrections/iteration:** none

## [2026-07-14 11:58] Task T3.2
**Prompt (my own words, summarized):** Implement POST /api/tickets with server-side validation for required fields and priority enum; status defaults to Open and cannot be set on create; 400 errors use { error: { message, field? } }.
**What you did:** Added server/utils/ticketValidation.js (validateCreateTicketBody) and server/routes/tickets.js POST / with field validation, user existence checks for createdBy/assignedTo, rejection if status is sent on create, and 201 response with mapped ticket fields. Mounted at /api/tickets.
**Corrections/iteration:** none

## [2026-07-14 12:00] Task T3.3
**Prompt (my own words, summarized):** Implement GET /api/tickets with optional combinable ?q= keyword search (case-insensitive title/description) and &status= exact filter.
**What you did:** Added GET / to server/routes/tickets.js building a MongoDB filter from q ($or regex on title/description) and status (exact match), both optional and combinable; returns tickets sorted by updatedAt descending.
**Corrections/iteration:** none

## [2026-07-14 12:02] Task T3.4
**Prompt (my own words, summarized):** Implement GET /api/tickets/:id returning ticket detail with comments; 404 if not found; explain populate vs second-query choice.
**What you did:** Added GET /:id to server/routes/tickets.js — loads the ticket by id, then runs a separate Comment.find({ ticketId }) sorted by createdAt. Chose a second query over populate because comments are stored on the Comment collection via ticketId (not embedded on Ticket), keeping the route explicit without adding virtuals to the schema.
**Corrections/iteration:** none

## [2026-07-14 12:04] Task T3.5
**Prompt (my own words, summarized):** Implement PATCH /api/tickets/:id to update title/description/priority/assignedTo only; reject status (and createdBy) with 400; apply create validation rules to fields present.
**What you did:** Added validateUpdateTicketBody to server/utils/ticketValidation.js and PATCH /:id in server/routes/tickets.js — partial updates with field-level validation, assignedTo nullable to unassign, user existence check for assignee, 404 if ticket missing.
**Corrections/iteration:** none

## [2026-07-14 12:06] Task T3.6
**Prompt (my own words, summarized):** Implement PATCH /api/tickets/:id/status using isValidTransition from the Phase 2 module; 400 with current status and allowed targets on invalid transition.
**What you did:** Added PATCH /:id/status to server/routes/tickets.js — validates status in body, loads ticket, calls isValidTransition(current, new) and references VALID_TRANSITIONS for the error message listing allowed targets (or "none (terminal status)"). No inline transition logic.
**Corrections/iteration:** none

## [2026-07-14 12:08] Task T3.7
**Prompt (my own words, summarized):** Implement GET/POST /api/tickets/:id/comments — list and add comments with message validation; no status restriction; 404 if ticket missing.
**What you did:** Added validateCreateCommentBody to server/utils/ticketValidation.js and GET/POST /:id/comments in server/routes/tickets.js (placed before GET /:id). POST validates message (required, non-empty after trim, max 2000) and createdBy (required per Comment model); allows comments on any ticket status including Closed/Cancelled.
**Corrections/iteration:** none

## [2026-07-14 12:10] Task T3.8
**Prompt (my own words, summarized):** Add centralized Express error middleware returning { error: { message, field? } } for 400/404/500 without leaking stack traces in responses.
**What you did:** Added server/errors/AppError.js (AppError, badRequest, notFound), server/middleware/errorHandler.js (handles AppError, Mongoose CastError→404, ValidationError→400, unknown→500 with console log only). Wired notFoundHandler + errorHandler in index.js; refactored server/routes/tickets.js to throw AppError instead of inline res.status error responses.
**Corrections/iteration:** none

## [2026-07-14 12:06] Task T4.1
**Prompt (my own words, summarized):** Set up Jest + Supertest integration test infrastructure with isolated MongoDB (in-memory or separate test DB), npm test script, and explain the approach chosen.
**What you did:** Extracted server/app.js for Supertest; added mongodb-memory-server + supertest, jest.config.js, test/setup.js (in-memory DB lifecycle + afterEach collection clear), test/helpers.js, and a smoke test in test/infrastructure.test.js. Kept npm test with ESM Jest runner.
**Corrections/iteration:** none

## [2026-07-14 12:10] Task T4.2
**Prompt (my own words, summarized):** Integration tests for every valid PATCH /api/tickets/:id/status transition via the real API, asserting 200 and persisted DB status.
**What you did:** Extended test/helpers.js with API helpers (createTestUser, createTicketViaApi, patchTicketStatus, getTicketFromDb). Added test/statusTransitions.valid.test.js — it.each over VALID_TRANSITIONS from stateMachine.js (5 transitions) plus a full happy-path walk Open→In Progress→Resolved→Closed. All 26 tests pass.
**Corrections/iteration:** none

## [2026-07-14 12:12] Task T4.3
**Prompt (my own words, summarized):** Integration tests for invalid PATCH /api/tickets/:id/status transitions — Resolved→In Progress, Closed→Open, Cancelled→Open, Open→Open; assert 400 and unchanged DB status.
**What you did:** Moved setupTicketAtStatus and PATHS_TO_STATUS into test/helpers.js. Added test/statusTransitions.invalid.test.js with it.each for the four required invalid cases, asserting 400, error shape with field status, and persisted status unchanged.
**Corrections/iteration:** none

## [2026-07-14 12:14] Task T4.4
**Prompt (my own words, summarized):** Integration tests for POST /api/tickets validation — missing title/description/createdBy and invalid priority rejected with 400; valid payload succeeds with 201 and persists.
**What you did:** Added test/ticketCreate.validation.test.js with four 400 cases (each asserts error field and zero tickets in DB) plus one success case asserting 201, response body, and persisted Ticket document. Full suite run and confirmed passing.
**Corrections/iteration:** none

## [2026-07-14 12:22] Task T5.1
**Prompt (my own words, summarized):** Set up design system tokens (CSS vars, IBM Plex fonts, StatusBadge, PriorityDot), then build TicketList as a dense scan-first table with loading/empty states and row links to detail — T5.1 only, stop for review.
**What you did:** Added design tokens in `client/src/index.css`, Google Fonts for IBM Plex Sans/Mono in `index.html`, shared `StatusBadge` and `PriorityDot` components with centralized status color mapping in `utils/status.js`, API helpers, and a full `TicketList` page (table layout, loading, empty state, mobile stacked cards, keyboard-focusable rows). Added Vite `/api` proxy for dev.
**Corrections/iteration:** none

## [2026-07-14 12:26] Task T5.2
**Prompt (my own words, summarized):** Add search input and status filter dropdown above the ticket list, wired to GET /api/tickets query params with debounced search; controls should feel integrated into the table header.
**What you did:** Added `useDebouncedValue` hook (300ms), a toolbar inside `ticket-table-wrap` matching thead styling (search + status select), refetch on `q`/`status` params via existing `fetchTickets`, separate initial loading vs "Updating…" refetch state, and Clear filters when filters are active (toolbar + empty state).
**Corrections/iteration:** none

## [2026-07-14 12:30] Task T5.3
**Prompt (my own words, summarized):** Build create-ticket form with title, description, priority dot-picker, createdBy dropdown; client-side required checks plus inline API 400 errors per field (plain language, no toast).
**What you did:** Added `CreateTicket` page at `/tickets/new`, reusable `PriorityPicker` (radio group with `PriorityDot` + text labels), `ApiError` with field mapping in `api/client.js`, `createTicket` API helper, inline field errors from client validation and backend `{ error: { message, field } }`, success navigates to detail. Added "New ticket" button on list page.
**Corrections/iteration:** none

## [2026-07-14 12:34] Task T5.4
**Prompt (my own words, summarized):** Build TicketDetail page with generous whitespace, prominent StatusBadge near title, edit mode for title/description/priority/assignedTo, and same inline-error pattern as create form.
**What you did:** Implemented full `TicketDetail` page — fetches ticket + users, spacious layout with meta grid and description section, StatusBadge + mono ticket ID/timestamps, view/edit toggle with `PriorityPicker` and assignee select, `fetchTicket`/`updateTicket` API helpers, client + API inline field errors. Reused create-form field styles for edit mode.
**Corrections/iteration:** none

## [2026-07-14 14:16] Dev proxy 404 — port mismatch / wrong process on 8081
**Prompt (my own words, summarized):** Backend running but `/api/*` returning 404 via Vite proxy; diagnose and document fix in prompt-history.
**What you did:** Diagnosed root cause: Vite was proxying to a port where a different Express app responded with HTML `Cannot GET /api/tickets` (not this project's API — our app returns JSON and serves `/health` as `{"status":"ok"}`). `server/.env` had `PORT=8081` while the proxy target was inconsistent. Updated `client/vite.config.js` to read `VITE_API_PORT` (default `3000`), added `client/.env.example`, set `PORT=3000` in `server/.env.example`, and documented two-terminal startup + `curl /health` verification in README.
**Corrections/iteration:** User must align `PORT` in `server/.env` with `VITE_API_PORT` in `client/.env`, kill any foreign process on that port, restart both servers, and confirm `curl http://localhost:<PORT>/health` returns `{"status":"ok"}` before using the UI.

## [2026-07-14 14:26] Task T5.5
**Prompt (my own words, summarized):** Add status transition controls on ticket detail — buttons only for valid transitions from current status, styled as StatusBadge targets; flag duplicated state-machine logic as a known tradeoff.
**What you did:** Added `client/src/utils/stateMachine.js` duplicating `VALID_TRANSITIONS` from the backend (documented tradeoff: UI copy can drift; backend PATCH remains authoritative). Built `StatusBadgeButton` and `StatusTransitionControls`, wired `updateTicketStatus` → `PATCH /api/tickets/:id/status`, integrated on detail view (view mode only) with inline status errors and terminal-state messaging for Closed/Cancelled.
**Corrections/iteration:** none

## [2026-07-14 14:44] Task T5.6
**Prompt (my own words, summarized):** Add comments list (author, message, mono timestamp) and add-comment form on ticket detail, with empty state when there are no comments.
**What you did:** Added `CommentsSection` component and `createComment` API helper (`POST /api/tickets/:id/comments`). Integrated on detail page below ticket content (view and edit modes); lists comments from ticket payload, shows "No comments yet" when empty, inline client/API field errors on the add form, appends new comment on success.
**Corrections/iteration:** none

## [2026-07-15 11:20] Task T6.1
**Prompt (my own words, summarized):** Write setup README covering prerequisites, env vars, seed, dev servers, tests, and ports so a newcomer can run the full app.
**What you did:** Replaced root README.md with a single full-stack guide (prerequisites, server/client .env setup referencing .env.example, seed, npm run dev for both apps, npm test, port table, troubleshooting, API overview). Chose one root README over split client/server docs so port/proxy coordination and startup order stay in one place.
**Corrections/iteration:** none

## [2026-07-15 11:22] Task T6.2
**Prompt (my own words, summarized):** Audit repo for committed secrets — confirm .gitignore covers .env and node_modules; grep for hardcoded credentials; fix leaks or flag uncertainties.
**What you did:** Audited git tracking and grepped the codebase: server/.env and client/.env are gitignored and never committed; only .env.example files are tracked; no hardcoded Atlas URIs, API keys, or passwords in source. Added explicit `.env` entries to client/.gitignore for defense-in-depth (root .gitignore already covered them).
**Corrections/iteration:** Flagged to user: rotate Atlas DB password if it was ever shared outside .env (e.g. in chat); local server/.env exists on disk only — verify `git status` before push.

## [2026-07-15 12:22] Task T6.3
**Prompt (my own words, summarized):** Write tool-workflow.md Part A (11 questions) reflecting what actually happened using Cursor on this project.
**What you did:** Added root tool-workflow.md with Part A answers covering context supply (spec + cursor rules), task-by-task prompting, review cadence, state-machine layering, friction points (proxy ports, Atlas SSL, missing npm install), verification strategy, dependency discipline, and lessons learned; Part B quick reference to key paths and commands.
**Corrections/iteration:** none

## [2026-07-15 12:25] Task T6.4
**Prompt (my own words, summarized):** Write reflection on the project and a PR description suitable for submission/review.
**What you did:** Added reflection.md (technical decisions, tradeoffs, friction points, AI workflow learnings) and PR_DESCRIPTION.md (summary, acceptance-criteria table, test plan, reviewer setup, key files). Both grounded in shipped Core scope and prompt-history.
**Corrections/iteration:** none

## [2026-07-15 12:38] Task T6.6
**Prompt (my own words, summarized):** Add integration tests for search/filter, comments, and field updates; add validation unit tests; update docs with new coverage.
**What you did:** Added server/test/ticketList.searchFilter.test.js, ticketComments.test.js, ticketUpdate.validation.test.js, ticketValidation.test.js; extended test helpers; updated README, PR_DESCRIPTION, tool-workflow, reflection. 71 tests passing.
**Corrections/iteration:** Adjusted regex search test — split wildcard vs literal-match cases.

## [2026-07-15 13:52] Task T6.7
**Prompt (my own words, summarized):** Add requirements.md for Code Pulse scanner; consolidate prompt history to single prompt-history.md; remove redundant prompt export files.
**What you did:** Added root requirements.md (requirement breakdown, edge cases, test traceability). Trimmed prompt-history.md to structured task log only. Removed prompt-history/ folder, prompt-history-client-detailed.md, and prompt-history-server-detailed.md. Updated README submission block and cross-references in tool-workflow.md and PR_DESCRIPTION.md.
**Corrections/iteration:** none

## [2026-07-15 13:59] Task T6.8
**Prompt (my own words, summarized):** Restore prompt-history/ folder and detailed export files as created in T6.5.
**What you did:** Restored prompt-history/README.md, task-log.md, export-phase6-completion.md, prompt-history-client-detailed.md, and prompt-history-server-detailed.md from git history. Updated prompt-history.md header to point at the index again; updated README and cross-references.
**Corrections/iteration:** User preferred folder structure from earlier submission layout.

## [2026-07-15 14:05] Task T6.9 (prompt-history organization)
**Prompt (my own words, summarized):** Based on chat history, add all phase prompts into prompt-history/ folder.
**What you did:** Split server/client detailed exports into per-phase transcript files under prompt-history/ (phase-0 through phase-6, ops-debugging-sessions); renamed export-phase6-completion.md to phase-6-polish-part2.md; added phase-6-extensions.md; archived originals in prompt-history/archive/; updated README and root stub pointers.
**Corrections/iteration:** none

## [2026-07-15 15:30] Task T6.10
**Prompt (my own words, summarized):** Create branch and reorganize submission artifacts to match reference exercise layout (tool-specific/cursor-workflow + .cursor/).
**What you did:** Branch `cursor/reorganize-submission-artifacts`. Canonical copies in `tool-specific/cursor-workflow/` (tool-workflow, reflection, requirements, PR_DESCRIPTION, session-journey). Added `.cursor/context/`, `.cursor/checklists/`, `.cursor/templates/prompt-history.md`, `.cursor/prompts/`. Root tool-workflow/reflection/PR_DESCRIPTION are pointers; requirements.md and prompt-history.md remain at root. Updated README and cross-references.
**Corrections/iteration:** none
