import mongoose from 'mongoose'
import {
  validateCreateCommentBody,
  validateCreateTicketBody,
  validateUpdateTicketBody,
} from './ticketValidation.js'

const validUserId = new mongoose.Types.ObjectId().toString()

function validCreateBody() {
  return {
    title: 'Valid title',
    description: 'Valid description',
    priority: 'medium',
    createdBy: validUserId,
  }
}

describe('validateCreateTicketBody', () => {
  it('rejects status on create', () => {
    const error = validateCreateTicketBody({ ...validCreateBody(), status: 'Open' })

    expect(error).toEqual({
      message: 'status cannot be set on create',
      field: 'status',
    })
  })

  it('rejects a title longer than 200 characters', () => {
    const error = validateCreateTicketBody({
      ...validCreateBody(),
      title: 'a'.repeat(201),
    })

    expect(error).toEqual({
      message: 'title must be between 1 and 200 characters',
      field: 'title',
    })
  })

  it('rejects a description longer than 5000 characters', () => {
    const error = validateCreateTicketBody({
      ...validCreateBody(),
      description: 'a'.repeat(5001),
    })

    expect(error).toEqual({
      message: 'description must be between 1 and 5000 characters',
      field: 'description',
    })
  })

  it('returns null for a valid body', () => {
    expect(validateCreateTicketBody(validCreateBody())).toBeNull()
  })
})

describe('validateUpdateTicketBody', () => {
  it('rejects status in the update body', () => {
    const error = validateUpdateTicketBody({ status: 'Closed' })

    expect(error).toEqual({
      message: 'status must be updated via PATCH /api/tickets/:id/status',
      field: 'status',
    })
  })

  it('rejects createdBy in the update body', () => {
    const error = validateUpdateTicketBody({ createdBy: validUserId })

    expect(error).toEqual({
      message: 'createdBy cannot be updated',
      field: 'createdBy',
    })
  })

  it('returns null for a valid partial update', () => {
    expect(validateUpdateTicketBody({ title: 'Updated title' })).toBeNull()
  })
})

describe('validateCreateCommentBody', () => {
  it('rejects an empty message', () => {
    const error = validateCreateCommentBody({
      message: '   ',
      createdBy: validUserId,
    })

    expect(error).toEqual({
      message: 'message is required',
      field: 'message',
    })
  })

  it('rejects a message longer than 2000 characters', () => {
    const error = validateCreateCommentBody({
      message: 'a'.repeat(2001),
      createdBy: validUserId,
    })

    expect(error).toEqual({
      message: 'message must be between 1 and 2000 characters',
      field: 'message',
    })
  })

  it('returns null for a valid comment body', () => {
    expect(
      validateCreateCommentBody({
        message: 'Valid comment',
        createdBy: validUserId,
      }),
    ).toBeNull()
  })
})
