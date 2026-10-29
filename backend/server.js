require('dotenv').config()
const http = require('http')
const { Server } = require('socket.io')
const app = require('./src/app')
const connectDB = require('./src/config/db')
const setupSocket = require('./src/socket/index')
const corsOptions = require('./src/config/cors')

const PORT = process.env.PORT || 5000

const start = async () => {
  await connectDB()

  const server = http.createServer(app)

  const io = new Server(server, {
    cors: corsOptions
  })

  app.set('io', io)
  setupSocket(io)

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start().catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
