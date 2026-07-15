# Support Ticket Management System

Internal support ticket app: React (Vite) frontend, Express + MongoDB backend.

## Submission package (Code Pulse)

| Document | Purpose |
|----------|---------|
| **AI tool** | Cursor (Agent mode) |
| [`requirements.md`](./requirements.md) | Requirement breakdown, edge cases, test traceability |
| [`tool-workflow.md`](./tool-workflow.md) | AI workflow reflection (Part A, 11 questions) |
| [`prompt-history.md`](./prompt-history.md) | Prompt and task log (T0–T6) |
| [`prompt-history/`](./prompt-history/) | Prompt history index and exports |
| [`reflection.md`](./reflection.md) | Design decisions, tradeoffs, and learnings |
| [`PR_DESCRIPTION.md`](./PR_DESCRIPTION.md) | PR summary, acceptance mapping, test plan |

**Tests:** `cd server && npm test` — 71 tests (9 suites)

## Prerequisites

- **Node.js** 18+ and **npm**
- **MongoDB** — either:
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier), or
  - MongoDB installed locally (e.g. macOS: `brew install mongodb-community` then `brew services start mongodb-community`)

## Quick start

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment

**Backend** — copy the example file and fill in values (never commit `.env`):

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string (see examples below) |
| `PORT` | API port (default `3000`) |

**Frontend** — only needed if your API port is **not** `3000`:

```bash
cd client
cp .env.example .env
```

Set `VITE_API_PORT` in `client/.env` to the **same value** as `PORT` in `server/.env`. The Vite dev server proxies `/api/*` to `http://localhost:<VITE_API_PORT>`.

#### `MONGO_URI` examples (placeholders only — use your own values)

**Local MongoDB:**

```
MONGO_URI=mongodb://localhost:27017/support-tickets
PORT=3000
```

**MongoDB Atlas** (from Atlas → Connect → Drivers; replace `<password>` and database name):

```
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/support-tickets?retryWrites=true&w=majority
PORT=3000
```

Atlas checklist: cluster running, database user created, your IP on the **Network Access** allowlist.

### 3. Seed the database (first time, or to reset sample data)

```bash
cd server
npm run seed
```

Expected output: `Seed completed: 4 users, 6 tickets, 3 comments`

### 4. Start the backend

```bash
cd server
npm run dev
```

Uses **nodemon** (restarts on file changes). For a one-off run without nodemon: `npm start`.

Verify the API:

```bash
curl http://localhost:3000/health
# → {"status":"ok"}
```

(Use your `PORT` if not `3000`.)

### 5. Start the frontend

In a **second terminal**:

```bash
cd client
npm run dev
```

Open **http://localhost:5173/** in your browser.

## Ports

| Service | Default port | Config |
|---------|--------------|--------|
| Frontend (Vite) | **5173** | Fixed by Vite (`npm run dev`) |
| Backend (Express) | **3000** | `PORT` in `server/.env` |
| API proxy target | must match backend | `VITE_API_PORT` in `client/.env` (default `3000`) |

If `PORT` and `VITE_API_PORT` differ, API calls from the UI will fail with proxy/connection errors.

## Run tests

Backend integration and unit tests (uses an in-memory MongoDB — does **not** touch your dev database):

```bash
cd server
npm test
```

Coverage includes:

- State machine unit + integration tests (valid and invalid transitions)
- Create-ticket validation
- Search/filter (`?q=`, `&status=`) including regex-escape edge cases
- Comments API (including on Closed tickets)
- Field update validation (including edits on Closed tickets)
- Validation helpers (`ticketValidation.js`)

## Troubleshooting

**`MongoDB connection failed` / SSL errors (Atlas)**  
- Add your current IP under Atlas → Network Access (or `0.0.0.0/0` for local dev only).  
- Ensure the URI includes a database name: `...mongodb.net/support-tickets?...`  
- Disconnect VPN if TLS errors persist.

**`http proxy error: ECONNREFUSED` or HTML `Cannot GET /api/tickets`**  
- Backend is not running, or another process is on the API port.  
- Confirm `curl http://localhost:<PORT>/health` returns `{"status":"ok"}`.  
- Align `PORT` (server) and `VITE_API_PORT` (client), then restart both dev servers.

**`Failed to resolve import "react-router-dom"`**  
- Run `npm install` in `client/`.

## Project layout

```
client/          React + Vite UI
server/          Express API, Mongoose models, seed script, tests
tool-specific/   Spec, tasks, and workflow docs (not runtime)
```

## API overview

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/users` | List users (for assignee/creator dropdowns) |
| GET | `/api/tickets` | List tickets (`?q=` keyword, `&status=` filter) |
| POST | `/api/tickets` | Create ticket |
| GET | `/api/tickets/:id` | Ticket detail with comments |
| PATCH | `/api/tickets/:id` | Update fields (not status) |
| PATCH | `/api/tickets/:id/status` | Status transition (state machine enforced) |
| GET/POST | `/api/tickets/:id/comments` | List / add comments |

Ticket status transitions are fixed server-side; invalid transitions return `400`.
