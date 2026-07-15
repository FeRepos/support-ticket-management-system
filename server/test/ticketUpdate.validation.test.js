import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app.js'
import {
  createTestUser,
  createTicketViaApi,
  getTicketFromDb,
  patchTicket,
  setupTicketAtStatus,
} from './helpers.js'

describe('PATCH /api/tickets/:id', () => {
  it('updates title and persists the change', async () => {
    const { ticketId } = await setupTicketAtStatus('Open')

    const response = await patchTicket(ticketId, { title: 'Updated title' })

    expect(response.status).toBe(200)
    expect(response.body.title).toBe('Updated title')

    const persisted = await getTicketFromDb(ticketId)
    expect(persisted.title).toBe('Updated title')
  })

  it('reassigns assignedTo to a valid user', async () => {
    const { ticketId, user } = await setupTicketAtStatus('Open')
    const assignee = await createTestUser({ name: 'Assignee Agent' })

    const response = await patchTicket(ticketId, { assignedTo: assignee._id.toString() })

    expect(response.status).toBe(200)
    expect(response.body.assignedTo).toBe(assignee._id.toString())

    const persisted = await getTicketFromDb(ticketId)
    expect(persisted.assignedTo.toString()).toBe(assignee._id.toString())
  })

  it('clears assignedTo when null is sent', async () => {
    const assignee = await createTestUser({ name: 'Temporary Assignee' })
    const creator = await createTestUser({ name: 'Creator Agent' })
    const createResponse = await createTicketViaApi(creator._id, {
      assignedTo: assignee._id.toString(),
    })
    const ticketId = createResponse.body.id

    const response = await patchTicket(ticketId, { assignedTo: null })

    expect(response.status).toBe(200)
    expect(response.body.assignedTo).toBeNull()

    const persisted = await getTicketFromDb(ticketId)
    expect(persisted.assignedTo).toBeNull()
  })

  it('rejects status in the body with 400', async () => {
    const { ticketId } = await setupTicketAtStatus('Open')

    const response = await patchTicket(ticketId, { status: 'Closed' })

    expect(response.status).toBe(400)
    expect(response.body.error).toEqual(
      expect.objectContaining({
        message: 'status must be updated via PATCH /api/tickets/:id/status',
        field: 'status',
      }),
    )

    const persisted = await getTicketFromDb(ticketId)
    expect(persisted.status).toBe('Open')
  })

  it('rejects createdBy in the body with 400', async () => {
    const { ticketId, user } = await setupTicketAtStatus('Open')

    const response = await patchTicket(ticketId, { createdBy: user._id.toString() })

    expect(response.status).toBe(400)
    expect(response.body.error).toEqual(
      expect.objectContaining({
        message: 'createdBy cannot be updated',
        field: 'createdBy',
      }),
    )
  })

  it('rejects an empty update body with 400', async () => {
    const { ticketId } = await setupTicketAtStatus('Open')

    const response = await patchTicket(ticketId, {})

    expect(response.status).toBe(400)
    expect(response.body.error.message).toBe(
      'at least one of title, description, priority, or assignedTo is required',
    )
  })

  it('updates title on a Closed ticket', async () => {
    const { ticketId } = await setupTicketAtStatus('Closed')

    const response = await patchTicket(ticketId, { title: 'Closed but editable title' })

    expect(response.status).toBe(200)
    expect(response.body.title).toBe('Closed but editable title')
    expect(response.body.status).toBe('Closed')

    const persisted = await getTicketFromDb(ticketId)
    expect(persisted.title).toBe('Closed but editable title')
    expect(persisted.status).toBe('Closed')
  })

  it('returns 404 for an invalid ticket id', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString()

    const response = await patchTicket(fakeId, { title: 'Should not apply' })

    expect(response.status).toBe(404)
    expect(response.body.error.message).toBe('Ticket not found')
  })
})
