# Support Ticket Management System

Setup instructions coming soon

## Local development

Run **both** the API and the Vite dev server. The frontend proxies `/api/*` to the backend port configured in `client/.env` (`VITE_API_PORT`, default `3000`). That value **must match** `PORT` in `server/.env`.

```bash
# Terminal 1 — API
cd server
cp .env.example .env   # set MONGO_URI and PORT
npm run seed           # first time only
npm start

# Terminal 2 — frontend
cd client
cp .env.example .env   # only if server PORT is not 3000
npm run dev
```

Verify the API is the correct process:

```bash
curl http://localhost:3000/health
# → {"status":"ok"}

curl http://localhost:3000/api/tickets
# → JSON array of tickets
```

If you get HTML `Cannot GET /api/tickets`, something else is bound to that port — stop it and restart `npm start` in `server/`.

## MongoDB

The server requires a `MONGO_URI` environment variable (see `server/.env.example`).

### Option A — Local MongoDB

1. Install and start MongoDB locally (e.g. via [Homebrew](https://brew.sh) on macOS: `brew install mongodb-community` then `brew services start mongodb-community`).
2. Copy `server/.env.example` to `server/.env`.
3. Set:
   ```
   MONGO_URI=mongodb://localhost:27017/support-tickets
   PORT=3000
   ```

### Option B — MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Add your IP to the cluster network access allowlist and create a database user.
3. Copy the connection string from Atlas (Connect → Drivers) into `server/.env` as `MONGO_URI`, replacing `<password>` and `<dbname>` as needed.
4. Set `PORT=3000` (or your preferred port).

On startup, the server logs `MongoDB connected successfully` or a clear connection failure message before exiting.
