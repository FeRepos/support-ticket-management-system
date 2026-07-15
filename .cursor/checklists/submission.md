# Exercise Submission Checklist

Complete before sharing repository for AI Capability Exercise / Code Pulse review.

**AI tool:** Cursor (Agent mode)  
**Repo branch:** `master` (or this feature branch after merge)

## Application (Core)

- [x] Frontend runs (`client/` — `npm run dev`)
- [x] Backend API runs (`server/` — `npm run dev`)
- [x] MongoDB persistence — data survives restart
- [x] Seed script: `cd server && npm run seed`
- [x] Create, list, view, update tickets via UI
- [x] Add comments (any ticket status)
- [x] Status changes via state machine only (`PATCH /:id/status`)
- [x] Keyword search + status filter (`?q=`, `&status=`)
- [x] Backend validation + inline UI errors
- [x] No secrets in repo (`.env` gitignored, `.env.example` provided)

## Tests

- [x] `cd server && npm test` — **71 tests**, 9 suites
- [x] State machine integration tests (valid + invalid transitions)
- [x] Search/filter, comments, field-update integration tests
- [x] Validation unit tests (`ticketValidation.test.js`)
- [ ] Frontend component tests (Stretch — deferred)
- [ ] Playwright E2E (Stretch — deferred)

## AI Workflow Artifacts (canonical locations)

- [x] `tool-specific/cursor-workflow/project-context.md`
- [x] `tool-specific/cursor-workflow/spec.md`
- [x] `tool-specific/cursor-workflow/tasks.md`
- [x] `tool-specific/cursor-workflow/acceptance-criteria.md`
- [x] `tool-specific/cursor-workflow/cursor-rules-or-instructions.md`
- [x] `tool-specific/cursor-workflow/requirements.md` — edge cases + traceability
- [x] `tool-specific/cursor-workflow/tool-workflow.md` — Part A (11 questions)
- [x] `tool-specific/cursor-workflow/reflection.md`
- [x] `tool-specific/cursor-workflow/session-journey.md`
- [x] `tool-specific/cursor-workflow/PR_DESCRIPTION.md`
- [x] `.cursor/templates/prompt-history.md` — prompt log index
- [x] `prompt-history/` — per-phase transcripts
- [x] `prompt-history.md` — root task log (mirror)
- [x] `.cursor/rules/project.mdc`
- [x] `.cursor/prompts/` — reusable session prompts
- [x] `.cursor/context/project-overview.md`

## README

- [x] Root README with setup, ports, tests, troubleshooting
- [x] Submission / Cursor workflow section with links to checklist
- [x] `.env.example` in `server/` and `client/`

## Stretch (deferred — not required for Core)

- [ ] Auth / JWT
- [ ] Docker Compose
- [ ] GitHub Actions CI
- [ ] Swagger / OpenAPI
- [ ] Pagination, priority filter

## Code Pulse form (platform — not in repo)

Fill on submission portal:

- **AI tool:** Cursor (Agent mode)
- **Repository URL:** your GitHub repo
- **Branch:** `master`
- **Key files:** `tool-specific/cursor-workflow/tool-workflow.md`, `.cursor/templates/prompt-history.md`, `requirements.md`
