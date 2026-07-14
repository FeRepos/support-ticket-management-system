import { useId, useState } from 'react'
import { formatTimestamp } from '../utils/date.js'
import './CommentsSection.css'

function validateCommentForm(values) {
  const errors = {}

  if (!values.message.trim()) {
    errors.message = 'Message is required'
  }

  if (!values.createdBy) {
    errors.createdBy = 'Author is required'
  }

  return errors
}

function CommentsSection({
  comments = [],
  users = [],
  usersById = {},
  onAddComment,
  usersLoading = false,
}) {
  const formId = useId()
  const [form, setForm] = useState({ message: '', createdBy: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const messageErrorId = `${formId}-message-error`
  const createdByErrorId = `${formId}-createdby-error`

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

  async function handleFormSubmit(event) {
    event.preventDefault()

    const clientErrors = validateCommentForm(form)
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors)
      return
    }

    setSubmitting(true)
    setFieldErrors({})

    try {
      await onAddComment({
        message: form.message.trim(),
        createdBy: form.createdBy,
      })
      setForm({ message: '', createdBy: '' })
    } catch (err) {
      if (err?.field) {
        setFieldErrors({
          [err.field]: err.message,
        })
      } else if (err?.message) {
        setFieldErrors({
          _form: err.message,
        })
      } else {
        setFieldErrors({
          _form: 'Could not add comment. Please try again.',
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  function resolveAuthorName(userId) {
    return usersById[String(userId)] ?? 'Unknown user'
  }

  return (
    <section className="comments-section" aria-label="Comments">
      <h2 className="comments-section__title">Comments</h2>

      {comments.length === 0 ? (
        <p className="comments-section__empty">No comments yet</p>
      ) : (
        <ol className="comments-section__list">
          {comments.map((comment) => (
            <li key={comment.id} className="comments-section__item">
              <header className="comments-section__item-header">
                <span className="comments-section__author">
                  {resolveAuthorName(comment.createdBy)}
                </span>
                <time
                  className="comments-section__timestamp text-mono"
                  dateTime={comment.createdAt}
                >
                  {formatTimestamp(comment.createdAt)}
                </time>
              </header>
              <p className="comments-section__message">{comment.message}</p>
            </li>
          ))}
        </ol>
      )}

      <form className="comments-section__form" onSubmit={handleFormSubmit} noValidate>
        {fieldErrors._form && (
          <p className="comments-section__form-error" role="alert">
            {fieldErrors._form}
          </p>
        )}

        <div className="comments-section__field">
          <label className="comments-section__label" htmlFor={`${formId}-message`}>
            Add a comment
          </label>
          <textarea
            id={`${formId}-message`}
            className={`comments-section__textarea${fieldErrors.message ? ' comments-section__input--invalid' : ''}`}
            value={form.message}
            onChange={(event) => updateField('message', event.target.value)}
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={fieldErrors.message ? messageErrorId : undefined}
            rows={4}
            placeholder="Write your comment…"
          />
          {fieldErrors.message && (
            <p id={messageErrorId} className="comments-section__field-error" role="alert">
              {fieldErrors.message}
            </p>
          )}
        </div>

        <div className="comments-section__field">
          <label className="comments-section__label" htmlFor={`${formId}-createdBy`}>
            Author
          </label>
          <select
            id={`${formId}-createdBy`}
            className={`comments-section__select${fieldErrors.createdBy ? ' comments-section__input--invalid' : ''}`}
            value={form.createdBy}
            onChange={(event) => updateField('createdBy', event.target.value)}
            aria-invalid={Boolean(fieldErrors.createdBy)}
            aria-describedby={fieldErrors.createdBy ? createdByErrorId : undefined}
            disabled={usersLoading}
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
            <p id={createdByErrorId} className="comments-section__field-error" role="alert">
              {fieldErrors.createdBy}
            </p>
          )}
        </div>

        <div className="comments-section__actions">
          <button
            type="submit"
            className="comments-section__submit"
            disabled={submitting || usersLoading}
          >
            {submitting ? 'Adding…' : 'Add comment'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default CommentsSection
