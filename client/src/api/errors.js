export class ApiError extends Error {
  constructor(message, { field = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.field = field
  }
}

export function formatErrorMessage(message) {
  if (!message) {
    return 'Something went wrong. Please try again.'
  }

  return message.charAt(0).toUpperCase() + message.slice(1)
}
