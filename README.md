# Support Ticket Management System

Setup instructions coming soon

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
