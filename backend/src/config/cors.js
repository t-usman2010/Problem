const productionClientOrigin = 'https://civic-report-project.vercel.app'

const configuredOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const allowedOrigins = new Set([...configuredOrigins, productionClientOrigin])

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true)
    }

    return callback(null, false)
  },
  credentials: true
}

module.exports = corsOptions
