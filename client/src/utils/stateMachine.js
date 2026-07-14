/**
 * Duplicates server/utils/stateMachine.js for UI-only transition button rendering.
 * The backend remains authoritative — if these rules drift, invalid transitions
 * are still rejected by PATCH /api/tickets/:id/status with 400.
 *
 * Known tradeoff: two copies of the state machine (see prompt-history.md T5.5).
 */
export const VALID_TRANSITIONS = {
  Open: ['In Progress', 'Cancelled'],
  'In Progress': ['Resolved', 'Cancelled'],
  Resolved: ['Closed'],
  Closed: [],
  Cancelled: [],
}

export function getAllowedTransitions(fromStatus) {
  return VALID_TRANSITIONS[fromStatus] ?? []
}
