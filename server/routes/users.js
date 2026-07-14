import express from 'express'
import User from '../models/User.js'

const router = express.Router()

router.get('/', async (_req, res) => {
  const users = await User.find().sort({ name: 1 })

  res.json(
    users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })),
  )
})

export default router
