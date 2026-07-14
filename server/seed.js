import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from './db.js'
import Comment from './models/Comment.js'
import Ticket from './models/Ticket.js'
import User from './models/User.js'

async function seed() {
  await connectDB()

  await Comment.deleteMany({})
  await Ticket.deleteMany({})
  await User.deleteMany({})
  console.log('Cleared existing Users, Tickets, and Comments')

  const users = await User.insertMany([
    { name: 'Alex Rivera', email: 'alex.rivera@example.com', role: 'agent' },
    { name: 'Jamie Chen', email: 'jamie.chen@example.com', role: 'agent' },
    { name: 'Morgan Patel', email: 'morgan.patel@example.com', role: 'admin' },
    { name: 'Sam Okonkwo', email: 'sam.okonkwo@example.com', role: 'agent' },
  ])

  const [alex, jamie, morgan, sam] = users

  const tickets = await Ticket.insertMany([
    {
      title: 'VPN connection drops intermittently',
      description: 'Remote staff report VPN disconnects every 20–30 minutes since last patch.',
      priority: 'high',
      status: 'Open',
      assignedTo: jamie._id,
      createdBy: alex._id,
    },
    {
      title: 'Request new monitor for desk 12',
      description: 'Current display has flickering issues. Requesting a 27" replacement.',
      priority: 'low',
      status: 'In Progress',
      assignedTo: sam._id,
      createdBy: morgan._id,
    },
    {
      title: 'Payroll portal login error',
      description: 'Users see a 500 error when resetting password on the payroll portal.',
      priority: 'urgent',
      status: 'Resolved',
      assignedTo: alex._id,
      createdBy: jamie._id,
    },
    {
      title: 'Archive old shared drive folders',
      description: 'Marketing shared drive cleanup completed and folders archived per policy.',
      priority: 'medium',
      status: 'Closed',
      assignedTo: jamie._id,
      createdBy: morgan._id,
    },
    {
      title: 'Trial software license not needed',
      description: 'Design team decided not to proceed with the trial analytics tool.',
      priority: 'low',
      status: 'Cancelled',
      assignedTo: null,
      createdBy: alex._id,
    },
    {
      title: 'Email forwarding rule for contractor',
      description: 'Set up forwarding from contractor alias to project lead for Q3 engagement.',
      priority: 'medium',
      status: 'Open',
      assignedTo: null,
      createdBy: sam._id,
    },
  ])

  const [vpnTicket, monitorTicket, payrollTicket] = tickets

  await Comment.insertMany([
    {
      ticketId: vpnTicket._id,
      message: 'Collected logs from three affected users. Investigating gateway timeouts.',
      createdBy: jamie._id,
    },
    {
      ticketId: monitorTicket._id,
      message: 'Replacement monitor ordered from IT inventory. ETA two business days.',
      createdBy: sam._id,
    },
    {
      ticketId: payrollTicket._id,
      message: 'Root cause was a misconfigured reset token expiry. Fix deployed to staging.',
      createdBy: alex._id,
    },
  ])

  console.log(
    `Seed completed: ${users.length} users, ${tickets.length} tickets, 3 comments`,
  )

  await mongoose.disconnect()
  console.log('MongoDB disconnected')
}

seed().catch((error) => {
  console.error('Seed failed:', error.message)
  process.exit(1)
})
