import { ApiError } from './errors.js'

export async function apiFetch(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    let field = null

    try {
      const body = await response.json()
      if (body?.error?.message) {
        message = body.error.message
      }
      if (body?.error?.field) {
        field = body.error.field
      }
    } catch {
      // ignore non-JSON error bodies
    }

    throw new ApiError(message, { field })
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}
