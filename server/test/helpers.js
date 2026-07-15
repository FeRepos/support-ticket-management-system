import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import app from '../app.js'
import User from '../models/User.js'
import Ticket from '../models/Ticket.js'

let mongoServer

export async function startTestDatabase() {
  mongoServer = await MongoMemoryServer.create()
  process.env.MONGO_URI = mongoServer.getUri()
  await mongoose.connect(process.env.MONGO_URI)
}

export async function stopTestDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }

  if (mongoServer) {
    await mongoServer.stop()
    mongoServer = undefined
  }
}

export async function clearDatabase() {
  const { collections } = mongoose.connection

  for (const collection of Object.values(collections)) {
    await collection.deleteMany({})
  }
}

export async function createTestUser(overrides = {}) {
  return User.create({
    name: 'Test Agent',
    email: `agent-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`,
    role: 'agent',
    ...overrides,
  })
}

export async function createTicketViaApi(userId, overrides = {}) {
  return request(app)
    .post('/api/tickets')
    .send({
      title: 'Test ticket',
      description: 'Test description for integration tests',
      priority: 'medium',
      createdBy: userId.toString(),
      ...overrides,
    })
}

export async function patchTicketStatus(ticketId, status) {
  return request(app)
    .patch(`/api/tickets/${ticketId}/status`)
    .send({ status })
}

export async function patchTicket(ticketId, body) {
  return request(app).patch(`/api/tickets/${ticketId}`).send(body)
}

export async function createCommentViaApi(ticketId, userId, message = 'Test comment') {
  return request(app)
    .post(`/api/tickets/${ticketId}/comments`)
    .send({
      message,
      createdBy: userId.toString(),
    })
}

export async function getTicketFromDb(ticketId) {
  return Ticket.findById(ticketId)
}

export const PATHS_TO_STATUS = {
  Open: [],
  'In Progress': ['In Progress'],
  Resolved: ['In Progress', 'Resolved'],
  Closed: ['In Progress', 'Resolved', 'Closed'],
  Cancelled: ['Cancelled'],
}

export async function setupTicketAtStatus(fromStatus) {
  const user = await createTestUser()
  const createResponse = await createTicketViaApi(user._id)

  if (createResponse.status !== 201) {
    throw new Error(`Failed to create ticket: ${createResponse.status}`)
  }

  const ticketId = createResponse.body.id

  for (const status of PATHS_TO_STATUS[fromStatus]) {
    const response = await patchTicketStatus(ticketId, status)
    if (response.status !== 200) {
      throw new Error(`Failed to reach setup status ${status}: ${response.status}`)
    }
  }

  const ticket = await getTicketFromDb(ticketId)
  if (ticket.status !== fromStatus) {
    throw new Error(`Expected status ${fromStatus}, got ${ticket.status}`)
  }

  return { ticketId, user }
}
