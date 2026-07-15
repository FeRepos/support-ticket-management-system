import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app.js'
import Comment from '../models/Comment.js'
import {
  createCommentViaApi,
  createTestUser,
  setupTicketAtStatus,
} from './helpers.js'

describe('ticket comments API', () => {
  it('POST creates a comment and returns 201', async () => {
    const { ticketId, user } = await setupTicketAtStatus('Open')

    const response = await createCommentViaApi(ticketId, user._id, 'First comment')

    expect(response.status).toBe(201)
    expect(response.body).toEqual(
      expect.objectContaining({
        ticketId,
        message: 'First comment',
        createdBy: user._id.toString(),
      }),
    )

    const persisted = await Comment.findById(response.body.id)
    expect(persisted).not.toBeNull()
    expect(persisted.message).toBe('First comment')
  })

  it('GET /api/tickets/:id/comments returns comments sorted by createdAt ascending', async () => {
    const { ticketId, user } = await setupTicketAtStatus('Open')

    await createCommentViaApi(ticketId, user._id, 'Older comment')
    await new Promise((resolve) => setTimeout(resolve, 5))
    await createCommentViaApi(ticketId, user._id, 'Newer comment')

    const response = await request(app).get(`/api/tickets/${ticketId}/comments`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(2)
    expect(response.body[0].message).toBe('Older comment')
    expect(response.body[1].message).toBe('Newer comment')
  })

  it('GET /api/tickets/:id includes comments in the detail response', async () => {
    const { ticketId, user } = await setupTicketAtStatus('Open')
    await createCommentViaApi(ticketId, user._id, 'Detail comment')

    const response = await request(app).get(`/api/tickets/${ticketId}`)

    expect(response.status).toBe(200)
    expect(response.body.comments).toHaveLength(1)
    expect(response.body.comments[0].message).toBe('Detail comment')
  })

  it('rejects an empty message with 400', async () => {
    const { ticketId, user } = await setupTicketAtStatus('Open')

    const response = await createCommentViaApi(ticketId, user._id, '   ')

    expect(response.status).toBe(400)
    expect(response.body.error).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        field: 'message',
      }),
    )
    expect(await Comment.countDocuments()).toBe(0)
  })

  it('rejects a missing createdBy with 400', async () => {
    const { ticketId } = await setupTicketAtStatus('Open')

    const response = await request(app)
      .post(`/api/tickets/${ticketId}/comments`)
      .send({ message: 'No author' })

    expect(response.status).toBe(400)
    expect(response.body.error).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        field: 'createdBy',
      }),
    )
  })

  it('returns 404 for an invalid ticket id', async () => {
    const user = await createTestUser()
    const fakeId = new mongoose.Types.ObjectId().toString()

    const response = await createCommentViaApi(fakeId, user._id)

    expect(response.status).toBe(404)
    expect(response.body.error.message).toBe('Ticket not found')
  })

  it('allows comments on a Closed ticket', async () => {
    const { ticketId, user } = await setupTicketAtStatus('Closed')

    const response = await createCommentViaApi(ticketId, user._id, 'Comment on closed ticket')

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('Comment on closed ticket')
  })

  it('rejects createdBy referencing a non-existent user with 400', async () => {
    const { ticketId } = await setupTicketAtStatus('Open')
    const fakeUserId = new mongoose.Types.ObjectId().toString()

    const response = await createCommentViaApi(ticketId, fakeUserId)

    expect(response.status).toBe(400)
    expect(response.body.error).toEqual(
      expect.objectContaining({
        message: 'createdBy must reference an existing user',
        field: 'createdBy',
      }),
    )
  })
})
