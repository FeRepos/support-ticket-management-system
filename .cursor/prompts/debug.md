# Debug

Use when diagnosing environment, proxy, or test failures.

## Prompt template

```
[Describe symptom — e.g. Vite proxy 404, Atlas SSL error, npm test failure]

Diagnose root cause. Do not change unrelated code.

When fixed:
1. Document steps in README troubleshooting if user-facing
2. Append summary to prompt-history/ops-debugging-sessions.md
3. Append entry to prompt-history.md
```

## Common issues in this project

| Symptom | Likely cause |
|---------|----------------|
| `ECONNREFUSED` on `/api/*` | Backend not running or `PORT` ≠ `VITE_API_PORT` |
| HTML `Cannot GET /api/tickets` | Wrong process on API port |
| Atlas TLS errors | Missing DB name in URI or IP not on allowlist |
| `react-router-dom` not found | `npm install` not run in `client/` |
| Jest ESM errors | Use `node --experimental-vm-modules` (see `server/package.json`) |

Verify API: `curl http://localhost:<PORT>/health` → `{"status":"ok"}`
