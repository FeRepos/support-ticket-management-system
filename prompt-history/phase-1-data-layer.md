# Phase 1 — Data layer (T1.1–T1.4)

_Source: Cursor export — Support Ticket Management System_

**User**

Read tool-specific/cursor-workflow/spec.md §2 (Data Model) again before starting — the
schemas must match those field lists and enums exactly, no extra or renamed fields.

Execute only these tasks from tasks.md, in order, and stop after each one for my review:

T1.1 — Create a Mongoose schema for User in server/models/User.js:
name (String, required), email (String, required, unique), role (String enum: "agent" | "admin").

T1.2 — Create a Mongoose schema for Ticket in server/models/Ticket.js with all fields from
spec.md §2: title (String, required, 1-200 chars), description (String, required, 1-5000
chars), priority (enum: low|medium|high|urgent, required), status (enum: Open|In
Progress|Resolved|Closed|Cancelled, default "Open"), assignedTo (ObjectId ref User,
nullable), createdBy (ObjectId ref User, required). Use Mongoose timestamps for
createdAt/updatedAt rather than manual fields.

T1.3 — Create a Mongoose schema for Comment in server/models/Comment.js: ticketId (ObjectId
ref Ticket, required), message (String, required, 1-2000 chars), createdBy (ObjectId ref
User, required), createdAt via timestamps.

T1.4 — Create server/seed.js: connects to MongoDB, clears existing Users/Tickets/Comments,
inserts 3-4 seed users (mixed agent/admin roles), 5-6 seed tickets with varied priority and
status values (including at least one in each status so the state machine has something to
test against later), and 2-3 seed comments on different tickets. Add an npm script "seed"
in package.json that runs it with node.

Don't add any routes yet — that's Phase 3. Don't add authentication or password fields to
User — Core has no auth.

After each task, append your entry to prompt-history.md per the logging rule in
.cursor/rules/project.mdc.

---

**Cursor**

Reading the data model spec and existing server structure, then implementing T1.1 only.


Implementing T1.1: creating the User Mongoose schema.


**T1.1 complete** — stopping here for your review.

## What changed

### `server/models/User.js` (new)

Mongoose schema aligned with spec.md §2:

| Field | Definition |
|-------|------------|
| `name` | `String`, required |
| `email` | `String`, required, unique |
| `role` | `String`, required, enum: `agent` \| `admin` |

No auth/password fields. No routes wired up.

### `prompt-history.md`
Appended the T1.1 log entry per the project rule.

---

Reply when you're ready and I'll continue with **T1.2** (Ticket schema).

---

**User**

continue with T1.2

---

**Cursor**

**T1.2 complete** — stopping here for your review.

## What changed

### `server/models/Ticket.js` (new)

Schema aligned with spec.md §2:

| Field | Definition |
|-------|------------|
| `title` | `String`, required, 1–200 chars |
| `description` | `String`, required, 1–5000 chars |
| `priority` | enum: `low` \| `medium` \| `high` \| `urgent`, required |
| `status` | enum: `Open` \| `In Progress` \| `Resolved` \| `Closed` \| `Cancelled`, default `Open` |
| `assignedTo` | `ObjectId` ref `User`, nullable (`default: null`) |
| `createdBy` | `ObjectId` ref `User`, required |
| `createdAt` / `updatedAt` | via `{ timestamps: true }` |

Follows the same style as `User.js`. No routes added.

### `prompt-history.md`
Appended the T1.2 log entry.

---

Reply when you're ready and I'll continue with **T1.3** (Comment schema).

---

**User**

continue with T1.3

---

**Cursor**

**T1.3 complete** — stopping here for your review.

## What changed

### `server/models/Comment.js` (new)

Schema aligned with spec.md §2:

| Field | Definition |
|-------|------------|
| `ticketId` | `ObjectId` ref `Ticket`, required |
| `message` | `String`, required, 1–2000 chars |
| `createdBy` | `ObjectId` ref `User`, required |
| `createdAt` | via `{ timestamps: { createdAt: true, updatedAt: false } }` |

Comment has only `createdAt` in the spec (no `updatedAt`), so timestamps are configured accordingly.

### `prompt-history.md`
Appended the T1.3 log entry.

---

Reply when you're ready and I'll continue with **T1.4** (seed script + npm `seed` script).

---

**User**

continue with T1.4

---

**Cursor**

Creating the seed script and adding the npm `seed` script.


**T1.4 complete** — Phase 1 is done. Stopping here for your review.

## What changed

### `server/seed.js` (new)
- Loads env and connects via `connectDB()`
- Clears **Comments → Tickets → Users** (respects refs)
- Seeds **4 users** (3 agents, 1 admin) with synthetic names/emails
- Seeds **6 tickets** with varied priorities and **every status**:
  - `Open` (×2), `In Progress`, `Resolved`, `Closed`, `Cancelled`
- Seeds **3 comments** on three different tickets
- Logs counts, disconnects, and exits on failure

### `server/package.json`
- Added `"seed": "node seed.js"`

### `prompt-history.md`
- Appended the T1.4 log entry

## To verify locally

```bash
cd server
cp .env.example .env   # set MONGO_URI
npm install
npm run seed
```

Expected output:
```
MongoDB connected successfully
Cleared existing Users, Tickets, and Comments
Seed completed: 4 users, 6 tickets, 3 comments
MongoDB disconnected
```

---

**Phase 1 summary**

| Task | Status |
|------|--------|
| T1.1 — User schema | Done |
| T1.2 — Ticket schema | Done |
| T1.3 — Comment schema | Done |
| T1.4 — Seed script | Done |

Reply when you're ready to move on to **Phase 2** (state machine `isValidTransition`).

---

