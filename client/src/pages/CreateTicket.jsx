import { useEffect, useId, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError, formatErrorMessage } from '../api/errors.js'
import { createTicket } from '../api/tickets.js'
import { fetchUsers } from '../api/users.js'
import PriorityPicker from '../components/PriorityPicker.jsx'
import './CreateTicket.css'

const EMPTY_FORM = {
  title: '',
  description: '',
  priority: '',
  createdBy: '',
}

function validateClient(values) {
  const errors = {}

  if (!values.title.trim()) {
    errors.title = 'Title is required'
  }

  if (!values.description.trim()) {
    errors.description = 'Description is required'
  }

  if (!values.priority) {
    errors.priority = 'Priority is required'
  }

  if (!values.createdBy) {
    errors.createdBy = 'Created by is required'
  }

  return errors
}

function CreateTicket() {
  const navigate = useNavigate()
  const formId = useId()
  const [form, setForm] = useState(EMPTY_FORM)
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const titleErrorId = `${formId}-title-error`
  const descriptionErrorId = `${formId}-description-error`
  const priorityErrorId = `${formId}-priority-error`
  const createdByErrorId = `${formId}-createdby-error`

  useEffect(() => {
    let cancelled = false

    async function loadUsers() {
      setUsersLoading(true)
      setUsersError(null)

      try {
        const userData = await fetchUsers()
        if (!cancelled) {
          setUsers(userData)
        }
      } catch (err) {
        if (!cancelled) {
          setUsersError(err.message ?? 'Failed to load users')
        }
      } finally {
        if (!cancelled) {
          setUsersLoading(false)
        }
      }
    }

    loadUsers()

    return () => {
      cancelled = true
    }
  }, [])

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => {
      if (!current[field]) {
        return current
      }
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const clientErrors = validateClient(form)
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors)
      return
    }

    setSubmitting(true)
    setFieldErrors({})

    try {
      const ticket = await createTicket({
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        createdBy: form.createdBy,
      })

      navigate(`/tickets/${ticket.id}`)
    } catch (err) {
      if (err instanceof ApiError && err.field) {
        setFieldErrors({
          [err.field]: formatErrorMessage(err.message),
        })
      } else if (err instanceof ApiError) {
        setFieldErrors({
          _form: formatErrorMessage(err.message),
        })
      } else {
        setFieldErrors({
          _form: 'Could not create ticket. Please try again.',
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="create-ticket-page">
      <header className="create-ticket-page__header">
        <div>
          <p className="create-ticket-page__back">
            <Link to="/">← Back to tickets</Link>
          </p>
          <h1 className="create-ticket-page__title">New ticket</h1>
        </div>
      </header>

      {usersError && (
        <div className="create-ticket-page__banner" role="alert">
          {usersError}
        </div>
      )}

      {fieldErrors._form && (
        <div className="create-ticket-page__banner" role="alert">
          {fieldErrors._form}
        </div>
      )}

      <form className="create-ticket-form" onSubmit={handleSubmit} noValidate>
        <div className="create-ticket-form__field">
          <label className="create-ticket-form__label" htmlFor={`${formId}-title`}>
            Title
          </label>
          <input
            id={`${formId}-title`}
            type="text"
            className={`create-ticket-form__input${fieldErrors.title ? ' create-ticket-form__input--invalid' : ''}`}
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            aria-invalid={Boolean(fieldErrors.title)}
            aria-describedby={fieldErrors.title ? titleErrorId : undefined}
            maxLength={200}
            autoComplete="off"
          />
          {fieldErrors.title && (
            <p id={titleErrorId} className="create-ticket-form__error" role="alert">
              {fieldErrors.title}
            </p>
          )}
        </div>

        <div className="create-ticket-form__field">
          <label className="create-ticket-form__label" htmlFor={`${formId}-description`}>
            Description
          </label>
          <textarea
            id={`${formId}-description`}
            className={`create-ticket-form__textarea${fieldErrors.description ? ' create-ticket-form__input--invalid' : ''}`}
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            aria-invalid={Boolean(fieldErrors.description)}
            aria-describedby={fieldErrors.description ? descriptionErrorId : undefined}
            rows={6}
          />
          {fieldErrors.description && (
            <p id={descriptionErrorId} className="create-ticket-form__error" role="alert">
              {fieldErrors.description}
            </p>
          )}
        </div>

        <div className="create-ticket-form__field">
          <PriorityPicker
            name={`${formId}-priority`}
            value={form.priority}
            onChange={(value) => updateField('priority', value)}
            describedBy={fieldErrors.priority ? priorityErrorId : undefined}
            invalid={Boolean(fieldErrors.priority)}
          />
          {fieldErrors.priority && (
            <p id={priorityErrorId} className="create-ticket-form__error" role="alert">
              {fieldErrors.priority}
            </p>
          )}
        </div>

        <div className="create-ticket-form__field">
          <label className="create-ticket-form__label" htmlFor={`${formId}-createdBy`}>
            Created by
          </label>
          <select
            id={`${formId}-createdBy`}
            className={`create-ticket-form__select${fieldErrors.createdBy ? ' create-ticket-form__input--invalid' : ''}`}
            value={form.createdBy}
            onChange={(event) => updateField('createdBy', event.target.value)}
            aria-invalid={Boolean(fieldErrors.createdBy)}
            aria-describedby={fieldErrors.createdBy ? createdByErrorId : undefined}
            disabled={usersLoading || Boolean(usersError)}
          >
            <option value="">
              {usersLoading ? 'Loading users…' : 'Select a user'}
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {fieldErrors.createdBy && (
            <p id={createdByErrorId} className="create-ticket-form__error" role="alert">
              {fieldErrors.createdBy}
            </p>
          )}
        </div>

        <div className="create-ticket-form__actions">
          <button
            type="submit"
            className="create-ticket-form__submit"
            disabled={submitting || usersLoading || Boolean(usersError)}
          >
            {submitting ? 'Creating…' : 'Create ticket'}
          </button>
        </div>
      </form>
    </main>
  )
}

export default CreateTicket
