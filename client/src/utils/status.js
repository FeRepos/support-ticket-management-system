/** Maps ticket status values to design-token CSS variables. Single source for status color logic. */
export const STATUS_CSS_VAR = {
  Open: '--status-open',
  'In Progress': '--status-inprogress',
  Resolved: '--status-resolved',
  Closed: '--status-closed',
  Cancelled: '--status-cancelled',
}

export const TICKET_STATUSES = Object.keys(STATUS_CSS_VAR)
