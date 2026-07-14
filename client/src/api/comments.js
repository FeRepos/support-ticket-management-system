import { apiFetch } from './client.js'

export function createComment(ticketId, payload) {
  return apiFetch(`/api/tickets/${ticketId}/comments`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
