const express = require('express')
const router = express.Router()
const { getSummary, getLeaderboard } = require('../controllers/statsController')

// GET /api/stats/summary — public
router.get('/stats/summary', getSummary)

// GET /api/leaderboard — public
router.get('/leaderboard', getLeaderboard)

module.exports = router
