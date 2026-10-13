const jwt = require('jsonwebtoken')
const User = require('../models/User')
const asyncHandler = require('../utils/asyncHandler')

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' })
  }

  const user = await User.create({ name, email, password })
  const token = generateToken(user)

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  })
})

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = generateToken(user)

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  })
})

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } })
})

module.exports = { register, login, getMe }
