const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const { sanitize: mongoSanitize } = require('express-mongo-sanitize')
const { generalLimiter } = require('./middleware/rateLimit')
const errorHandler = require('./middleware/errorHandler')
const corsOptions = require('./config/cors')

// Route imports
const authRoutes = require('./routes/auth')
const issueRoutes = require('./routes/issues')
const userRoutes = require('./routes/users')
const statsRoutes = require('./routes/stats')

const app = express()

// Security & utility middleware
app.use(helmet())
app.use(cors(corsOptions))
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
  // Express 5 makes req.query a read-only getter, so sanitize it in-place
  if (req.query) mongoSanitize(req.query)
  if (req.body) req.body = mongoSanitize(req.body)
  if (req.params) req.params = mongoSanitize(req.params)
  next()
})
app.use(generalLimiter)

// Logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// Attach io to requests (set in server.js)
app.use((req, res, next) => {
  req.io = req.app.get('io')
  next()
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/issues', issueRoutes)
app.use('/api/users', userRoutes)
app.use('/api', statsRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
})

// Error handler (must be last)
app.use(errorHandler)

module.exports = app
