# Phase 2 — State machine (T2.1–T2.2)

_Source: Cursor export — Support Ticket Management System_

**User**

Create .gitingnore for this project

---

**Cursor**

Checking existing ignore files and project layout before adding a root `.gitignore`.


Created a root `.gitignore` for the project (you had `.gitingnore` — assuming that was a typo).

## What it ignores

| Category | Patterns |
|----------|----------|
| Dependencies | `node_modules/` (covers both `client/` and `server/`) |
| Secrets | `.env`, `.env.local`, `.env.*.local` |
| Build output | `dist/`, `dist-ssr/`, `build/` |
| Logs | `*.log`, `logs/` |
| Tests | `coverage/` (for future Jest runs) |
| OS / editor | `.DS_Store`, `.idea/`, `.vscode/*` (keeps `extensions.json`) |

`client/.gitignore` is still there for Vite-specific defaults. The root file covers the whole repo, including `server/`.

`.env.example` is **not** ignored, so it stays committable as documentation.

---

**User**

Read tool-specific/cursor-workflow/spec.md §3 (State Machine) again — this is the single
most important piece of business logic in the project, and it must match the spec exactly.

Execute only these tasks, and stop after each for my review:

T2.1 — Create server/utils/stateMachine.js (or statusTransitions.js) exporting a pure
function isValidTransition(from, to) with zero dependencies on the DB, Express, or any
other module — it should be testable by importing it alone. Also export the transition map
itself as a named constant (e.g. VALID_TRANSITIONS) so routes and tests can both reference
the same source of truth rather than duplicating the rules.

The only valid transitions are exactly these — no others, in either direction:
Open -> In Progress
Open -> Cancelled
In Progress -> Resolved
In Progress -> Cancelled
Resolved -> Closed

Closed and Cancelled are terminal — no valid transitions out of them, including back to
themselves (a status "changing" to its own current value is not a valid transition).

T2.2 — In server/utils/stateMachine.test.js (or wherever the project's test convention
puts unit tests), write tests covering:
- every one of the 5 valid transitions above returns true
- every same-status "transition" (Open->Open, etc.) returns false
- at least these invalid/tempting ones return false: Resolved->In Progress, Closed->Open,
  Cancelled->Open, In Progress->Open, Closed->Resolved
- an unrecognized status string passed to either side returns false rather than throwing

Do not wire this into any route yet — that's Phase 3, task T3.6. This module should stand
alone and be fully testable in isolation first.

Append your entry to prompt-history.md after each task per the logging rule.

---

**Cursor**

Reading the state machine spec and checking the server structure before implementing T2.1.


**T2.1 complete** — stopping here for your review.

## What changed

### `server/utils/stateMachine.js` (new)

Pure module with no imports — testable in isolation.

**`VALID_TRANSITIONS`** — single source of truth:

| From | Allowed targets |
|------|-----------------|
| `Open` | `In Progress`, `Cancelled` |
| `In Progress` | `Resolved`, `Cancelled` |
| `Resolved` | `Closed` |
| `Closed` | *(none — terminal)* |
| `Cancelled` | *(none — terminal)* |

**`isValidTransition(from, to)`** behavior:
- Returns `false` if `from` or `to` is not a recognized status (no throw)
- Returns `false` for same-status moves (`Open` → `Open`, etc.)
- Returns `true` only for transitions listed in `VALID_TRANSITIONS`

### `prompt-history.md`
Appended the T2.1 log entry.

## Not done yet (by design)
- No route wiring (that's **T3.6**)
- No tests yet (that's **T2.2**)

---

Reply when you're ready and I'll continue with **T2.2** (unit tests). That will require adding **Jest** to `server/package.json` — it's listed in the project stack (`project-context.md`) but not installed yet. Confirm if you want me to proceed with that.

---

**User**

continue with T2.2

---

**Cursor**

Adding Jest and writing state machine unit tests.


**T2.2 complete** — Phase 2 is done. Stopping here for your review.

## What changed

### `server/utils/stateMachine.test.js` (new)

Jest tests for `isValidTransition`, grouped as:

| Suite | Coverage |
|-------|----------|
| **Valid transitions** | All 5 spec transitions return `true` |
| **Same-status** | `Open→Open`, `In Progress→In Progress`, `Resolved→Resolved`, `Closed→Closed`, `Cancelled→Cancelled` all return `false` |
| **Invalid transitions** | `Resolved→In Progress`, `Closed→Open`, `Cancelled→Open`, `In Progress→Open`, `Closed→Resolved` all return `false` |
| **Unrecognized statuses** | Unknown `from`, unknown `to`, both unknown return `false` without throwing |

### `server/package.json`
- Added **`jest`** as a devDependency
- Added **`"test"`** script with ESM support: `node --experimental-vm-modules node_modules/jest/bin/jest.js`

### `prompt-history.md`
Appended the T2.2 log entry.

## To verify locally

```bash
cd server
npm install
npm test
```

Tests were not run in this environment (`npm install` was blocked). Run the commands above to confirm they pass.

---

**Phase 2 summary**

| Task | Status |
|------|--------|
| T2.1 — `isValidTransition` + `VALID_TRANSITIONS` | Done |
| T2.2 — Unit tests | Done |

Reply when you're ready to move on to **Phase 3** (backend API routes).

---

