# Ad-hoc debugging sessions

_Source: Cursor export — Support Ticket Management System_


**User**

@/Users/himanshumishra/.cursor/projects/Users-himanshumishra-Documents-AI-support-ticket-management-system/terminals/1.txt:29-122 

---

**Cursor**

`react-router-dom` is in `package.json` but not installed — running `npm install` in `client/`.


The error is because `react-router-dom` was listed in `client/package.json` (added in T0.4) but **never installed** — `node_modules` only had React and Vite.

I ran `npm install` in `client/`; it added 5 packages including `react-router-dom`.

Restart the dev server:

```bash
cd client
npm run dev
```

`http://localhost:5173/` should load without the import resolution errors.

---

**User**

@/Users/himanshumishra/.cursor/projects/Users-himanshumishra-Documents-AI-support-ticket-management-system/terminals/1.txt:29-36 

---

**Cursor**

Diagnosing the MongoDB SSL connection failure — checking your env configuration and connection setup.


The TLS error on `npm run seed` almost always means the Atlas connection string or cluster access is misconfigured — not a bug in `seed.js`.

## Likely issues in your `server/.env`

### 1. Missing database name in the URI
Your URI ends with `mongodb.net/?appName=...` — there’s no database name.

Use this shape instead:

```
mongodb+srv://<user>:<password>@cluster0.jypfplv.mongodb.net/support-tickets?retryWrites=true&w=majority&appName=Cluster0
```

Add `/support-tickets` (or any db name) **before** the `?`.

### 2. Atlas network access (very common)
In [MongoDB Atlas](https://cloud.mongodb.com) → **Network Access**:
- Add your current IP, or
- For local dev only: `0.0.0.0/0` (allow from anywhere)

Without this, Atlas often fails with obscure SSL/TLS errors.

### 3. Credentials
In Atlas → **Database Access**, confirm user `himanshumishra_db_user` exists and the password matches. If the password has special characters (`@`, `#`, `%`, etc.), they must be [URL-encoded](https://www.mongodb.com/docs/atlas/troubleshoot-connection/) in the URI.

### 4. Cluster state
Confirm the cluster isn’t paused and is fully provisioned.

---

## Quick fix options

**Option A — Fix Atlas** (update `server/.env`):

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.jypfplv.mongodb.net/support-tickets?retryWrites=true&w=majority&appName=Cluster0
PORT=8081
```

Then:

```bash
cd server
npm run seed
```

**Option B — Local MongoDB** (simpler for dev):

```env
MONGO_URI=mongodb://localhost:27017/support-tickets
PORT=8081
```

Requires local MongoDB running (`brew services start mongodb-community`).

---

## Security note
Your Atlas password is in `server/.env`. That file should stay gitignored (it is). If it was ever committed or shared, rotate the password in Atlas → Database Access.

---

After updating `.env`, run `npm run seed` again. If it still fails, share the new error message (without the connection string) and we can narrow it down.

---

**User**

@/Users/himanshumishra/.cursor/projects/Users-himanshumishra-Documents-AI-support-ticket-management-system/terminals/1.txt:37-44 

---

**Cursor**

Checking your current `.env` and testing the MongoDB connection.


The database name fix looks good — your URI shape is correct now (`.../ticket-management?...`).

I ran `npm run seed` with your current `server/.env` and it **succeeded**:

```
MongoDB connected successfully
Seed completed: 4 users, 6 tickets, 3 comments
```

So the Atlas user, password, and cluster hostname are valid. The SSL error on your machine is almost certainly **environment/network**, not the seed script.

## Most likely cause: Atlas IP allowlist

Atlas often returns vague TLS errors when your IP isn’t allowed.

1. Open [MongoDB Atlas](https://cloud.mongodb.com) → your project → **Network Access**
2. Click **Add IP Address**
3. Either:
   - **Add Current IP Address**, or
   - For local dev only: `0.0.0.0/0` (allow from anywhere)
4. Wait 1–2 minutes for the rule to apply
5. Retry:

```bash
cd server
npm run seed
```

## Other things to check on your Mac

| Check | Action |
|-------|--------|
| **VPN** | Disconnect and retry (VPNs often break Atlas TLS) |
| **Stale terminal** | Run seed again after the `.env` update (you may have retried an old config) |
| **Corporate proxy / SSL inspection** | Try off VPN / different network |

## Optional: use standard Atlas query params

In Atlas → **Connect** → **Drivers**, copy the full string. It usually looks like:

```
mongodb+srv://<user>:<password>@cluster0.jypfplv.mongodb.net/ticket-management?retryWrites=true&w=majority&appName=Cluster0
```

`retryWrites=true&w=majority` isn’t required for the SSL error, but matches Atlas’s default.

## Security reminder

Your Atlas password has appeared in `.env` during debugging. Ensure `.env` is never committed, and consider **rotating the database user password** in Atlas → Database Access if it may have been exposed.

---

After updating Network Access, run `npm run seed` again. If it still fails, paste the **new** error line only (not the full connection string).

---

**User**

@server/ npm run test

---

**Cursor**

All **35 tests passed**.

```
Test Suites: 5 passed, 5 total
Tests:       35 passed, 35 total
Time:        ~3.7s
```

Suites:
- `test/infrastructure.test.js`
- `test/statusTransitions.valid.test.js`
- `test/statusTransitions.invalid.test.js`
- `test/ticketCreate.validation.test.js`
- `utils/stateMachine.test.js`

---

The Vite proxy error (`ECONNREFUSED` on `/api/tickets`) is separate — the **backend isn’t running** on the port Vite proxies to. Start it in another terminal:

```bash
cd server
npm run dev
```

Ensure `server/.env` `PORT` matches what `client/vite.config.js` proxies to (often `8081` vs `3000`).

---

