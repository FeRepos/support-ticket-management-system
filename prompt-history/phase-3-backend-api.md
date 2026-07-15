# Phase 3 — Backend API (T3.1–T3.8)

_Source: Cursor export — Support Ticket Management System_

**User**

Read tool-specific/cursor-workflow/spec.md §4 (API Design), §5 (Validation rules), and
§6 (Error handling) before starting. Use the models from Phase 1 and the isValidTransition
function + VALID_TRANSITIONS from Phase 2 — do not reimplement transition logic inline in
a route; import and use the existing module.

Execute only these tasks, in order, and stop after each for my review:

T3.1 — GET /api/users — return all seeded users (id, name, email, role).

T3.2 — POST /api/tickets — create a ticket. Validate server-side: title, description,
priority, createdBy required; priority must be one of the enum values; reject with 400 and
the error shape { error: { message, field? } } on any failure. Status defaults to "Open"
and is not settable on create.

T3.3 — GET /api/tickets — list tickets, supporting query params:
  ?q=<keyword>  — case-insensitive substring match against title OR description
  &status=<status> — exact match filter
  Both params optional and combinable.

T3.4 — GET /api/tickets/:id — return ticket detail including its comments (populate or a
second query, your choice — but tell me which and why in the response). 404 if not found.

T3.5 — PATCH /api/tickets/:id — update title/description/priority/assignedTo only. Explicitly
reject any attempt to set "status" through this route (400) — status changes only go through
T3.6's dedicated route. Same validation rules as create apply to whichever fields are present.

T3.6 — PATCH /api/tickets/:id/status — body: { status: <new status> }. Use
isValidTransition(current, new) from the Phase 2 module. 400 with a clear message if
invalid, including what the current status is and what it can legally transition to.

T3.7 — GET /api/tickets/:id/comments and POST /api/tickets/:id/comments — list/add comments.
No status restriction on adding comments per spec.md §1.3. message required, non-empty
after trim, 404 if ticket doesn't exist.

T3.8 — Centralized Express error-handling middleware producing the { error: { message,
field? } } shape consistently — 400 for validation/invalid transition, 404 for not found,
500 for anything unexpected (and don't leak stack traces in the 500 response body).

Append your entry to prompt-history.md after each task per the logging rule.

---

**Cursor**

Reading the API spec and server structure, then implementing T3.1 only.


Implementing T3.1: adding the users route and wiring it into the app.


**T3.1 complete** — stopping here for your review.

## What changed

### `server/routes/users.js` (new)
- **`GET /`** — fetches all users, sorted by `name`
- Response shape per user: `{ id, name, email, role }` (`_id` mapped to `id`)

### `server/index.js` (updated)
- Mounted users router at **`/api/users`**

## Example response

```json
[
  {
    "id": "665f...",
    "name": "Alex Rivera",
    "email": "alex.rivera@example.com",
    "role": "agent"
  }
]
```

## To verify locally

```bash
cd server && npm run seed && npm run dev
curl http://localhost:3000/api/users
```

## Not done yet (by design)
- No centralized error middleware (that's **T3.8**)
- No ticket routes yet

---

Reply when you're ready and I'll continue with **T3.2** (POST `/api/tickets`).

---

**User**

continue with T3.2

---

**Cursor**

Implementing POST `/api/tickets` with server-side validation and a reusable validation helper.


**T3.2 complete** — stopping here for your review.

## What changed

### `server/utils/ticketValidation.js` (new)
`validateCreateTicketBody()` checks:
- `title` — required, non-empty after trim, max 200 chars
- `description` — required, non-empty after trim, max 5000 chars
- `priority` — required, must be `low` | `medium` | `high` | `urgent`
- `createdBy` — required, valid ObjectId
- `assignedTo` — optional; if provided, must be a valid ObjectId
- `status` — **rejected** if present in the request body

Returns `{ message, field }` on failure, or `null` if valid.

### `server/routes/tickets.js` (new)
- **`POST /`** — creates a ticket
- Validates body, then verifies `createdBy` (and `assignedTo` if sent) reference existing users
- Status defaults to **`Open`** via the Mongoose schema (not accepted on create)
- **201** with full ticket object (`id`, fields, timestamps)
- **400** with `{ error: { message, field? } }` on validation failure

### `server/index.js` (updated)
- Mounted tickets router at **`/api/tickets`**

## Example

```bash
curl -X POST http://localhost:3000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New issue",
    "description": "Something broke",
    "priority": "high",
    "createdBy": "<user-id-from-/api/users>"
  }'
```

Invalid example (status on create):
```json
{ "error": { "message": "status cannot be set on create", "field": "status" } }
```

---

Reply when you're ready and I'll continue with **T3.3** (GET `/api/tickets` with search/filter).

---

**User**

continue with T3.3

---

**Cursor**

**T3.3 complete** — stopping here for your review.

## What changed

### `server/routes/tickets.js` — `GET /`

Supports optional, combinable query params:

| Param | Behavior |
|-------|----------|
| `?q=<keyword>` | Case-insensitive substring match on **title** OR **description** (regex with special chars escaped) |
| `&status=<status>` | Exact match on `status` |

- Neither param → returns all tickets
- Both params → filters must match **both** conditions
- Results sorted by `updatedAt` descending

## Examples

```bash
curl http://localhost:3000/api/tickets
curl "http://localhost:3000/api/tickets?status=Open"
curl "http://localhost:3000/api/tickets?q=vpn"
curl "http://localhost:3000/api/tickets?q=portal&status=Resolved"
```

### `prompt-history.md`
Appended the T3.3 log entry.

---

Reply when you're ready and I'll continue with **T3.4** (GET `/api/tickets/:id` with comments).

---

**User**

continue with T3.4

---

**Cursor**

Implementing GET `/api/tickets/:id` using a separate Comment query — comments live on the Comment model via `ticketId`, not as a Ticket subdocument.


**T3.4 complete** — stopping here for your review.

## What changed

### `server/routes/tickets.js` — `GET /:id`
- Validates `id` as an ObjectId; **404** if invalid or ticket missing
- Returns ticket fields plus a `comments` array
- Comments sorted by `createdAt` ascending (oldest first)

## Populate vs second query — why a second query

Comments live on the **Comment** collection with a `ticketId` reference — they are not embedded on Ticket, and Ticket has no comments array or virtual defined.

A **second query** (`Comment.find({ ticketId: id })`) was chosen because it:
- Matches the existing schema without adding virtuals or changing the model
- Keeps the route logic explicit and easy to follow
- Avoids populate setup that would only serve this one read path

Populate would need a virtual on `Ticket` (e.g. `ticketSchema.virtual('comments', { ref: 'Comment', localField: '_id', foreignField: 'ticketId' })`) — reasonable later, but extra schema work for the same result here.

## Example response

```json
{
  "id": "...",
  "title": "VPN connection drops intermittently",
  "description": "...",
  "priority": "high",
  "status": "Open",
  "assignedTo": "...",
  "createdBy": "...",
  "createdAt": "...",
  "updatedAt": "...",
  "comments": [
    {
      "id": "...",
      "ticketId": "...",
      "message": "Collected logs from three affected users...",
      "createdBy": "...",
      "createdAt": "..."
    }
  ]
}
```

### `prompt-history.md`
Appended the T3.4 log entry.

---

Reply when you're ready and I'll continue with **T3.5** (PATCH `/api/tickets/:id` for field updates only).

---

**User**

continue with T3.5

---

**Cursor**

**T3.5 complete** — stopping here for your review.

## What changed

### `server/utils/ticketValidation.js`
Added `validateUpdateTicketBody()`:
- **Rejects `status`** → directs caller to `PATCH /api/tickets/:id/status`
- **Rejects `createdBy`** → not updatable
- Requires at least one of: `title`, `description`, `priority`, `assignedTo`
- Validates only fields **present** in the body (same rules as create for title/description/priority)
- `assignedTo` — valid ObjectId if set; `null` or `""` allowed to unassign

### `server/routes/tickets.js` — `PATCH /:id`
- **404** if id invalid or ticket not found
- **400** on validation failure with `{ error: { message, field? } }`
- Updates only the allowed fields, then `save()`
- Verifies `assignedTo` references an existing user when setting an assignee

## Examples

```bash
# Update priority
curl -X PATCH http://localhost:3000/api/tickets/<id> \
  -H "Content-Type: application/json" \
  -d '{"priority": "urgent"}'

# Unassign
curl -X PATCH http://localhost:3000/api/tickets/<id> \
  -H "Content-Type: application/json" \
  -d '{"assignedTo": null}'

# Rejected — status not allowed here
curl -X PATCH http://localhost:3000/api/tickets/<id> \
  -H "Content-Type: application/json" \
  -d '{"status": "Closed"}'
# → 400 { "error": { "message": "status must be updated via PATCH /api/tickets/:id/status", "field": "status" } }
```

### `prompt-history.md`
Appended the T3.5 log entry.

---

Reply when you're ready and I'll continue with **T3.6** (PATCH `/api/tickets/:id/status` using `isValidTransition`).

---

**User**

continue with T3.6

---

**Cursor**

**T3.6 complete** — stopping here for your review.

## What changed

### `server/routes/tickets.js` — `PATCH /:id/status`

- Body: `{ "status": "<new status>" }`
- Imports **`isValidTransition`** and **`VALID_TRANSITIONS`** from `server/utils/stateMachine.js` — no inline transition rules
- **404** if id invalid or ticket not found
- **400** if `status` missing or not a recognized ticket status
- **400** if transition invalid, with a message like:

```json
{
  "error": {
    "message": "Invalid status transition from \"Open\" to \"Closed\". Allowed transitions from \"Open\": In Progress, Cancelled",
    "field": "status"
  }
}
```

For terminal statuses (`Closed`, `Cancelled`), allowed targets show as **`none (terminal status)`**.

- On success: updates ticket and returns the ticket JSON

Route is registered **before** `PATCH /:id` so `/status` matches correctly.

## Example

```bash
# Valid: Open → In Progress
curl -X PATCH http://localhost:3000/api/tickets/<open-ticket-id>/status \
  -H "Content-Type: application/json" \
  -d '{"status": "In Progress"}'

# Invalid: Resolved → In Progress
curl -X PATCH http://localhost:3000/api/tickets/<resolved-ticket-id>/status \
  -H "Content-Type: application/json" \
  -d '{"status": "In Progress"}'
```

### `prompt-history.md`
Appended the T3.6 log entry.

---

Reply when you're ready and I'll continue with **T3.7** (comment routes).

---

**User**

continue with T3.7

---

**Cursor**

Adding comment routes and validation; `createdBy` is required per the Comment model.


**T3.7 complete** — stopping here for your review.

## What changed

### `server/utils/ticketValidation.js`
Added `validateCreateCommentBody()`:
- `message` — required, non-empty after trim, max 2000 chars
- `createdBy` — required (Comment model field; needed to persist a comment)

### `server/routes/tickets.js`

**`GET /:id/comments`**
- **404** if ticket id invalid or ticket not found
- Returns comments sorted by `createdAt` ascending

**`POST /:id/comments`**
- **404** if ticket not found
- **400** on validation failure
- Verifies `createdBy` references an existing user
- **No status check** — comments allowed on Open, Closed, Cancelled, etc.
- **201** with the created comment

Routes are registered **before** `GET /:id` so `/:id/comments` matches correctly.

## Examples

```bash
# List comments
curl http://localhost:3000/api/tickets/<ticket-id>/comments

# Add comment (works even on Closed/Cancelled tickets)
curl -X POST http://localhost:3000/api/tickets/<ticket-id>/comments \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Following up on this.",
    "createdBy": "<user-id>"
  }'
```

### `prompt-history.md`
Appended the T3.7 log entry.

---

Reply when you're ready and I'll continue with **T3.8** (centralized error-handling middleware).

---

**User**

continue with T3.8

---

**Cursor**

Implementing centralized error middleware and refactoring routes to use it consistently.


**T3.8 complete** — Phase 3 is done. Stopping here for your review.

## What changed

### `server/errors/AppError.js` (new)
- **`AppError`** — `statusCode`, `message`, optional `field`
- **`badRequest(message, field?)`** — 400 helper
- **`notFound(message?)`** — 404 helper

### `server/middleware/errorHandler.js` (new)
Central handler producing `{ error: { message, field? } }`:

| Error type | Status | Response |
|------------|--------|----------|
| `AppError` | `statusCode` from error | `{ error: { message, field? } }` |
| Mongoose `CastError` | 404 | `{ error: { message: "Not found" } }` |
| Mongoose `ValidationError` | 400 | first validation error + field |
| Anything else | 500 | `{ error: { message: "Internal server error" } }` — stack logged to console only |

**`notFoundHandler`** — catches unmatched routes → 404

### `server/index.js` (updated)
- Registers `notFoundHandler` and `errorHandler` **after** all routes

### `server/routes/tickets.js` (refactored)
- Replaced inline `res.status(400/404).json(...)` with `throw badRequest(...)` / `throw notFound(...)`
- Added `findTicketOrThrow()` and `throwIfValidationError()` helpers
- Express 5 forwards async thrown errors to the middleware automatically

## Error flow

```
route throws AppError → errorHandler → JSON { error: { message, field? } }
unexpected error      → console.error → 500 (no stack in body)
unknown route         → notFoundHandler → 404
```

### `prompt-history.md`
Appended the T3.8 log entry.

---

**Phase 3 summary**

| Task | Status |
|------|--------|
| T3.1 — GET `/api/users` | Done |
| T3.2 — POST `/api/tickets` | Done |
| T3.3 — GET `/api/tickets` (search/filter) | Done |
| T3.4 — GET `/api/tickets/:id` | Done |
| T3.5 — PATCH `/api/tickets/:id` | Done |
| T3.6 — PATCH `/api/tickets/:id/status` | Done |
| T3.7 — Comment routes | Done |
| T3.8 — Error middleware | Done |

Reply when you're ready to move on to **Phase 4** (integration tests with Supertest).

---

