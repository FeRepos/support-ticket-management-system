# Prompt History — Support Ticket Management System

# Project setup tasks
_Exported on 7/13/2026 at 15:01:21 GMT+5:30 from Cursor (3.9.16)_

---

**User**

Read tool-specific/cursor-workflow/project-context.md and
tool-specific/cursor-workflow/spec.md before doing anything else — they define the stack,
data model, state machine, and standing rules for this project.

Now execute only these tasks from tool-specific/cursor-workflow/tasks.md, in order,
and stop after each one so I can review before you continue:

T0.1 — Init repo structure: client/ (Vite + React), server/ (Express), and a root
README.md stub with just a title and "Setup instructions coming soon" placeholder.

T0.2 — In server/: package.json with express, mongoose, dotenv, cors, nodemon as deps.
A minimal app.js/index.js with a GET /health route returning { status: "ok" }.
Create .env.example with MONGO_URI and PORT placeholders (no real values).

T0.3 — Add a db.js (or similar) module in server/ that connects to MongoDB using
MONGO_URI from .env, with a clear console log on success/failure. Wire it into the
app startup. Add local MongoDB run instructions (or Atlas connection notes) to the
README.

T0.4 — In client/: Vite React scaffold with basic client-side routing (react-router)
with two placeholder pages: TicketList and TicketDetail, no real functionality yet.

Do not implement any Mongoose schemas, routes beyond /health, or UI logic yet —
that's later phases. Ask me before installing any dependency not listed above.

---

**Cursor**

I'll read the project context and spec first, then execute T0.1 only and pause for your review.


Executing T0.1 only: scaffolding the Vite React client, creating the `server/` directory, and adding the root README stub.


Creating the Vite React scaffold manually since the npm command was blocked.


**T0.1 complete** — stopping here for your review.

## What changed

### Root
- **`README.md`** — title and “Setup instructions coming soon” placeholder

### `client/` (Vite + React)
Manual scaffold (the `npm create vite` command was blocked in this environment):

| File | Purpose |
|------|---------|
| `package.json` | React 19 + Vite 6 scripts (`dev`, `build`, `preview`) |
| `vite.config.js` | Vite with React plugin |
| `index.html` | Entry HTML |
| `src/main.jsx` | React bootstrap |
| `src/App.jsx` | Minimal placeholder component |
| `src/index.css` | Base styles |
| `public/vite.svg` | Default Vite icon |
| `.gitignore` | Standard Vite ignores |

### `server/`
- Empty placeholder directory (`.gitkeep` only) — Express setup is **T0.2**

## Not done yet (by design)
- No `npm install` run
- No Express server code
- No MongoDB connection
- No react-router (that's **T0.4**)

## To verify locally (optional)
```bash
cd client && npm install && npm run dev
```

Reply when you're ready and I'll continue with **T0.2** (server `package.json`, Express `/health`, `.env.example`).

---

**User**

continue with T0.2 

---

**Cursor**

Implementing T0.2: server package.json, minimal Express app with `/health`, and `.env.example`.


Verifying the server installs and the `/health` route works:


**T0.2 complete** — stopping here for your review.

## What changed

### `server/package.json`
Dependencies:
- **dependencies:** `express`, `mongoose`, `dotenv`, `cors`
- **devDependencies:** `nodemon`

Scripts:
- `npm start` — runs `node index.js`
- `npm run dev` — runs `nodemon index.js`

### `server/index.js`
Minimal Express app (ES modules):
- Loads env via `dotenv/config`
- Enables `cors` and JSON body parsing
- **`GET /health`** → `{ "status": "ok" }`
- Listens on `process.env.PORT` or **3000**

### `server/.env.example`
Placeholder keys only (no real values):
```
MONGO_URI=
PORT=
```

### Removed
- `server/.gitkeep` (replaced by real server files)

## Not done yet (by design)
- No MongoDB connection (that's **T0.3**)
- No API routes beyond `/health`
- `mongoose` is listed as a dependency but not used yet

## To verify locally
```bash
cd server
npm install
cp .env.example .env   # optionally set PORT=3000
npm run dev
```

Then in another terminal:
```bash
curl http://localhost:3000/health
# expected: {"status":"ok"}
```

Reply when you're ready and I'll continue with **T0.3** (MongoDB connection module + README notes).

---

**User**

continue with T0.3

---

**Cursor**

Implementing the MongoDB connection module and wiring it into server startup.


**T0.3 complete** — stopping here for your review.

## What changed

### `server/db.js` (new)
- Reads `MONGO_URI` from the environment
- Exits with a clear error if `MONGO_URI` is missing
- Connects via Mongoose
- Logs **`MongoDB connected successfully`** on success
- Logs **`MongoDB connection failed: <message>`** on failure and exits

### `server/index.js` (updated)
- Imports `connectDB` and calls it before `app.listen`
- Startup is async: DB connect first, then HTTP server
- Top-level `start().catch(...)` handles unexpected startup errors

### `README.md` (updated)
Added a **MongoDB** section with:
- **Option A** — local MongoDB (Homebrew install/start, example `MONGO_URI`)
- **Option B** — MongoDB Atlas (cluster setup, connection string, `.env` shape)
- Note about success/failure console logs on startup

## Startup flow

```
load .env → connectDB() → listen on PORT
                ↓ fail → log + exit(1)
```

## To verify locally

```bash
cd server
cp .env.example .env
# set MONGO_URI=mongodb://localhost:27017/support-tickets
npm install
npm run dev
```

Expected logs:
```
MongoDB connected successfully
Server listening on port 3000
```

Reply when you're ready and I'll continue with **T0.4** (client routing with `TicketList` and `TicketDetail` placeholders).

---

**User**

continue with T0.4

---

**Cursor**

Adding react-router and placeholder pages for TicketList and TicketDetail.


**T0.4 complete** — Phase 0 is done. Stopping here for your review.

## What changed

### `client/package.json`
- Added **`react-router-dom`** as a dependency (the only new package for this task)

### `client/src/App.jsx`
- Wrapped the app in `BrowserRouter`
- Routes:
  - `/` → `TicketList`
  - `/tickets/:id` → `TicketDetail`

### `client/src/pages/TicketList.jsx` (new)
- Placeholder list page with heading and a link to an example ticket

### `client/src/pages/TicketDetail.jsx` (new)
- Placeholder detail page showing the `:id` route param
- Link back to the list

## Not implemented (by design)
- No API calls or ticket data
- No forms, search, or status controls

## To verify locally

```bash
cd client
npm install
npm run dev
```

Then open:
- `http://localhost:5173/` — Ticket list placeholder
- `http://localhost:5173/tickets/example-id` — Ticket detail placeholder

---

**Phase 0 summary**

| Task | Status |
|------|--------|
| T0.1 — Repo structure + README stub | Done |
| T0.2 — Express server + `/health` | Done |
| T0.3 — MongoDB connection + README notes | Done |
| T0.4 — Client routing shell | Done |

Reply when you're ready to move on to **Phase 1** (Mongoose schemas and seed data).

---

**User**

mkdir -p .cursor/rules

---

**Cursor**

Created `.cursor/rules` in the project root.

---

**User**

Then create a file .cursor/rules/project.mdc and paste in the full content of tool-specific/cursor-workflow/cursor-rules-or-instructions.md

---

**Cursor**

Created `.cursor/rules/project.mdc` with the full content from `tool-specific/cursor-workflow/cursor-rules-or-instructions.md`.

**Note:** The source file is plain markdown without Cursor rule frontmatter. If you want this rule to apply automatically in every session, you can add YAML frontmatter at the top:

```yaml
---
description: Support Ticket Management System project rules
alwaysApply: true
---
```

Say the word if you'd like me to add that.

---

**User**

add this

---

**Cursor**

Added the YAML frontmatter to `.cursor/rules/project.mdc` so the rule applies automatically in every session:

```yaml
---
description: Support Ticket Management System project rules
alwaysApply: true
---
```

## [2026-07-13 15:30] Task T1.1
**Prompt (my own words, summarized):** Create a Mongoose User schema in server/models/User.js with name, email (unique), and role enum (agent|admin), matching spec.md §2 exactly.
**What you did:** Added server/models/User.js with a User schema: name and email (required, unique), role (required enum: agent|admin). No routes or auth fields.
**Corrections/iteration:** none

## [2026-07-13 15:32] Task T1.2
**Prompt (my own words, summarized):** Create a Mongoose Ticket schema with all spec.md §2 fields, length constraints, enums, User refs, and Mongoose timestamps for createdAt/updatedAt.
**What you did:** Added server/models/Ticket.js with title (1–200), description (1–5000), priority (low|medium|high|urgent), status (Open|In Progress|Resolved|Closed|Cancelled, default Open), assignedTo (nullable User ref), createdBy (required User ref), and `{ timestamps: true }`.
**Corrections/iteration:** none

## [2026-07-13 15:34] Task T1.3
**Prompt (my own words, summarized):** Create a Mongoose Comment schema with ticketId, message (1–2000 chars), createdBy refs, and createdAt via timestamps.
**What you did:** Added server/models/Comment.js with ticketId (required Ticket ref), message (1–2000), createdBy (required User ref), and timestamps with only createdAt (no updatedAt, per spec §2).
**Corrections/iteration:** none

## [2026-07-13 15:36] Task T1.4
**Prompt (my own words, summarized):** Create server/seed.js to clear and reseed users, tickets (all statuses), and comments; add npm run seed.
**What you did:** Added server/seed.js (connects via db.js, clears Comment/Ticket/User, inserts 4 users, 6 tickets covering every status with varied priorities, 3 comments on different tickets). Added `"seed": "node seed.js"` to server/package.json.
**Corrections/iteration:** none

