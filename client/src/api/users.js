import { apiFetch } from './client.js'

export function fetchUsers() {
  return apiFetch('/api/users')
}
