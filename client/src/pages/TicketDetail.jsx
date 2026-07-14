import { useEffect, useId, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError, formatErrorMessage } from '../api/errors.js'
import { fetchTicket, updateTicket } from '../api/tickets.js'
import { fetchUsers } from '../api/users.js'
import PriorityDot from '../components/PriorityDot.jsx'
import PriorityPicker from '../components/PriorityPicker.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { formatTimestamp } from '../utils/date.js'
import { PRIORITY_LABELS } from '../utils/priority.js'
import './CreateTicket.css'
import './TicketDetail.css'

function ticketToForm(ticket) {
  return {
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority,
    assignedTo: ticket.assignedTo ? String(ticket.assignedTo) : '',
  }
}

function validateEditForm(values) {
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

  return errors
}

function TicketDetail() {
  const { id } = useParams()
  const formId = useId()
  const [ticket, setTicket] = useState(null)
  const [users, setUsers] = useState([])
  const [usersById, setUsersById] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const titleErrorId = `${formId}-title-error`
  const descriptionErrorId = `${formId}-description-error`
  const priorityErrorId = `${formId}-priority-error`
  const assignedToErrorId = `${formId}-assignedto-error`

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      setEditing(false)
      setFieldErrors({})

      try {
        const [ticketData, userData] = await Promise.all([
          fetchTicket(id),
          fetchUsers(),
        ])

        if (cancelled) {
          return
        }

        const userMap = Object.fromEntries(
          userData.map((user) => [String(user.id), user.name]),
        )

        setTicket(ticketData)
        setUsers(userData)
        setUsersById(userMap)
        setForm(ticketToForm(ticketData))
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? formatErrorMessage(err.message)
              : 'Failed to load ticket',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [id])

  function resolveUserName(userId) {
    if (!userId) {
      return 'Unassigned'
    }
    return usersById[String(userId)] ?? 'Unknown user'
  }

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

  function startEditing() {
    setForm(ticketToForm(ticket))
    setFieldErrors({})
    setEditing(true)
  }

  function cancelEditing() {
    setForm(ticketToForm(ticket))
    setFieldErrors({})
    setEditing(false)
  }

  async function handleSave(event) {
    event.preventDefault()

    const clientErrors = validateEditForm(form)
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors)
      return
    }

    setSaving(true)
    setFieldErrors({})

    try {
      const updated = await updateTicket(id, {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        assignedTo: form.assignedTo || null,
      })

      setTicket((current) => ({ ...current, ...updated }))
      setForm(ticketToForm(updated))
      setEditing(false)
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
          _form: 'Could not save changes. Please try again.',
        })
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="ticket-detail-page">
        <p className="ticket-detail-page__status-text">Loading ticket…</p>
      </main>
    )
  }

  if (error || !ticket || !form) {
    return (
      <main className="ticket-detail-page">
        <p className="ticket-detail-page__back">
          <Link to="/">← Back to tickets</Link>
        </p>
        <div className="ticket-detail-page__banner" role="alert">
          {error ?? 'Ticket not found'}
        </div>
      </main>
    )
  }

  return (
    <main className="ticket-detail-page">
      <p className="ticket-detail-page__back">
        <Link to="/">← Back to tickets</Link>
      </p>

      {fieldErrors._form && (
        <div className="ticket-detail-page__banner" role="alert">
          {fieldErrors._form}
        </div>
      )}

      <header className="ticket-detail-page__header">
        <div className="ticket-detail-page__title-block">
          <StatusBadge status={ticket.status} className="ticket-detail-page__status" />
          {!editing ? (
            <h1 className="ticket-detail-page__title">{ticket.title}</h1>
          ) : (
            <div className="ticket-detail-page__title-edit create-ticket-form__field">
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
          )}
        </div>

        <p className="ticket-detail-page__id text-mono">
          <span className="ticket-detail-page__meta-label">Ticket ID</span>
          {ticket.id}
        </p>

        <div className="ticket-detail-page__header-actions">
          {!editing ? (
            <button
              type="button"
              className="ticket-detail-page__edit-btn"
              onClick={startEditing}
            >
              Edit
            </button>
          ) : (
            <div className="ticket-detail-page__edit-actions">
              <button
                type="button"
                className="ticket-detail-page__cancel-btn"
                onClick={cancelEditing}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                form={`${formId}-edit-form`}
                className="ticket-detail-page__save-btn"
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          )}
        </div>
      </header>

      {!editing ? (
        <>
          <section className="ticket-detail-page__meta" aria-label="Ticket details">
            <dl className="ticket-detail-page__meta-grid">
              <div className="ticket-detail-page__meta-item">
                <dt>Priority</dt>
                <dd className="ticket-detail-page__priority">
                  <PriorityDot priority={ticket.priority} />
                  <span>{PRIORITY_LABELS[ticket.priority] ?? ticket.priority}</span>
                </dd>
              </div>
              <div className="ticket-detail-page__meta-item">
                <dt>Assigned to</dt>
                <dd>{resolveUserName(ticket.assignedTo)}</dd>
              </div>
              <div className="ticket-detail-page__meta-item">
                <dt>Created by</dt>
                <dd>{resolveUserName(ticket.createdBy)}</dd>
              </div>
              <div className="ticket-detail-page__meta-item">
                <dt>Created</dt>
                <dd className="text-mono">{formatTimestamp(ticket.createdAt)}</dd>
              </div>
              <div className="ticket-detail-page__meta-item">
                <dt>Updated</dt>
                <dd className="text-mono">{formatTimestamp(ticket.updatedAt)}</dd>
              </div>
            </dl>
          </section>

          <section className="ticket-detail-page__section">
            <h2 className="ticket-detail-page__section-title">Description</h2>
            <p className="ticket-detail-page__description">{ticket.description}</p>
          </section>
        </>
      ) : (
        <form
          id={`${formId}-edit-form`}
          className="ticket-detail-page__edit-form create-ticket-form"
          onSubmit={handleSave}
          noValidate
        >
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
              rows={8}
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
            <label className="create-ticket-form__label" htmlFor={`${formId}-assignedTo`}>
              Assigned to
            </label>
            <select
              id={`${formId}-assignedTo`}
              className={`create-ticket-form__select${fieldErrors.assignedTo ? ' create-ticket-form__input--invalid' : ''}`}
              value={form.assignedTo}
              onChange={(event) => updateField('assignedTo', event.target.value)}
              aria-invalid={Boolean(fieldErrors.assignedTo)}
              aria-describedby={fieldErrors.assignedTo ? assignedToErrorId : undefined}
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            {fieldErrors.assignedTo && (
              <p id={assignedToErrorId} className="create-ticket-form__error" role="alert">
                {fieldErrors.assignedTo}
              </p>
            )}
          </div>
        </form>
      )}
    </main>
  )
}

export default TicketDetail
