import { afterAll, afterEach, beforeAll } from '@jest/globals'
import { clearDatabase, startTestDatabase, stopTestDatabase } from './helpers.js'

beforeAll(async () => {
  await startTestDatabase()
})

afterEach(async () => {
  await clearDatabase()
})

afterAll(async () => {
  await stopTestDatabase()
})
