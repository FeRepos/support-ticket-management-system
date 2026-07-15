# Tool Workflow — Support Ticket Management System

**Tool:** Cursor (Agent mode)  
**Project:** Full-stack support ticket app (React/Vite + Express/MongoDB)  
**Written from:** `prompt-history.md`, `prompt-history-server-detailed.md`, `prompt-history-client-detailed.md`, and the actual codebase — not a hypothetical plan.

---

## Part A — Workflow reflection (11 questions)

### 1. How did you supply context to the AI at the start of work?

Each major phase began with an explicit instruction to read `tool-specific/cursor-workflow/project-context.md` and `spec.md` (and, where relevant, `acceptance-criteria.md` or a specific spec section such as §2 Data Model, §3 State Machine, or §4–§6 API/validation/errors) **before writing any code**.

That mattered because the spec is the source of truth for enums, routes, error shape, and the non-negotiable status state machine. Supplying it up front reduced invented endpoints and “helpful” invalid transitions.

Mid-project, I also copied `cursor-rules-or-instructions.md` into `.cursor/rules/project.mdc` with `alwaysApply: true`, so standing rules (server-side validation, no scope creep per task, prompt-history logging) persisted across sessions without re-pasting them every time.

### 2. How did you break the work into tasks?

I followed `tool-specific/cursor-workflow/tasks.md` almost exactly: **one task per prompt**, in phase order (T0.1 → T6.x), with an explicit **“stop after each for my review”** instruction.

That kept diffs reviewable and matched the “one commit per task” intent in `tasks.md`. Phases were natural boundaries:

| Phase | Focus |
|-------|--------|
| 0 | Repo scaffold, health check, MongoDB wire-up, routing shell |
| 1 | Mongoose models + seed |
| 2 | Pure `isValidTransition` + unit tests |
| 3 | REST API + centralized errors |
| 4 | Supertest integration tests (state machine + validation) |
| 5 | Frontend UI (design system → list → detail → comments) |
| 6 | README, secrets audit, this document |

I did **not** ask for “build the whole app in one shot.”

### 3. What prompting pattern did you use for each task?

A repeatable template:

1. **Re-read** the relevant spec section(s).
2. **Name the task ID** (e.g. T3.6) and paste its text from `tasks.md`.
3. **State constraints** (“don’t wire routes yet”, “ask before new dependencies”, “append prompt-history”).
4. **Stop after one task** for human review.

For sensitive areas (state machine, validation), the prompt called out the exact rules (“import `isValidTransition`, don’t reimplement inline”; “400 with `{ error: { message, field? } }`”).

### 4. When did human review happen, and what did you look for?

After **every** task. I scanned the agent’s summary, opened key files (models, `stateMachine.js`, route handlers, tests), and ran the app or tests locally when applicable.

Review focus varied by phase:

- **Models:** field names and enums match `spec.md` §2 exactly.
- **State machine:** only the five valid transitions; terminal states have no outbound edges.
- **API:** status changes only on `PATCH /:id/status`; validation errors use the spec error shape.
- **Frontend:** UI mirrors backend rules where needed (status buttons), inline field errors not generic toasts.
- **Tests:** `npm test` in `server/` — especially integration tests hitting the real HTTP route, not just the pure function.

### 5. What persistent rules or project files most helped?

Most useful:

- **`spec.md`** — data model, API table, state machine, validation, error format.
- **`tasks.md`** — ordered scope; prevented “while I’m here” expansions.
- **`.cursor/rules/project.mdc`** — always-on rules: no auth, no scope creep, server-side validation authoritative, mandatory state-machine tests, prompt-history logging.
- **`prompt-history.md`** — lightweight log of what was asked, what shipped, and corrections (see Q7).

Less critical but helpful: `acceptance-criteria.md` as a checklist when writing Phase 4 tests (criteria #9 validation, #11 state-machine integration tests).

### 6. How did you handle the ticket status state machine?

Deliberately **in three layers**, with a single backend source of truth:

1. **Phase 2 — Pure module** (`server/utils/stateMachine.js`): `VALID_TRANSITIONS` + `isValidTransition(from, to)`. No DB/HTTP. Unit-tested in isolation (T2.2).
2. **Phase 3 — One enforcement point** (`PATCH /api/tickets/:id/status`): imports `isValidTransition`; 400 message lists current status and allowed targets from `VALID_TRANSITIONS` (T3.6). General `PATCH /:id` **rejects** `status` in the body (T3.5).
3. **Phase 4 — Integration tests** hit the real route for all valid transitions and representative invalid ones; assert DB unchanged on 400 (T4.2–T4.3).

**Frontend tradeoff (flagged, not hidden):** `client/src/utils/stateMachine.js` duplicates `VALID_TRANSITIONS` so transition buttons only show legal next statuses (T5.5). Backend remains authoritative; UI copy can drift if the spec changes — acceptable for UX, documented in `prompt-history.md`.

### 7. What went wrong or needed correction during the project?

| Issue | What happened | Resolution |
|-------|----------------|------------|
| **`npm create vite` blocked** in agent environment (T0.1) | Scaffold created manually | Worked; user ran `npm install` locally |
| **`react-router-dom` not installed** (T0.4) | Listed in `package.json` but `node_modules` missing | `npm install` in `client/` |
| **Atlas MongoDB SSL errors** | `npm run seed` failed with TLS alert | Fixed URI (added DB name), Atlas IP allowlist; verified seed works |
| **Vite proxy `ECONNREFUSED` / HTML 404** | `server/.env` had `PORT=8081`; proxy targeted wrong port; another process sometimes bound the port | `VITE_API_PORT` in `client/vite.config.js` + `client/.env.example`; align ports; `curl /health` verification documented in README |
| **Agent couldn’t always run `npm install`/tests** early on | Reported “verify locally” instead of claiming green CI | Later runs succeeded; Phase 4 explicitly required running full suite |

**Corrections from me:** port-alignment instructions after proxy bug; adding `alwaysApply` frontmatter to `project.mdc`; continuing task-by-task rather than batching phases.

### 8. How did you verify the implementation?

| Layer | How |
|-------|-----|
| **Unit** | `server/utils/stateMachine.test.js` — all valid/invalid/same-status/unknown status cases; `server/utils/ticketValidation.test.js` — create/update/comment validation helpers |
| **Integration** | Supertest + `mongodb-memory-server` — real routes, isolated DB, `afterEach` collection clear; state machine, create validation, search/filter, comments, field updates |
| **Manual API** | `curl /health`, `curl /api/tickets`, seed + dev servers |
| **Manual UI** | Two terminals: `server` `npm run dev` + `client` `npm run dev`; exercise list, create, detail, status buttons, comments |
| **Secrets** | T6.2 grep + `git check-ignore` — no `.env` or credentials in tracked files |

Final backend test run: **71 tests passed** (9 suites) — state machine, validation, search/filter, comments, field updates, infrastructure.

### 9. How did you manage dependencies?

- **Task prompts listed allowed deps** (e.g. T0.2: express, mongoose, dotenv, cors, nodemon; T0.4: react-router-dom).
- **Rule:** “Ask before installing any dependency not listed.”
- Added later with justification: **Jest, Supertest, mongodb-memory-server** (T4.1 — required for mandatory integration test tier); **IBM Plex via Google Fonts** (frontend design system).

No surprise packages in `package.json` beyond those paths.

### 10. What did the AI do well, and where did you still need to steer?

**Did well:**

- Faithful schemas and API routes tied to `spec.md`.
- Isolated state machine before HTTP layer — exactly what the tasks asked for.
- Consistent `{ error: { message, field? } }` after T3.8 refactor to `AppError` middleware.
- Task-scoped diffs; clear per-task summaries.
- `prompt-history.md` entries after each task (per project rule).

**Needed steering:**

- Environment issues (blocked npm scaffold, missing `npm install`, port mismatch) required local verification and explicit troubleshooting docs.
- Frontend state machine duplication — acceptable only because I asked for it to be **called out** in prompt-history (T5.5).
- README and secrets audit (T6.x) — human-triggered polish, not assumed complete by the agent.

### 11. What would you do the same or differently on a similar project?

**Same:**

- Spec + ordered `tasks.md` + stop-after-each-task review.
- Pure state-machine module → single PATCH endpoint → integration tests on the route.
- `.cursor/rules` for non-negotiables (validation, no scope creep).
- `app.js` extract for Supertest; in-memory MongoDB for tests.
- One root README for full-stack port/proxy coordination.

**Different:**

- Run `npm install` in both `client/` and `server/` immediately after scaffold tasks, and add a one-line “first-time setup” script or README step so missing `react-router-dom` doesn’t surprise dev server startup.
- Set `PORT=3000` and `VITE_API_PORT=3000` in `.env.example` from day one (done eventually after proxy incident).
- Consider a **shared** `VALID_TRANSITIONS` package or generated constant for client+server if duplication becomes maintenance pain — for this exercise, documented duplication was the pragmatic choice.
- Export Cursor transcripts into `prompt-history.md` earlier so reflection doesn’t rely on memory.

---

## Part B — Quick reference (what shipped)

| Area | Location |
|------|----------|
| Spec & tasks | `tool-specific/cursor-workflow/` |
| Requirements | `requirements.md` |
| Cursor rules | `.cursor/rules/project.mdc` |
| Session log | `prompt-history.md` |
| State machine (backend) | `server/utils/stateMachine.js` |
| State machine (frontend copy) | `client/src/utils/stateMachine.js` |
| API routes | `server/routes/` |
| Integration tests | `server/test/` |
| Setup guide | `README.md` |

**Commands:** `server`: `npm run seed`, `npm run dev`, `npm test` · `client`: `npm run dev` · UI: `:5173` · API: `:3000` (configurable via `.env`).
