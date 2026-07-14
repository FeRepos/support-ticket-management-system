import { apiFetch } from './client.js'

export function fetchTickets(params = {}) {
  const searchParams = new URLSearchParams()

  if (params.q) {
    searchParams.set('q', params.q)
  }
  if (params.status) {
    searchParams.set('status', params.status)
  }

  const query = searchParams.toString()
  const path = query ? `/api/tickets?${query}` : '/api/tickets'

  return apiFetch(path)
}

export function createTicket(payload) {
  return apiFetch('/api/tickets', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function fetchTicket(id) {
  return apiFetch(`/api/tickets/${id}`)
}

export function updateTicket(id, payload) {
  return apiFetch(`/api/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}
