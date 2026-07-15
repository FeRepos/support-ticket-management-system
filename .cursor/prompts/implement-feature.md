# Implement Feature

Use when starting a task from `tool-specific/cursor-workflow/tasks.md`.

## Before coding

1. Read `@tool-specific/cursor-workflow/project-context.md` and `@tool-specific/cursor-workflow/spec.md` (relevant section).
2. Name the **task ID** (e.g. T3.6) and paste its text from `tasks.md`.
3. State constraints: no scope creep, ask before new dependencies, append `prompt-history.md` when done.

## Prompt template

```
Read tool-specific/cursor-workflow/spec.md §[N] before doing anything else.

Execute only Task [Tn.n] from tool-specific/cursor-workflow/tasks.md:
[paste task text]

Constraints:
- Do not implement adjacent tasks
- Server-side validation is authoritative
- Status changes only via PATCH /:id/status using isValidTransition
- Append prompt-history.md per .cursor/rules/project.mdc
- Stop after this task for my review
```

## After completion

- Run relevant tests (`cd server && npm test` if backend changed)
- Append entry to `prompt-history.md` and `prompt-history/task-log.md`
