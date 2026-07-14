import request from 'supertest'
import app from '../app.js'
import mongoose from 'mongoose'

describe('test infrastructure', () => {
  it('serves the app over an in-memory MongoDB connection', async () => {
    expect(mongoose.connection.readyState).toBe(1)

    const response = await request(app).get('/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: 'ok' })
  })
})
