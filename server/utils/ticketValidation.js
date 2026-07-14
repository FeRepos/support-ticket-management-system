import mongoose from 'mongoose'

export const PRIORITIES = ['low', 'medium', 'high', 'urgent']

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

export function validateCreateTicketBody(body) {
  if (body.status !== undefined) {
    return { message: 'status cannot be set on create', field: 'status' }
  }

  if (!isNonEmptyString(body.title)) {
    return { message: 'title is required', field: 'title' }
  }
  if (body.title.length > 200) {
    return { message: 'title must be between 1 and 200 characters', field: 'title' }
  }

  if (!isNonEmptyString(body.description)) {
    return { message: 'description is required', field: 'description' }
  }
  if (body.description.length > 5000) {
    return {
      message: 'description must be between 1 and 5000 characters',
      field: 'description',
    }
  }

  if (body.priority === undefined || body.priority === null || body.priority === '') {
    return { message: 'priority is required', field: 'priority' }
  }
  if (!PRIORITIES.includes(body.priority)) {
    return {
      message: 'priority must be one of: low, medium, high, urgent',
      field: 'priority',
    }
  }

  if (!body.createdBy) {
    return { message: 'createdBy is required', field: 'createdBy' }
  }
  if (!mongoose.Types.ObjectId.isValid(body.createdBy)) {
    return { message: 'createdBy must be a valid user id', field: 'createdBy' }
  }

  if (body.assignedTo !== undefined && body.assignedTo !== null && body.assignedTo !== '') {
    if (!mongoose.Types.ObjectId.isValid(body.assignedTo)) {
      return { message: 'assignedTo must be a valid user id', field: 'assignedTo' }
    }
  }

  return null
}

export function validateUpdateTicketBody(body) {
  if (body.status !== undefined) {
    return {
      message: 'status must be updated via PATCH /api/tickets/:id/status',
      field: 'status',
    }
  }

  if (body.createdBy !== undefined) {
    return { message: 'createdBy cannot be updated', field: 'createdBy' }
  }

  const hasUpdatableField = ['title', 'description', 'priority', 'assignedTo'].some(
    (field) => body[field] !== undefined,
  )
  if (!hasUpdatableField) {
    return {
      message: 'at least one of title, description, priority, or assignedTo is required',
    }
  }

  if (body.title !== undefined) {
    if (!isNonEmptyString(body.title)) {
      return { message: 'title must be between 1 and 200 characters', field: 'title' }
    }
    if (body.title.length > 200) {
      return { message: 'title must be between 1 and 200 characters', field: 'title' }
    }
  }

  if (body.description !== undefined) {
    if (!isNonEmptyString(body.description)) {
      return {
        message: 'description must be between 1 and 5000 characters',
        field: 'description',
      }
    }
    if (body.description.length > 5000) {
      return {
        message: 'description must be between 1 and 5000 characters',
        field: 'description',
      }
    }
  }

  if (body.priority !== undefined) {
    if (body.priority === null || body.priority === '') {
      return {
        message: 'priority must be one of: low, medium, high, urgent',
        field: 'priority',
      }
    }
    if (!PRIORITIES.includes(body.priority)) {
      return {
        message: 'priority must be one of: low, medium, high, urgent',
        field: 'priority',
      }
    }
  }

  if (body.assignedTo !== undefined && body.assignedTo !== null && body.assignedTo !== '') {
    if (!mongoose.Types.ObjectId.isValid(body.assignedTo)) {
      return { message: 'assignedTo must be a valid user id', field: 'assignedTo' }
    }
  }

  return null
}

export function validateCreateCommentBody(body) {
  if (!isNonEmptyString(body.message)) {
    return { message: 'message is required', field: 'message' }
  }
  if (body.message.trim().length > 2000) {
    return { message: 'message must be between 1 and 2000 characters', field: 'message' }
  }

  if (!body.createdBy) {
    return { message: 'createdBy is required', field: 'createdBy' }
  }
  if (!mongoose.Types.ObjectId.isValid(body.createdBy)) {
    return { message: 'createdBy must be a valid user id', field: 'createdBy' }
  }

  return null
}
