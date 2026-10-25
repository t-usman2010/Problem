const Issue = require('../models/Issue')
const Comment = require('../models/Comment')
const asyncHandler = require('../utils/asyncHandler')
const serializeIssue = require('../utils/serializeIssue')
const { savePhoto, deletePhoto } = require('../services/photoService')
const { getBucket } = require('../config/gridfs')
const { emitIssueEvent } = require('../socket')
const {
  sendReportSubmittedEmail,
  sendReportProcessingEmail,
  sendReportResolvedEmail
} = require('../services/emailService')

// GET /api/issues
const getIssues = asyncHandler(async (req, res) => {
  const { category, status, search, reporter, page = 1, limit = 20 } = req.query
  const filter = {}

  if (category) filter.category = category
  if (status) filter.status = status
  if (search) filter.$text = { $search: search }
  if (reporter) filter.reportedBy = reporter

  const skip = (Number(page) - 1) * Number(limit)

  const [issues, total] = await Promise.all([
    Issue.find(filter)
      .populate('reportedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Issue.countDocuments(filter)
  ])

  const userId = req.user?.id || null
  const serialized = issues.map(i => serializeIssue(i, userId))

  res.json({ issues: serialized, total, page: Number(page) })
})

// GET /api/issues/nearby
const getNearbyIssues = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 2000, category } = req.query

  if (!lat || !lng) {
    return res.status(400).json({ message: 'lat and lng are required' })
  }

  const filter = {
    location: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [Number(lng), Number(lat)]
        },
        $maxDistance: Number(radius)
      }
    }
  }

  if (category) filter.category = category

  const issues = await Issue.find(filter).populate('reportedBy', 'name').limit(50)
  const userId = req.user?.id || null
  const serialized = issues.map(i => serializeIssue(i, userId))

  res.json({ issues: serialized })
})

// GET /api/issues/export (admin only, T3)
const exportIssues = asyncHandler(async (req, res) => {
  const { category, status, search } = req.query
  const filter = {}

  if (category) filter.category = category
  if (status) filter.status = status
  if (search) filter.$text = { $search: search }

  const issues = await Issue.find(filter).populate('reportedBy', 'name').sort({ createdAt: -1 })

  const escapeCsv = (val) => {
    const str = String(val ?? '')
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
  }

  const rows = issues.map(i =>
    [i.title, i.category, i.status, i.location?.address, i.reportedBy?.name, i.createdAt]
      .map(escapeCsv)
      .join(',')
  )
  const csv = ['Title,Category,Status,Address,Reporter,Date', ...rows].join('\n')

  res.set('Content-Type', 'text/csv')
  res.set('Content-Disposition', 'attachment; filename="issues-export.csv"')
  res.send(csv)
})

// GET /api/issues/:id
const getIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id).populate('reportedBy', 'name')
  if (!issue) {
    return res.status(404).json({ message: 'Issue not found' })
  }
  const userId = req.user?.id || null
  res.json({ issue: serializeIssue(issue, userId) })
})

// GET /api/issues/:id/photo
const getIssuePhoto = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id).select('photoId photoContentType')
  if (!issue?.photoId) return res.status(404).json({ message: 'No photo for this issue' })

  const bucket = getBucket()
  const files = await bucket.find({ _id: issue.photoId }).limit(1).toArray()
  if (!files || files.length === 0) {
    return res.status(404).json({ message: 'Photo not found' })
  }

  res.set('Content-Type', issue.photoContentType || files[0].contentType || 'application/octet-stream')
  res.set('Cache-Control', 'public, max-age=31536000, immutable')

  const stream = bucket.openDownloadStream(issue.photoId)
  stream.on('error', () => {
    if (!res.headersSent) {
      res.status(404).json({ message: 'Photo not found' })
    } else {
      res.end()
    }
  })
  stream.pipe(res)
})

// POST /api/issues
const createIssue = asyncHandler(async (req, res) => {
  const { title, description, category, latitude, longitude, address } = req.body

  let photoId = null, photoContentType = null
  if (req.file) {
    photoId = await savePhoto(req.file.buffer, req.file.originalname, req.file.mimetype)
    photoContentType = req.file.mimetype
  }

  let issue
  try {
    issue = await Issue.create({
      title,
      description,
      category,
      location: {
        type: 'Point',
        coordinates: [Number(longitude), Number(latitude)],
        address
      },
      photoId,
      photoContentType,
      reportedBy: req.user.id
    })
  } catch (err) {
    if (photoId) {
      await deletePhoto(photoId)
    }
    throw err
  }

  const populated = await Issue.findById(issue._id).populate('reportedBy', 'name email')
  const serialized = serializeIssue(populated, req.user.id)

  const city = address?.split(',').pop()?.trim() || 'islamabad'
  emitIssueEvent(req.io, 'issue:new', serialized, city)

  // Send automatic submission confirmation email asynchronously
  sendReportSubmittedEmail(populated.reportedBy || req.user, populated).catch(err => {
    console.error('Failed to send report submission email:', err.message)
  })

  res.status(201).json({ issue: serialized })
})

// PATCH /api/issues/:id/status
const updateStatus = asyncHandler(async (req, res) => {
  const { status, assignedDept } = req.body
  const issue = await Issue.findById(req.params.id)
  if (!issue) {
    return res.status(404).json({ message: 'Issue not found' })
  }

  const previousStatus = issue.status

  // Set resolvedAt only on transition into 'resolved'
  if (status === 'resolved' && issue.status !== 'resolved') {
    issue.resolvedAt = new Date()
  }

  issue.status = status
  if (assignedDept !== undefined) issue.assignedDept = assignedDept
  await issue.save()

  const populated = await Issue.findById(issue._id).populate('reportedBy', 'name email')
  const serialized = serializeIssue(populated, null)

  const city = issue.location?.address?.split(',').pop()?.trim() || 'islamabad'
  emitIssueEvent(req.io, 'issue:updated', serialized, city)

  // Send automatic status change notification emails based on transition
  if (status === 'in-progress' && previousStatus !== 'in-progress') {
    sendReportProcessingEmail(populated.reportedBy, populated).catch(err => {
      console.error('Failed to send processing email:', err.message)
    })
  } else if (status === 'resolved' && previousStatus !== 'resolved') {
    sendReportResolvedEmail(populated.reportedBy, populated).catch(err => {
      console.error('Failed to send resolved email:', err.message)
    })
  }

  res.json({ issue: serialized })
})

// POST /api/issues/:id/upvote
const toggleUpvote = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const issueId = req.params.id

  const existing = await Issue.findById(issueId)
  if (!existing) {
    return res.status(404).json({ message: 'Issue not found' })
  }

  const alreadyUpvoted = existing.upvotes.some(id => id.toString() === userId)

  const updatedIssue = await Issue.findByIdAndUpdate(
    issueId,
    alreadyUpvoted
      ? { $pull: { upvotes: userId } }
      : { $addToSet: { upvotes: userId } },
    { new: true, select: 'upvotes location' }
  )

  const upvoteCount = updatedIssue.upvotes.length
  const hasUpvoted = !alreadyUpvoted

  const city = updatedIssue.location?.address?.split(',').pop()?.trim() || 'islamabad'
  emitIssueEvent(req.io, 'issue:upvoted', { id: updatedIssue._id, upvoteCount }, city)
  res.json({ upvoteCount, hasUpvoted })
})

// DELETE /api/issues/:id
const deleteIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id)
  if (!issue) {
    return res.status(404).json({ message: 'Issue not found' })
  }

  const city = issue.location?.address?.split(',').pop()?.trim() || 'islamabad'
  await deletePhoto(issue.photoId)
  await issue.deleteOne()
  await Comment.deleteMany({ issueId: issue._id })

  emitIssueEvent(req.io, 'issue:deleted', { id: issue._id }, city)
  res.json({ message: 'Issue deleted' })
})

module.exports = {
  getIssues,
  getNearbyIssues,
  exportIssues,
  getIssue,
  getIssuePhoto,
  createIssue,
  updateStatus,
  toggleUpvote,
  deleteIssue
}
