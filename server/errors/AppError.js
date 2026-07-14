export class AppError extends Error {
  constructor(statusCode, message, field) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    if (field !== undefined) {
      this.field = field
    }
  }
}

export function badRequest(message, field) {
  return new AppError(400, message, field)
}

export function notFound(message = 'Not found') {
  return new AppError(404, message)
}
