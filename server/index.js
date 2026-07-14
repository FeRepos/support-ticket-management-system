import 'dotenv/config'
import app from './app.js'
import connectDB from './db.js'

const PORT = process.env.PORT || 3000

async function start() {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
}

start().catch((error) => {
  console.error('Failed to start server:', error.message)
  process.exit(1)
})
