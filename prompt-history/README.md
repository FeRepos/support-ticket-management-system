# Prompt History — Index

Full Cursor (Agent mode) conversation exports for the Support Ticket Management System Core build. Use this folder plus the root-level exports to review **what was asked** and **what the agent did** end-to-end.

**Tool:** Cursor 3.9.16 · **Model:** Agent mode · **Project:** `tasks.md` Phases 0–6

---

## Files in this repo

| File | Coverage | Format |
|------|----------|--------|
| [`task-log.md`](./task-log.md) | T1.1 → T6.5 | Structured one-line-per-task log (from `.cursor/rules` logging rule) |
| [`export-phase6-completion.md`](./export-phase6-completion.md) | T6.3, T6.4, T6.5 + ops sessions | Full User/Cursor transcript |
| [`../prompt-history-server-detailed.md`](../prompt-history-server-detailed.md) | Phases 0–6 (setup → API → tests → T6.2) | Full export (_7/15/2026_) |
| [`../prompt-history-client-detailed.md`](../prompt-history-client-detailed.md) | Phase 5 UI (design system → comments) | Full export (_7/15/2026_) |
| [`../prompt-history.md`](../prompt-history.md) | Early Phase 0 export + embedded task log | Mixed (legacy; see `task-log.md` for clean index) |

**Note:** `prompt-history-server-detialed.md` was renamed to `prompt-history-server-detailed.md` (typo fix, T6.5).

---

## Coverage by phase

| Phase | Tasks | Primary export |
|-------|-------|----------------|
| 0 | T0.1–T0.4 | `prompt-history-server-detailed.md` (start) |
| 1 | T1.1–T1.4 | server export + `task-log.md` |
| 2 | T2.1–T2.2 | server export + `task-log.md` |
| 3 | T3.1–T3.8 | server export + `task-log.md` |
| 4 | T4.1–T4.4 | server export + `task-log.md` |
| 5 | T5.1–T5.6 | `prompt-history-client-detailed.md` + `task-log.md` |
| 6 | T6.1–T6.5 | server export (T6.1–T6.2) + `export-phase6-completion.md` (T6.3–T6.5) |

---

## Ad-hoc / debugging sessions (also exported)

| Topic | Where |
|-------|--------|
| `react-router-dom` not installed (Vite import error) | server export |
| MongoDB Atlas SSL / seed failure | server export |
| Vite proxy `ECONNREFUSED` / port mismatch | server export + `task-log.md` (Dev proxy entry) |
| `npm run test` verification | server export |

---

## Related submission artifacts

- [`../tool-workflow.md`](../tool-workflow.md) — Part A workflow reflection (11 questions)
- [`../reflection.md`](../reflection.md) — Technical reflection
- [`../PR_DESCRIPTION.md`](../PR_DESCRIPTION.md) — PR body for review

---

## How to update

1. After each `tasks.md` task: append to [`task-log.md`](./task-log.md) per `.cursor/rules/project.mdc`.
2. After a major Cursor session: **Export chat** (Cursor → … → Export) and save as `export-YYYY-MM-DD-<topic>.md` in this folder.
3. Update the coverage table above if a new export file is added.

**Security:** Never commit real `MONGO_URI` credentials into exports. Redact passwords if they appear in chat exports before pushing to a public remote.
