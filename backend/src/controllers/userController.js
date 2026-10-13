const User = require('../models/User')
const Issue = require('../models/Issue')
const asyncHandler = require('../utils/asyncHandler')
const serializeIssue = require('../utils/serializeIssue')

// GET /api/users/my-reports
const getMyReports = asyncHandler(async (req, res) => {
  const issues = await Issue.find({ reportedBy: req.user.id })
    .populate('reportedBy', 'name')
    .sort({ createdAt: -1 })

  const serialized = issues.map(i => serializeIssue(i, req.user.id))
  res.json({ issues: serialized })
})

// GET /api/users (admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query
  const pageNum = Math.max(1, Number(page) || 1)
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 50))
  const skip = (pageNum - 1) * limitNum

  const [users, total] = await Promise.all([
    User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    User.countDocuments()
  ])

  res.json({ users, total, page: pageNum, limit: limitNum })
})

// PATCH /api/users/:id/role (admin)
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body
  if (!['citizen', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' })
  }

  const targetUser = await User.findById(req.params.id)
  if (!targetUser) {
    return res.status(404).json({ message: 'User not found' })
  }

  // Prevent demoting the last admin, locking out the system
  if (targetUser.role === 'admin' && role !== 'admin') {
    const adminCount = await User.countDocuments({ role: 'admin' })
    if (adminCount <= 1) {
      return res.status(400).json({ message: 'Cannot demote the last remaining admin' })
    }
  }

  targetUser.role = role
  await targetUser.save()

  res.json({ user: { id: targetUser._id, name: targetUser.name, email: targetUser.email, role: targetUser.role } })
})

module.exports = { getMyReports, getAllUsers, updateUserRole }
