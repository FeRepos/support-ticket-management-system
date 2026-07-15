# Prompt History — Support Ticket Management System

Log significant AI prompts and outcomes for exercise submission.

**Full timeline:** [session-journey.md](../../tool-specific/cursor-workflow/session-journey.md)  
**Per-phase transcripts:** [prompt-history/](../../prompt-history/)  
**Structured task log:** [prompt-history.md](../../prompt-history.md) (root) · [task-log.md](../../prompt-history/task-log.md)

**AI tool:** Cursor (Agent mode)

## Template (per entry)

```markdown
### [YYYY-MM-DD] — Task Tn.n — [Topic]

**Goal:** ...

**Context provided:**
- @files or rules referenced

**Prompt (summarized):**
> ...

**Outcome:**
- What was produced
- What was accepted vs corrected

**Lesson:**
...
```

---

## Key sessions (summary)

### Phase 0 — Scaffold (T0.1–T0.4)

**Goal:** Client + server shell, health route, MongoDB wire-up, routing placeholders.  
**Context:** `@tool-specific/cursor-workflow/spec.md`, `@tasks.md`  
**Outcome:** Manual Vite scaffold when `npm create vite` blocked; user ran `npm install` locally.  
**Detail:** [phase-0-project-setup.md](../../prompt-history/phase-0-project-setup.md)

### Phase 2 — State machine (T2.1–T2.2)

**Goal:** Pure `isValidTransition` before any HTTP layer.  
**Context:** spec §3, `@.cursor/rules/project.mdc`  
**Outcome:** `server/utils/stateMachine.js` + unit tests; no Mongoose in module.  
**Detail:** [phase-2-state-machine.md](../../prompt-history/phase-2-state-machine.md)

### Phase 4 — Integration tests (T4.1–T4.4)

**Goal:** Supertest + in-memory MongoDB; state machine on real route.  
**Outcome:** 35 tests at phase end; later expanded to 71.  
**Detail:** [phase-4-backend-tests.md](../../prompt-history/phase-4-backend-tests.md)

### Phase 5 — Frontend (T5.1–T5.6)

**Goal:** List, search, create, detail, status controls, comments.  
**Outcome:** Duplicated `VALID_TRANSITIONS` on frontend (documented tradeoff T5.5).  
**Detail:** [phase-5-frontend.md](../../prompt-history/phase-5-frontend.md)

### Phase 6 — Submission artifacts (T6.1–T6.8)

**Goal:** README, secrets audit, tool-workflow, reflection, tests expansion, artifact reorganization.  
**Detail:** [phase-6-polish-part1.md](../../prompt-history/phase-6-polish-part1.md), [phase-6-polish-part2.md](../../prompt-history/phase-6-polish-part2.md), [phase-6-extensions.md](../../prompt-history/phase-6-extensions.md)

### Ops debugging

**Topics:** Atlas SSL, Vite proxy port mismatch, missing `react-router-dom`.  
**Detail:** [ops-debugging-sessions.md](../../prompt-history/ops-debugging-sessions.md)
