import { Link, useParams } from 'react-router-dom'

function TicketDetail() {
  const { id } = useParams()

  return (
    <main>
      <h1>Ticket Detail</h1>
      <p>Ticket detail placeholder — functionality coming soon.</p>
      <p>Ticket ID: {id}</p>
      <p>
        <Link to="/">Back to ticket list</Link>
      </p>
    </main>
  )
}

export default TicketDetail
