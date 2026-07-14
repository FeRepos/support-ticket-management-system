import { VALID_TRANSITIONS } from '../utils/stateMachine.js'
import {
  createTestUser,
  createTicketViaApi,
  getTicketFromDb,
  patchTicketStatus,
  setupTicketAtStatus,
} from './helpers.js'

const VALID_TRANSITION_CASES = Object.entries(VALID_TRANSITIONS).flatMap(
  ([fromStatus, targets]) => targets.map((toStatus) => ({ fromStatus, toStatus })),
)

describe('PATCH /api/tickets/:id/status valid transitions', () => {
  it.each(VALID_TRANSITION_CASES)(
    'allows $fromStatus -> $toStatus and persists the new status',
    async ({ fromStatus, toStatus }) => {
      const { ticketId } = await setupTicketAtStatus(fromStatus)

      const response = await patchTicketStatus(ticketId, toStatus)

      expect(response.status).toBe(200)
      expect(response.body.status).toBe(toStatus)

      const persistedTicket = await getTicketFromDb(ticketId)
      expect(persistedTicket.status).toBe(toStatus)
    },
  )

  it('walks a ticket through the full happy path via the API', async () => {
    const user = await createTestUser()
    const createResponse = await createTicketViaApi(user._id)

    expect(createResponse.status).toBe(201)
    expect(createResponse.body.status).toBe('Open')

    const ticketId = createResponse.body.id
    const happyPath = ['In Progress', 'Resolved', 'Closed']

    for (const status of happyPath) {
      const response = await patchTicketStatus(ticketId, status)

      expect(response.status).toBe(200)
      expect(response.body.status).toBe(status)

      const persistedTicket = await getTicketFromDb(ticketId)
      expect(persistedTicket.status).toBe(status)
    }
  })
})
