# Acceptance Criteria — Core

Sourced directly from the brief, kept as the traceability target for tasks/tests.

1. A user can create a ticket via the UI.
2. A user can view all tickets from the database.
3. A user can open a ticket detail view.
4. A user can update ticket fields and reassign.
5. A user can add comments.
6. Status changes only through valid transitions; invalid ones are rejected (backend-enforced).
7. Keyword search and status filter work.
8. Data remains available after restart (MongoDB persistence, not in-memory).
9. Backend validation prevents invalid records.
10. No secrets committed to the repo (`.env` gitignored, `.env.example` provided).
11. State-machine integration tests pass.

## Additional criteria from requirement analysis (spec.md §1.2)
12. Comments can be added regardless of ticket status.
13. Ticket fields (title/description/priority/assignee) remain editable after Closed/Cancelled — status alone is locked down by the state machine.
14. Search is case-insensitive substring match on title + description.

## Traceability
Each criterion above will map to: a spec section (done, see spec.md), a task in `tasks.md`,
an implementation commit, and — where applicable — a test. That mapping gets filled in as
each piece lands, not written in advance, so it reflects what was actually built.
