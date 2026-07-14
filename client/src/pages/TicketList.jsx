import { Link } from 'react-router-dom'

function TicketList() {
  return (
    <main>
      <h1>Tickets</h1>
      <p>Ticket list placeholder — functionality coming soon.</p>
      <p>
        <Link to="/tickets/example-id">View example ticket</Link>
      </p>
    </main>
  )
}

export default TicketList
