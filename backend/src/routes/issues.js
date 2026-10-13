const express = require('express')
const router = express.Router()
const {
  getIssues,
  getNearbyIssues,
  exportIssues,
  getIssue,
  getIssuePhoto,
  createIssue,
  updateStatus,
  toggleUpvote,
  deleteIssue
} = require('../controllers/issueController')
const { getComments, addComment } = require('../controllers/commentController')
const { auth, optionalAuth } = require('../middleware/auth')
const role = require('../middleware/role')
const upload = require('../middleware/upload')
const validate = require('../middleware/validate')
const { issueCreateLimiter } = require('../middleware/rateLimit')
const { createIssueSchema, addCommentSchema, updateStatusSchema } = require('../middleware/schemas')

// Static routes BEFORE parameterized routes
router.get('/nearby', optionalAuth, getNearbyIssues)
router.get('/export', auth, role('admin'), exportIssues)

router.get('/', optionalAuth, getIssues)
router.post('/', auth, role('citizen'), issueCreateLimiter, upload.single('photo'), validate(createIssueSchema), createIssue)

router.get('/:id', optionalAuth, getIssue)
router.get('/:id/photo', getIssuePhoto)
router.get('/:id/comments', getComments)
router.post('/:id/comments', auth, validate(addCommentSchema), addComment)
router.patch('/:id/status', auth, role('admin'), validate(updateStatusSchema), updateStatus)
router.post('/:id/upvote', auth, role('citizen'), toggleUpvote)
router.delete('/:id', auth, role('admin'), deleteIssue)

module.exports = router
