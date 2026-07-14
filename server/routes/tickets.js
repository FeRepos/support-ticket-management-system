import express from 'express'
import mongoose from 'mongoose'
import { badRequest, notFound } from '../errors/AppError.js'
import Comment from '../models/Comment.js'
import Ticket from '../models/Ticket.js'
import User from '../models/User.js'
import {
  validateCreateCommentBody,
  validateCreateTicketBody,
  validateUpdateTicketBody,
} from '../utils/ticketValidation.js'
import { isValidTransition, VALID_TRANSITIONS } from '../utils/stateMachine.js'

const TICKET_STATUSES = Object.keys(VALID_TRANSITIONS)

const router = express.Router()

function toTicketResponse(ticket) {
  return {
    id: ticket._id,
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority,
    status: ticket.status,
    assignedTo: ticket.assignedTo,
    createdBy: ticket.createdBy,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  }
}

function toCommentResponse(comment) {
  return {
    id: comment._id,
    ticketId: comment.ticketId,
    message: comment.message,
    createdBy: comment.createdBy,
    createdAt: comment.createdAt,
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function throwIfValidationError(validationError) {
  if (validationError) {
    throw badRequest(validationError.message, validationError.field)
  }
}

async function findTicketOrThrow(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw notFound('Ticket not found')
  }

  const ticket = await Ticket.findById(id)
  if (!ticket) {
    throw notFound('Ticket not found')
  }

  return ticket
}

router.get('/', async (req, res) => {
  const { q, status } = req.query
  const filter = {}

  if (typeof status === 'string' && status.trim()) {
    filter.status = status.trim()
  }

  if (typeof q === 'string' && q.trim()) {
    const keyword = escapeRegex(q.trim())
    const regex = new RegExp(keyword, 'i')
    filter.$or = [{ title: regex }, { description: regex }]
  }

  const tickets = await Ticket.find(filter).sort({ updatedAt: -1 })

  res.json(tickets.map(toTicketResponse))
})

router.get('/:id/comments', async (req, res) => {
  const { id } = req.params

  await findTicketOrThrow(id)

  const comments = await Comment.find({ ticketId: id }).sort({ createdAt: 1 })

  res.json(comments.map(toCommentResponse))
})

router.post('/:id/comments', async (req, res) => {
  const { id } = req.params

  await findTicketOrThrow(id)

  throwIfValidationError(validateCreateCommentBody(req.body))

  const { message, createdBy } = req.body

  const author = await User.findById(createdBy)
  if (!author) {
    throw badRequest('createdBy must reference an existing user', 'createdBy')
  }

  const comment = await Comment.create({
    ticketId: id,
    message: message.trim(),
    createdBy,
  })

  res.status(201).json(toCommentResponse(comment))
})

router.get('/:id', async (req, res) => {
  const { id } = req.params

  const ticket = await findTicketOrThrow(id)

  const comments = await Comment.find({ ticketId: id }).sort({ createdAt: 1 })

  res.json({
    ...toTicketResponse(ticket),
    comments: comments.map(toCommentResponse),
  })
})

router.patch('/:id/status', async (req, res) => {
  const { id } = req.params
  const { status: newStatus } = req.body

  if (newStatus === undefined || newStatus === null || newStatus === '') {
    throw badRequest('status is required', 'status')
  }

  if (!TICKET_STATUSES.includes(newStatus)) {
    throw badRequest(
      `status must be one of: ${TICKET_STATUSES.join(', ')}`,
      'status',
    )
  }

  const ticket = await findTicketOrThrow(id)

  if (!isValidTransition(ticket.status, newStatus)) {
    const allowedTargets = VALID_TRANSITIONS[ticket.status]
    const allowedText =
      allowedTargets.length > 0
        ? allowedTargets.join(', ')
        : 'none (terminal status)'

    throw badRequest(
      `Invalid status transition from "${ticket.status}" to "${newStatus}". Allowed transitions from "${ticket.status}": ${allowedText}`,
      'status',
    )
  }

  ticket.status = newStatus
  await ticket.save()

  res.json(toTicketResponse(ticket))
})

router.patch('/:id', async (req, res) => {
  const { id } = req.params

  throwIfValidationError(validateUpdateTicketBody(req.body))

  const ticket = await findTicketOrThrow(id)

  const { title, description, priority, assignedTo } = req.body

  if (title !== undefined) {
    ticket.title = title.trim()
  }
  if (description !== undefined) {
    ticket.description = description.trim()
  }
  if (priority !== undefined) {
    ticket.priority = priority
  }

  if (assignedTo !== undefined) {
    if (assignedTo === null || assignedTo === '') {
      ticket.assignedTo = null
    } else {
      const assignee = await User.findById(assignedTo)
      if (!assignee) {
        throw badRequest('assignedTo must reference an existing user', 'assignedTo')
      }
      ticket.assignedTo = assignedTo
    }
  }

  await ticket.save()

  res.json(toTicketResponse(ticket))
})

router.post('/', async (req, res) => {
  throwIfValidationError(validateCreateTicketBody(req.body))

  const { title, description, priority, createdBy, assignedTo } = req.body

  const creator = await User.findById(createdBy)
  if (!creator) {
    throw badRequest('createdBy must reference an existing user', 'createdBy')
  }

  const ticketData = {
    title: title.trim(),
    description: description.trim(),
    priority,
    createdBy,
  }

  if (assignedTo !== undefined && assignedTo !== null && assignedTo !== '') {
    const assignee = await User.findById(assignedTo)
    if (!assignee) {
      throw badRequest('assignedTo must reference an existing user', 'assignedTo')
    }
    ticketData.assignedTo = assignedTo
  }

  const ticket = await Ticket.create(ticketData)

  res.status(201).json(toTicketResponse(ticket))
})

export default router
