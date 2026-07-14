# Project Context — Support Ticket Management System

This document is the persistent context I (re-)supply to Claude at the start of any
significant work session, so it doesn't have to re-derive the domain model or constraints
from scratch each time.

## What this project is
An internal support ticket system. Internal users create tickets, assign and update them,
comment on them, search/filter them, and move them through a fixed lifecycle state machine.

## Tech stack
- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MongoDB (via Mongoose)
- Testing: Jest + Supertest for backend integration tests

## Core entities
- **User** — seeded only, no user-management UI. `id, name, email, role`
- **Ticket** — `id, title, description, priority, status, assignedTo, createdBy, createdAt, updatedAt`
- **Comment** — `id, ticketId, message, createdBy, createdAt`

## The non-negotiable rule: ticket status state machine
```
Open        -> In Progress
In Progress -> Resolved
Resolved    -> Closed
Open        -> Cancelled
In Progress -> Cancelled
```
Any transition not in this list must be rejected **by the backend**, with a clear error
surfaced in the UI. This is the piece of the system AI is most likely to get subtly wrong
(e.g. allowing `Resolved -> In Progress` because it "seems reasonable"), so it gets explicit
call-outs in every prompt where status logic is touched, and it has dedicated integration
tests as the acceptance bar.

## Constraints / non-goals for Core
- No auth in Core (optional Stretch only)
- No user CRUD UI (users are seed data)
- Search = keyword; Filter = status only (priority/assignee filter, sort, pagination are Stretch)
- One test tier mandatory: integration tests covering the state machine

## Standing instructions for the AI tool
1. Never relax or "simplify" the state machine transitions above — treat them as fixed spec, not a suggestion.
2. All input validation happens server-side; client-side validation is a UX nicety on top, not a substitute.
3. Don't invent endpoints or fields not listed in `spec.md` without flagging it first.
4. When generating code, prefer explicit, readable logic over cleverness — this codebase needs to be explainable by me, not just runnable.
5. Secrets (DB connection strings, etc.) go in `.env`, never committed; `.env.example` documents the shape.

## What I deliberately avoid sharing with the AI tool
No real user data, no company-specific ticket content, no internal URLs or credentials —
everything in this project is synthetic/seeded data invented for the exercise.
