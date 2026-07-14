import { AppError } from '../errors/AppError.js'

function toErrorBody(err) {
  const error = { message: err.message }
  if (err.field) {
    error.field = err.field
  }
  return error
}

export function notFoundHandler(_req, _res, next) {
  next(new AppError(404, 'Not found'))
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: toErrorBody(err) })
  }

  if (err.name === 'CastError') {
    return res.status(404).json({ error: { message: 'Not found' } })
  }

  if (err.name === 'ValidationError') {
    const firstError = Object.values(err.errors)[0]
    const field = firstError?.path
    const error = {
      message: firstError?.message || 'Validation failed',
    }
    if (field) {
      error.field = field
    }
    return res.status(400).json({ error })
  }

  console.error(err)
  res.status(500).json({ error: { message: 'Internal server error' } })
}
