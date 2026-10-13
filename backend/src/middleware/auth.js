const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' })
    }
    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }
    req.user = { id: user._id.toString(), role: user.role, name: user.name, email: user.email }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

const optionalAuth = async (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) return next()
  try {
    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (user) {
      req.user = { id: user._id.toString(), role: user.role, name: user.name, email: user.email }
    }
  } catch (_) {
    // token invalid — treat as unauthenticated
  }
  next()
}

module.exports = auth
module.exports.auth = auth
module.exports.optionalAuth = optionalAuth
