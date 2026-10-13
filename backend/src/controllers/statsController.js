const Issue = require('../models/Issue')
const asyncHandler = require('../utils/asyncHandler')

// GET /api/stats/summary
const getSummary = asyncHandler(async (req, res) => {
  const [summary] = await Issue.aggregate([
    { $facet: {
        totals: [{ $group: {
          _id: null,
          totalReported: { $sum: 1 },
          totalResolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          avgResolutionMs: { $avg: {
            $cond: [{ $ne: ['$resolvedAt', null] }, { $subtract: ['$resolvedAt', '$createdAt'] }, null]
          }}
        }}],
        byCategory: [{ $group: {
          _id: '$category',
          total: { $sum: 1 },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          avgResolutionMs: { $avg: {
            $cond: [{ $ne: ['$resolvedAt', null] }, { $subtract: ['$resolvedAt', '$createdAt'] }, null]
          }}
        }}],
        byDepartment: [
          { $match: { assignedDept: { $ne: null } } },
          { $group: {
            _id: '$assignedDept',
            total: { $sum: 1 },
            resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
            avgResolutionMs: { $avg: {
              $cond: [{ $ne: ['$resolvedAt', null] }, { $subtract: ['$resolvedAt', '$createdAt'] }, null]
            }}
          }}
        ]
    }}
  ])

  const totals = summary.totals[0] || { totalReported: 0, totalResolved: 0, avgResolutionMs: null }
  // Convert ms to hours
  totals.avgResolutionHours = totals.avgResolutionMs
    ? Math.round((totals.avgResolutionMs / 1000 / 60 / 60) * 10) / 10
    : null
  delete totals.avgResolutionMs
  delete totals._id

  const byCategory = (summary.byCategory || []).map(c => ({
    category: c._id,
    total: c.total,
    resolved: c.resolved,
    avgResolutionHours: c.avgResolutionMs
      ? Math.round((c.avgResolutionMs / 1000 / 60 / 60) * 10) / 10
      : null
  }))

  const byDepartment = (summary.byDepartment || []).map(d => ({
    department: d._id,
    total: d.total,
    resolved: d.resolved,
    avgResolutionHours: d.avgResolutionMs
      ? Math.round((d.avgResolutionMs / 1000 / 60 / 60) * 10) / 10
      : null
  }))

  res.json({ totals, byCategory, byDepartment })
})

// GET /api/leaderboard
const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await Issue.aggregate([
    { $group: {
        _id: '$reportedBy',
        issuesReported: { $sum: 1 },
        totalUpvotesReceived: { $sum: { $size: '$upvotes' } }
    }},
    { $sort: { issuesReported: -1 } },
    { $limit: Number(req.query.limit) || 10 },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { userId: '$_id', name: '$user.name', issuesReported: 1, totalUpvotesReceived: 1, _id: 0 } }
  ])

  res.json({ leaderboard })
})

module.exports = { getSummary, getLeaderboard }
