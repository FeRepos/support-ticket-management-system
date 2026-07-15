# Project Overview — Support Ticket Management System

**Stack:** React (Vite) + Express + MongoDB (Mongoose)  
**AI tool:** Cursor (Agent mode)  
**Scope:** Core exercise — ticket CRUD, comments, search/filter, server-enforced status state machine.

## Start every session with

```
@tool-specific/cursor-workflow/project-context.md
@tool-specific/cursor-workflow/spec.md
```

When touching status logic, also attach `@tool-specific/cursor-workflow/spec.md` §3 State Machine.

## Repo layout

```
client/                 React UI (Vite, react-router)
server/                 Express API, Mongoose, Jest tests
tool-specific/cursor-workflow/   Spec, tasks, submission artifacts
prompt-history/         Per-phase Cursor transcripts
.cursor/                Rules, prompts, checklists, templates
```

## Signature constraint

Ticket status state machine — **non-negotiable**, backend-enforced:

```
Open        → In Progress, Cancelled
In Progress → Resolved, Cancelled
Resolved    → Closed
Closed      → (terminal)
Cancelled   → (terminal)
```

Pure module: `server/utils/stateMachine.js`  
HTTP enforcement: `PATCH /api/tickets/:id/status` only.

## Submission artifacts (canonical paths)

| Document | Path |
|----------|------|
| Requirements + edge cases | `tool-specific/cursor-workflow/requirements.md` |
| AI workflow (Part A) | `tool-specific/cursor-workflow/tool-workflow.md` |
| Reflection | `tool-specific/cursor-workflow/reflection.md` |
| Session journey | `tool-specific/cursor-workflow/session-journey.md` |
| Prompt history template | `.cursor/templates/prompt-history.md` |
| Per-phase transcripts | `prompt-history/` |
| Submission checklist | `.cursor/checklists/submission.md` |
