# Prompt History — Index

Full Cursor (Agent mode) conversation exports for the Support Ticket Management System Core build. **Per-phase transcripts** live in this folder; use them to review what was asked and what the agent did, task by task.

**Tool:** Cursor · **Model:** Agent mode · **Project:** `tasks.md` Phases 0–6

---

## Per-phase transcripts (primary)

| Phase | Tasks | File |
|-------|-------|------|
| 0 — Setup | T0.1–T0.4 | [`phase-0-project-setup.md`](./phase-0-project-setup.md) |
| 1 — Data layer | T1.1–T1.4 | [`phase-1-data-layer.md`](./phase-1-data-layer.md) |
| 2 — State machine | T2.1–T2.2 | [`phase-2-state-machine.md`](./phase-2-state-machine.md) |
| 3 — Backend API | T3.1–T3.8 | [`phase-3-backend-api.md`](./phase-3-backend-api.md) |
| 4 — Backend tests | T4.1–T4.4 | [`phase-4-backend-tests.md`](./phase-4-backend-tests.md) |
| 5 — Frontend | T5.1–T5.6 | [`phase-5-frontend.md`](./phase-5-frontend.md) |
| 6 — Polish | T6.1–T6.2 | [`phase-6-polish-part1.md`](./phase-6-polish-part1.md) |
| 6 — Polish | T6.3–T6.5 | [`phase-6-polish-part2.md`](./phase-6-polish-part2.md) |
| 6 — Extensions | T6.6–T6.10 | [`phase-6-extensions.md`](./phase-6-extensions.md) |

**Ad-hoc debugging** (between Phase 4 and Phase 6): [`ops-debugging-sessions.md`](./ops-debugging-sessions.md)

---

## Supporting files

| File | Purpose |
|------|---------|
| [`task-log.md`](./task-log.md) | Structured one-line-per-task log (`.cursor/rules` logging rule) |
| [`../prompt-history.md`](../prompt-history.md) | Same log at repo root + early Phase 0 entry |
| [`archive/`](./archive/) | Original combined exports (_7/15/2026_) before phase split |

| Archive file | Was |
|--------------|-----|
| `archive/prompt-history-server-detailed.md` | Phases 0–4, ops, T6.1–T6.2 (1793 lines) |
| `archive/prompt-history-client-detailed.md` | Phase 5 UI (789 lines) |

---

## Related submission artifacts

- [`../requirements.md`](../requirements.md) — Requirement breakdown (root mirror)
- [`../tool-specific/cursor-workflow/requirements.md`](../tool-specific/cursor-workflow/requirements.md) — Canonical requirements
- [`../tool-specific/cursor-workflow/tool-workflow.md`](../tool-specific/cursor-workflow/tool-workflow.md) — Part A workflow reflection
- [`../tool-specific/cursor-workflow/session-journey.md`](../tool-specific/cursor-workflow/session-journey.md) — Session journey
- [`../tool-specific/cursor-workflow/reflection.md`](../tool-specific/cursor-workflow/reflection.md) — Technical reflection
- [`../.cursor/templates/prompt-history.md`](../.cursor/templates/prompt-history.md) — Prompt history index
- [`../tool-specific/cursor-workflow/PR_DESCRIPTION.md`](../tool-specific/cursor-workflow/PR_DESCRIPTION.md) — PR body

---

## How to update

1. After each `tasks.md` task: append to [`task-log.md`](./task-log.md) and [`../prompt-history.md`](../prompt-history.md) per `.cursor/rules/project.mdc`.
2. After a major Cursor session: **Export chat** → save under `prompt-history/` as `phase-N-<topic>.md` or append to the relevant phase file.
3. Update this README if a new phase file is added.

**Security:** Never commit real `MONGO_URI` credentials into exports. Redact passwords before pushing to a public remote.
