# Requirements — Support Ticket Management System (Core)

Submission-facing requirement analysis for the Core scope. Detailed spec: [`tool-specific/cursor-workflow/spec.md`](./tool-specific/cursor-workflow/spec.md). Acceptance criteria: [`tool-specific/cursor-workflow/acceptance-criteria.md`](./tool-specific/cursor-workflow/acceptance-criteria.md).

**AI tool:** Cursor (Agent mode)

---

## 1. Problem statement

Internal users need a tool to:

- Create and view support tickets
- Update ticket fields and assignees
- Add comments
- Search and filter tickets
- Move tickets through a **fixed status lifecycle** with server-side enforcement

Data must persist across restarts (MongoDB). Invalid input and invalid status transitions must be rejected by the backend.

---

## 2. Core functional requirements

| ID | Requirement |
|----|-------------|
| FR-1 | Create ticket via UI (`title`, `description`, `priority`, `createdBy`; optional `assignedTo`) |
| FR-2 | List all tickets from the database |
| FR-3 | Open ticket detail view (includes comments) |
| FR-4 | Update ticket fields and reassign (`title`, `description`, `priority`, `assignedTo`) |
| FR-5 | Add comments to a ticket |
| FR-6 | Change status only through valid transitions; invalid transitions return `400` |
| FR-7 | Keyword search (`?q=`) and status filter (`&status=`) on ticket list |
| FR-8 | Data persists after server restart (MongoDB, not in-memory for production) |

---

## 3. Status state machine (non-negotiable)

```
Open        → In Progress, Cancelled
In Progress → Resolved, Cancelled
Resolved    → Closed
Closed      → (terminal)
Cancelled   → (terminal)
```

- Enforced in `server/utils/stateMachine.js` via `isValidTransition(from, to)`
- Only `PATCH /api/tickets/:id/status` may change status
- `POST /api/tickets` and `PATCH /api/tickets/:id` must reject `status` in the body

---

## 4. Ambiguities resolved

| Ambiguity | Resolution |
|-----------|------------|
| Authentication in Core? | No — users are seed data; `createdBy`/`assignedTo` chosen from seeded list |
| Keyword search definition | Case-insensitive substring match on `title` + `description` |
| Edit ticket when Closed/Cancelled? | Yes for fields; only status is locked by state machine |
| Comments on terminal tickets? | Allowed — no status gate on comment POST |

---

## 5. Edge cases and validation

| Area | Edge case | Expected behavior |
|------|-----------|-------------------|
| Create | Missing `title`, `description`, `priority`, or `createdBy` | `400` with `field` in error body |
| Create | `status` sent on create | `400` — status defaults to `Open` |
| Create | Invalid `priority` enum | `400` |
| Create | `createdBy` / `assignedTo` not a real user | `400` |
| Update | `status` on general PATCH | `400` — use `/status` endpoint |
| Update | `createdBy` on PATCH | `400` — immutable |
| Update | Empty PATCH body | `400` |
| Update | Edit fields on Closed ticket | `200` — allowed |
| Status | Same-status transition (e.g. Open→Open) | `400` |
| Status | Tempting invalid (Resolved→In Progress, Closed→Open) | `400`; DB unchanged |
| Status | Transition from terminal state | `400` |
| Search | Case mismatch (`LOGIN` vs `login`) | Matches (case-insensitive) |
| Search | Keyword in description only | Ticket returned |
| Search | Combined `?q=` and `&status=` | AND logic |
| Search | Regex special chars in `q` (e.g. `.*`) | Treated as literals (`escapeRegex`) |
| Search | Empty or whitespace `q` | Ignored; returns unfiltered (or status-only filter) |
| Comments | Empty or whitespace `message` | `400` |
| Comments | Comment on Closed ticket | `201` — allowed |
| Comments | Invalid ticket id | `404` |
| IDs | Invalid ObjectId | `404` for ticket routes |

---

## 6. API summary

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/users` | List seeded users |
| GET | `/api/tickets` | List; `?q=` keyword, `&status=` filter |
| POST | `/api/tickets` | Create ticket |
| GET | `/api/tickets/:id` | Detail with comments |
| PATCH | `/api/tickets/:id` | Update fields (not status) |
| PATCH | `/api/tickets/:id/status` | Status transition |
| GET/POST | `/api/tickets/:id/comments` | List / add comments |

Error shape: `{ error: { message, field? } }`

---

## 7. Out of scope (Core)

Auth, user CRUD UI, priority/assignee server-side filters, pagination, Swagger, Docker/CI, frontend component tests.

---

## 8. Test traceability

| Acceptance # | Test coverage |
|--------------|---------------|
| 6, 11 | `statusTransitions.valid/invalid.test.js`, `stateMachine.test.js` |
| 7, 14 | `ticketList.searchFilter.test.js` |
| 9 | `ticketCreate.validation.test.js`, `ticketValidation.test.js`, `ticketUpdate.validation.test.js` |
| 12 | `ticketComments.test.js` (Closed ticket case) |
| 13 | `ticketUpdate.validation.test.js` (edit on Closed) |

Run: `cd server && npm test` (71 tests)

---

## 9. Related submission artifacts

| File | Purpose |
|------|---------|
| [`tool-workflow.md`](./tool-workflow.md) | AI workflow reflection (Part A) |
| [`prompt-history.md`](./prompt-history.md) | Prompt and task log |
| [`reflection.md`](./reflection.md) | Design decisions and tradeoffs |
| [`PR_DESCRIPTION.md`](./PR_DESCRIPTION.md) | PR summary and test plan |
