import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchTickets } from '../api/tickets.js'
import { fetchUsers } from '../api/users.js'
import PriorityDot from '../components/PriorityDot.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import { TICKET_STATUSES } from '../utils/status.js'
import './TicketList.css'

function TicketList() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [usersById, setUsersById] = useState({})
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const debouncedSearch = useDebouncedValue(searchInput.trim(), 300)
  const isInitialLoadRef = useRef(true)

  useEffect(() => {
    let cancelled = false

    async function loadUsers() {
      try {
        const userData = await fetchUsers()
        if (!cancelled) {
          const userMap = Object.fromEntries(
            userData.map((user) => [String(user.id), user.name]),
          )
          setUsersById(userMap)
        }
      } catch {
        // Assignee names fall back to "Unassigned" if users fail to load
      }
    }

    loadUsers()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadTickets() {
      if (isInitialLoadRef.current) {
        setLoading(true)
        isInitialLoadRef.current = false
      } else {
        setFetching(true)
      }
      setError(null)

      try {
        const ticketData = await fetchTickets({
          q: debouncedSearch || undefined,
          status: statusFilter || undefined,
        })

        if (!cancelled) {
          setTickets(ticketData)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message ?? 'Failed to load tickets')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
          setFetching(false)
        }
      }
    }

    loadTickets()

    return () => {
      cancelled = true
    }
  }, [debouncedSearch, statusFilter])

  const hasActiveFilters = Boolean(searchInput.trim() || statusFilter)

  function resolveAssignee(assignedTo) {
    if (!assignedTo) {
      return 'Unassigned'
    }
    return usersById[String(assignedTo)] ?? 'Unassigned'
  }

  function goToTicket(id) {
    navigate(`/tickets/${id}`)
  }

  function handleRowKeyDown(event, id) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      goToTicket(id)
    }
  }

  function clearFilters() {
    setSearchInput('')
    setStatusFilter('')
  }

  return (
    <main className="ticket-list-page">
      <header className="ticket-list-page__header">
        <h1 className="ticket-list-page__title">Tickets</h1>
        <Link to="/tickets/new" className="ticket-list-page__create">
          New ticket
        </Link>
      </header>

      {error && (
        <div className="ticket-list-page__error" role="alert">
          {error}
        </div>
      )}

      <div className="ticket-table-wrap">
        <div className="ticket-table-toolbar" role="search">
          <label className="ticket-table-toolbar__field ticket-table-toolbar__field--search">
            <span className="ticket-table-toolbar__label">Search</span>
            <input
              type="search"
              className="ticket-table-toolbar__input"
              placeholder="Title or description…"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              aria-label="Search tickets by title or description"
            />
          </label>

          <label className="ticket-table-toolbar__field ticket-table-toolbar__field--status">
            <span className="ticket-table-toolbar__label">Status</span>
            <select
              className="ticket-table-toolbar__select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter tickets by status"
            >
              <option value="">All statuses</option>
              {TICKET_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          {fetching && (
            <span className="ticket-table-toolbar__fetching" aria-live="polite">
              Updating…
            </span>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              className="ticket-table-toolbar__clear"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </div>

        <table className="ticket-table">
          <thead>
            <tr>
              <th scope="col">Status</th>
              <th scope="col">
                <span className="visually-hidden">Priority</span>
                <span aria-hidden="true">Pri</span>
              </th>
              <th scope="col">Title</th>
              <th scope="col">Assignee</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="ticket-table__loading">
                  <span className="ticket-table__loading-text">Loading tickets…</span>
                </td>
              </tr>
            )}

            {!loading && !error && tickets.length === 0 && (
              <tr>
                <td colSpan={4} className="ticket-table__empty">
                  <p className="ticket-table__empty-title">No tickets match</p>
                  <p className="ticket-table__empty-hint">
                    {hasActiveFilters
                      ? 'Try clearing filters or broadening your search.'
                      : 'Try creating a new ticket.'}
                  </p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="ticket-table__empty-clear"
                      onClick={clearFilters}
                    >
                      Clear filters
                    </button>
                  )}
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="ticket-table__row"
                  tabIndex={0}
                  role="link"
                  aria-label={`View ticket: ${ticket.title}`}
                  onClick={() => goToTicket(ticket.id)}
                  onKeyDown={(event) => handleRowKeyDown(event, ticket.id)}
                >
                  <td data-label="Status">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td data-label="Priority">
                    <PriorityDot priority={ticket.priority} />
                  </td>
                  <td data-label="Title" className="ticket-table__title">
                    {ticket.title}
                  </td>
                  <td data-label="Assignee" className="ticket-table__assignee">
                    {resolveAssignee(ticket.assignedTo)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default TicketList
