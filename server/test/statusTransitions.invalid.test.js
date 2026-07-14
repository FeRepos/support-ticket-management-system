import {
  getTicketFromDb,
  patchTicketStatus,
  setupTicketAtStatus,
} from './helpers.js'

const INVALID_TRANSITION_CASES = [
  { fromStatus: 'Resolved', toStatus: 'In Progress' },
  { fromStatus: 'Closed', toStatus: 'Open' },
  { fromStatus: 'Cancelled', toStatus: 'Open' },
  { fromStatus: 'Open', toStatus: 'Open' },
]

describe('PATCH /api/tickets/:id/status invalid transitions', () => {
  it.each(INVALID_TRANSITION_CASES)(
    'rejects $fromStatus -> $toStatus with 400 and leaves DB status unchanged',
    async ({ fromStatus, toStatus }) => {
      const { ticketId } = await setupTicketAtStatus(fromStatus)

      const response = await patchTicketStatus(ticketId, toStatus)

      expect(response.status).toBe(400)
      expect(response.body.error).toBeDefined()
      expect(response.body.error.message).toEqual(expect.any(String))
      expect(response.body.error.field).toBe('status')

      const persistedTicket = await getTicketFromDb(ticketId)
      expect(persistedTicket.status).toBe(fromStatus)
    },
  )
})
