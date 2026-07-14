# Spec — Support Ticket Management System (Core)

## 1. Requirement Analysis

### 1.1 Restated problem
Internal users need a small tool to log support tickets, track them through a defined
lifecycle, discuss them via comments, and find them again via search/filter. The system
must survive restarts (real persistence) and reject bad input/bad transitions server-side.

### 1.2 Ambiguities in the brief, and the resolution taken
| Ambiguity | Resolution | Reasoning |
|---|---|---|
| Are Users authenticated in Core? | No — Core has no login; `createdBy`/`assignedTo` are chosen from a seeded user list in the UI | Brief explicitly marks auth as Stretch-only |
| What counts as "keyword search"? | Case-insensitive substring match against `title` + `description` | Simplest interpretation that satisfies "one working search capability" |
| Can a ticket be edited after it's Closed/Cancelled? | Fields (title/description/priority/assignee) remain editable; only the *status* is constrained by the state machine | Brief only restricts status transitions, not other fields — but this is a judgment call, flagged for review |
| Is Comment creation subject to status restrictions? | No — comments allowed regardless of status | Brief doesn't mention restricting comments; adding an artificial restriction would be scope creep |

### 1.3 Explicit out-of-scope for Core
Auth, user CRUD, priority/assignee filtering, sorting, pagination, unit tests, Swagger docs,
Docker, CI. (All Stretch, deferred until Core is solid.)

## 2. Data Model

### User (seed only)
| field | type | notes |
|---|---|---|
| _id | ObjectId | |
| name | string | required |
| email | string | required, unique |
| role | string enum | `agent` \| `admin` |

### Ticket
| field | type | notes |
|---|---|---|
| _id | ObjectId | |
| title | string | required, 1–200 chars |
| description | string | required, 1–5000 chars |
| priority | enum | `low` \| `medium` \| `high` \| `urgent`, required |
| status | enum | `Open` \| `In Progress` \| `Resolved` \| `Closed` \| `Cancelled`, default `Open` |
| assignedTo | ObjectId ref User | nullable |
| createdBy | ObjectId ref User | required |
| createdAt | Date | auto |
| updatedAt | Date | auto |

### Comment
| field | type | notes |
|---|---|---|
| _id | ObjectId | |
| ticketId | ObjectId ref Ticket | required |
| message | string | required, 1–2000 chars |
| createdBy | ObjectId ref User | required |
| createdAt | Date | auto |

## 3. State Machine (authoritative)
```
Open        -> In Progress, Cancelled
In Progress -> Resolved, Cancelled
Resolved    -> Closed
Closed      -> (terminal)
Cancelled   -> (terminal)
```
Enforced in a single pure function `isValidTransition(from, to)` used by the backend before
any status write. Any other transition → `400` with a descriptive error.

## 4. API Design

| Method | Route | Purpose |
|---|---|---|
| GET | /api/users | list seeded users (for assignee/creator dropdowns) |
| GET | /api/tickets | list tickets; query params `?q=` (keyword) `&status=` |
| POST | /api/tickets | create ticket |
| GET | /api/tickets/:id | ticket detail (includes comments) |
| PATCH | /api/tickets/:id | update fields (title/description/priority/assignee) |
| PATCH | /api/tickets/:id/status | status transition (validated against state machine) |
| GET | /api/tickets/:id/comments | list comments for a ticket |
| POST | /api/tickets/:id/comments | add comment |

Status changes are split into their own endpoint (rather than folded into the general
PATCH) specifically so the state-machine validation has one obvious enforcement point and
one obvious integration-test target.

## 5. Validation rules (server-side, authoritative)
- `title`, `description`, `priority`, `createdBy` required on create
- `priority` must be one of the enum values
- `status` transitions only via `isValidTransition`
- `comment.message` required, non-empty after trim

## 6. Error handling
Consistent JSON error shape: `{ error: { message, field? } }`. 400 for validation/invalid
transition, 404 for missing ticket/comment, 500 for unexpected.

## 7. Acceptance Criteria
See `acceptance-criteria.md` — mirrors the Core Acceptance Criteria list from the brief 1:1,
plus the resolutions from §1.2 above.
