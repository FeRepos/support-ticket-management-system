# Self-Review Checklist

Use before submission or after a major phase.

## State machine

- [ ] `isValidTransition` is the only backend authority (no inline transition rules in routes)
- [ ] `PATCH /api/tickets/:id` rejects `status` in body
- [ ] Invalid transitions return `400` with `field: status`
- [ ] Integration tests cover valid transitions and tempting invalid ones
- [ ] DB status unchanged after rejected transition

## API & validation

- [ ] Error shape: `{ error: { message, field? } }`
- [ ] Create validation rejects missing fields and invalid priority
- [ ] Comments allowed on Closed/Cancelled tickets
- [ ] Search is case-insensitive; regex special chars escaped in `?q=`

## Frontend

- [ ] Status buttons only show valid transitions from current status
- [ ] Inline field errors (not generic toasts) on create/edit/comment forms
- [ ] `VITE_API_PORT` matches server `PORT`

## Hygiene

- [ ] No `.env` or credentials in git
- [ ] `npm test` passes in `server/`
- [ ] README setup steps verified on clean machine
