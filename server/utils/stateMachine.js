export const VALID_TRANSITIONS = {
  Open: ['In Progress', 'Cancelled'],
  'In Progress': ['Resolved', 'Cancelled'],
  Resolved: ['Closed'],
  Closed: [],
  Cancelled: [],
}

const ALL_STATUSES = Object.keys(VALID_TRANSITIONS)

export function isValidTransition(from, to) {
  if (!ALL_STATUSES.includes(from) || !ALL_STATUSES.includes(to)) {
    return false
  }

  if (from === to) {
    return false
  }

  return VALID_TRANSITIONS[from].includes(to)
}
