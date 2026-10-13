const Comment = require('../models/Comment')
const Issue = require('../models/Issue')
const asyncHandler = require('../utils/asyncHandler')
const { emitIssueEvent } = require('../socket')

// GET /api/issues/:id/comments
const getComments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query
  const pageNum = Math.max(1, Number(page) || 1)
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 50))
  const skip = (pageNum - 1) * limitNum

  const [comments, total] = await Promise.all([
    Comment.find({ issueId: req.params.id })
      .populate('userId', 'name')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limitNum),
    Comment.countDocuments({ issueId: req.params.id })
  ])

  const formatted = comments.map(c => ({
    id: c._id,
    text: c.text,
    createdAt: c.createdAt,
    user: c.userId ? { id: c.userId._id, name: c.userId.name } : null
  }))

  res.json({ comments: formatted, total, page: pageNum, limit: limitNum })
})

// POST /api/issues/:id/comments
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body

  const issue = await Issue.findById(req.params.id)
  if (!issue) {
    return res.status(404).json({ message: 'Issue not found' })
  }

  const comment = await Comment.create({
    issueId: req.params.id,
    userId: req.user.id,
    text
  })

  const populated = await Comment.findById(comment._id).populate('userId', 'name')
  const formatted = {
    id: populated._id,
    text: populated.text,
    createdAt: populated.createdAt,
    user: populated.userId ? { id: populated.userId._id, name: populated.userId.name } : null
  }

  const city = issue.location?.address?.split(',').pop()?.trim() || 'islamabad'
  emitIssueEvent(req.io, 'issue:commented', { issueId: req.params.id, comment: formatted }, city)
  res.status(201).json({ comment: formatted })
})

module.exports = { getComments, addComment }
