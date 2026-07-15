# Phase 6 — Polish (T6.1–T6.2)

_Source: Cursor export — Support Ticket Management System_

**User**

Execute these tasks, stopping after each for my review:

T6.1 — Write server/README.md and client/README.md (or one root README.md covering
both, your call — tell me which and why) with: prerequisites, how to set MONGO_URI in
.env (reference .env.example, don't put real values in the README), how to run npm run
seed, how to start the backend (npm run dev), how to start the frontend (npm run dev in
client/), how to run npm test, and what port each runs on. Someone who has never seen
this project should be able to follow it and get a working app.

T6.2 — Audit the repo for anything that shouldn't be committed: confirm .env is in
.gitignore (not just .env.example), confirm node_modules is ignored in both client/ and
server/, grep the codebase for any hardcoded connection strings, API keys, or credentials
that should have come from .env instead. Report what you find — fix it if it's a real
leak, flag it to me if you're unsure.

Append entries to prompt-history.md as usual.

---

**Cursor**

Reviewing the project setup to draft T6.1 README documentation.


Using a single root README — setup spans both apps (ports, proxy, seed), so one entry point is clearer for newcomers.


**T6.1 complete** — stopping here for your review.

## Choice: one root `README.md`

I used a **single root README** instead of `server/README.md` + `client/README.md` because:

- Setup is **full-stack** — you need both apps, aligned ports, and seed order in one place
- The Vite proxy requires `PORT` (server) and `VITE_API_PORT` (client) to match — easier to document once
- A new contributor has one entry point rather than two partial guides

If you prefer split READMEs later (e.g. for deployment), we can extract server/client sections from the root doc.

## What’s in `README.md`

| Section | Contents |
|---------|----------|
| Prerequisites | Node 18+, npm, MongoDB (local or Atlas) |
| Quick start | Install → env → seed → backend → frontend |
| `MONGO_URI` | References `.env.example`; local + Atlas **placeholder** examples only |
| Commands | `npm run seed`, `npm run dev` (server), `npm run dev` (client), `npm test` |
| Ports | Vite **5173**, API **3000** (configurable), proxy alignment |
| Troubleshooting | Atlas SSL, proxy `ECONNREFUSED`, missing deps |
| API overview | Route table for reference |

### `prompt-history.md`
Appended the T6.1 log entry.

---

Reply when you're ready and I'll continue with **T6.2** (secrets/commit audit).

---

**User**

continue with T6.2

---

**Cursor**

Auditing the repo for secrets and `.gitignore` coverage.


**T6.2 complete** — stopping here for your review.

## Audit results

### `.gitignore` coverage

| Path | Ignored? | How |
|------|----------|-----|
| `server/.env` | Yes | Root `.gitignore` → `.env` |
| `client/.env` | Yes | Root `.gitignore` → `.env` |
| `server/node_modules` | Yes | Root `.gitignore` → `node_modules/` |
| `client/node_modules` | Yes | `client/.gitignore` → `node_modules` |

**Tracked env files (correct):** only `server/.env.example` and `client/.env.example`.

**Git history:** no `.env` files ever committed.

**Staged files:** no `.env` files staged.

### Credential grep (source + docs)

| Pattern | Result |
|---------|--------|
| `mongodb+srv://` with real host/user | None in code |
| Atlas cluster hostnames | None |
| Hardcoded passwords / API keys / tokens | None |
| `README.md` connection examples | Placeholders only (`<user>`, `<password>`, localhost) |

**Code uses env correctly:** `MONGO_URI` and `PORT` come from `process.env` via `dotenv` in `server/db.js`, `index.js`, `seed.js`. Tests set `MONGO_URI` from `mongodb-memory-server` only.

### Fix applied

Added explicit `.env` / `.env.local` / `.env.*.local` to **`client/.gitignore`** for defense-in-depth (root `.gitignore` already covered them).

### No code leaks found — nothing else to redact in the repo

---

## Flagged for you (outside the repo)

1. **`server/.env` on disk** — contains your real Atlas credentials. It is gitignored (`!! server/.env` in `git status`). Before every push, confirm `.env` does not appear as a tracked/staged file.

2. **Atlas password exposure** — if your DB password was shared in chat or screenshots during debugging, **rotate it** in Atlas → Database Access even though it is not in the git tree.

3. **`prompt-history.md`** — mentions `PORT=8081` in narrative only; no credentials. Safe to commit, but it is a dev log — optional to exclude from public repos if you prefer.

### `prompt-history.md`
Appended the T6.2 log entry.

---

**Acceptance criterion #10:** satisfied — `.env` gitignored, `.env.example` provided, no secrets in tracked source.

