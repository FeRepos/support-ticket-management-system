import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CreateTicket from './pages/CreateTicket.jsx'
import TicketDetail from './pages/TicketDetail.jsx'
import TicketList from './pages/TicketList.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TicketList />} />
        <Route path="/tickets/new" element={<CreateTicket />} />
        <Route path="/tickets/:id" element={<TicketDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
