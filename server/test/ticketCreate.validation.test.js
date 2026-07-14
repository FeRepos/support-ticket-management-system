import request from 'supertest'
import app from '../app.js'
import Ticket from '../models/Ticket.js'
import { createTestUser, getTicketFromDb } from './helpers.js'

function validTicketPayload(userId) {
  return {
    title: 'Valid ticket title',
    description: 'Valid ticket description for integration tests',
    priority: 'medium',
    createdBy: userId.toString(),
  }
}

describe('POST /api/tickets validation', () => {
  it('rejects a missing title with 400', async () => {
    const user = await createTestUser()
    const { title, ...payload } = validTicketPayload(user._id)

    const response = await request(app).post('/api/tickets').send(payload)

    expect(response.status).toBe(400)
    expect(response.body.error).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        field: 'title',
      }),
    )
    expect(await Ticket.countDocuments()).toBe(0)
  })

  it('rejects a missing description with 400', async () => {
    const user = await createTestUser()
    const { description, ...payload } = validTicketPayload(user._id)

    const response = await request(app).post('/api/tickets').send(payload)

    expect(response.status).toBe(400)
    expect(response.body.error).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        field: 'description',
      }),
    )
    expect(await Ticket.countDocuments()).toBe(0)
  })

  it('rejects a missing createdBy with 400', async () => {
    const user = await createTestUser()
    const { createdBy, ...payload } = validTicketPayload(user._id)

    const response = await request(app).post('/api/tickets').send(payload)

    expect(response.status).toBe(400)
    expect(response.body.error).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        field: 'createdBy',
      }),
    )
    expect(await Ticket.countDocuments()).toBe(0)
  })

  it('rejects an invalid priority with 400', async () => {
    const user = await createTestUser()
    const payload = {
      ...validTicketPayload(user._id),
      priority: 'critical',
    }

    const response = await request(app).post('/api/tickets').send(payload)

    expect(response.status).toBe(400)
    expect(response.body.error).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        field: 'priority',
      }),
    )
    expect(await Ticket.countDocuments()).toBe(0)
  })

  it('creates a valid ticket with 201 and persists it', async () => {
    const user = await createTestUser()
    const payload = validTicketPayload(user._id)

    const response = await request(app).post('/api/tickets').send(payload)

    expect(response.status).toBe(201)
    expect(response.body).toEqual(
      expect.objectContaining({
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        status: 'Open',
        createdBy: user._id.toString(),
      }),
    )

    const persistedTicket = await getTicketFromDb(response.body.id)
    expect(persistedTicket).not.toBeNull()
    expect(persistedTicket.title).toBe(payload.title)
    expect(persistedTicket.description).toBe(payload.description)
    expect(persistedTicket.priority).toBe(payload.priority)
    expect(persistedTicket.status).toBe('Open')
    expect(persistedTicket.createdBy.toString()).toBe(user._id.toString())
  })
})
