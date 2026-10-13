const errorHandler = (err, req, res, next) => {
  // Multer file size errors
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: err.message })
  }

  // Multer file filter rejection (custom Error from fileFilter callback)
  if (err.message && err.message.includes('Only JPEG, PNG, and WebP images are allowed')) {
    return res.status(400).json({ message: err.message })
  }

  // Mongoose CastError (invalid ObjectId in params)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` })
  }

  // Mongoose ValidationError (schema validation failure)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({ message: 'Validation failed', errors: messages })
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0]
    return res.status(409).json({ message: `Duplicate value for ${field}` })
  }

  const status = err.statusCode || 500
  res.status(status).json({
    message: err.message || 'Server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  })
}

module.exports = errorHandler
