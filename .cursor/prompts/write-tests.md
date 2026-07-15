# Write Tests

Use when adding or extending backend tests (Phase 4+ or T6.6).

## Context to attach

- `@tool-specific/cursor-workflow/acceptance-criteria.md`
- `@tool-specific/cursor-workflow/spec.md` §3 (state machine)
- `@server/test/helpers.js` (existing patterns)

## Prompt template

```
Add integration tests for [feature/route] using Supertest + mongodb-memory-server.

Follow existing patterns in server/test/:
- Use helpers from test/helpers.js
- afterEach clears collections (see test/setup.js)
- Assert error shape { error: { message, field? } } on 400
- For status tests: assert DB unchanged on invalid transition

Run cd server && npm test and confirm all pass.
Append prompt-history.md when done.
```

## Mandatory coverage (Core)

- All valid status transitions via HTTP
- Representative invalid transitions (Resolved→In Progress, Closed→Open, etc.)
- Create validation
- Search/filter and comments (acceptance #7, #12–#14)
