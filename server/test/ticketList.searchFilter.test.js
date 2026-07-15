import request from 'supertest'
import app from '../app.js'
import {
  createTestUser,
  createTicketViaApi,
  patchTicketStatus,
} from './helpers.js'

async function seedSearchTickets(user) {
  const openLogin = await createTicketViaApi(user._id, {
    title: 'Login page broken',
    description: 'Users cannot sign in',
    priority: 'high',
  })
  const billing = await createTicketViaApi(user._id, {
    title: 'Billing issue',
    description: 'Invoice PDF missing',
    priority: 'low',
  })

  const closedId = openLogin.body.id
  await patchTicketStatus(closedId, 'In Progress')
  await patchTicketStatus(closedId, 'Resolved')
  await patchTicketStatus(closedId, 'Closed')

  return {
    openLoginId: openLogin.body.id,
    billingId: billing.body.id,
    closedId,
  }
}

describe('GET /api/tickets search and filter', () => {
  it('returns all tickets when no query params are provided', async () => {
    const user = await createTestUser()
    await seedSearchTickets(user)

    const response = await request(app).get('/api/tickets')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(2)
  })

  it('filters by status', async () => {
    const user = await createTestUser()
    await seedSearchTickets(user)

    const response = await request(app).get('/api/tickets').query({ status: 'Closed' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(1)
    expect(response.body[0].status).toBe('Closed')
    expect(response.body[0].title).toBe('Login page broken')
  })

  it('returns an empty array when status has no matches', async () => {
    const user = await createTestUser()
    await createTicketViaApi(user._id, { title: 'Only open ticket' })

    const response = await request(app).get('/api/tickets').query({ status: 'Closed' })

    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
  })

  it('searches title case-insensitively', async () => {
    const user = await createTestUser()
    await seedSearchTickets(user)

    const response = await request(app).get('/api/tickets').query({ q: 'LOGIN' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(1)
    expect(response.body[0].title).toBe('Login page broken')
  })

  it('searches description when title does not match', async () => {
    const user = await createTestUser()
    await seedSearchTickets(user)

    const response = await request(app).get('/api/tickets').query({ q: 'invoice' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(1)
    expect(response.body[0].title).toBe('Billing issue')
  })

  it('combines keyword search and status filter', async () => {
    const user = await createTestUser()
    await createTicketViaApi(user._id, {
      title: 'Login page broken',
      description: 'Open login issue',
    })
    const closedLogin = await createTicketViaApi(user._id, {
      title: 'Login redirect bug',
      description: 'Closed login issue',
    })
    await patchTicketStatus(closedLogin.body.id, 'In Progress')
    await patchTicketStatus(closedLogin.body.id, 'Resolved')
    await patchTicketStatus(closedLogin.body.id, 'Closed')

    const response = await request(app)
      .get('/api/tickets')
      .query({ q: 'login', status: 'Open' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(1)
    expect(response.body[0].status).toBe('Open')
    expect(response.body[0].title).toBe('Login page broken')
  })

  it('returns empty when keyword matches nothing', async () => {
    const user = await createTestUser()
    await seedSearchTickets(user)

    const response = await request(app).get('/api/tickets').query({ q: 'nonexistent-keyword' })

    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
  })

  it('does not treat regex metacharacters in q as wildcards', async () => {
    const user = await createTestUser()
    await createTicketViaApi(user._id, {
      title: 'Login page broken',
      description: 'Users cannot sign in',
    })
    await createTicketViaApi(user._id, {
      title: 'Billing issue',
      description: 'Invoice PDF missing',
    })

    const response = await request(app).get('/api/tickets').query({ q: '.*' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(0)
  })

  it('matches titles containing literal regex characters when q includes them', async () => {
    const user = await createTestUser()
    await createTicketViaApi(user._id, {
      title: 'Fix .* regex pattern',
      description: 'Special characters in title',
    })

    const response = await request(app).get('/api/tickets').query({ q: '.* regex' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(1)
    expect(response.body[0].title).toBe('Fix .* regex pattern')
  })

  it('ignores empty or whitespace-only q param', async () => {
    const user = await createTestUser()
    await seedSearchTickets(user)

    const emptyQuery = await request(app).get('/api/tickets').query({ q: '' })
    const whitespaceQuery = await request(app).get('/api/tickets').query({ q: '   ' })

    expect(emptyQuery.status).toBe(200)
    expect(emptyQuery.body).toHaveLength(2)
    expect(whitespaceQuery.status).toBe(200)
    expect(whitespaceQuery.body).toHaveLength(2)
  })
})
