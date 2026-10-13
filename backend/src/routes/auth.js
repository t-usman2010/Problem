const express = require('express')
const router = express.Router()
const { register, login, getMe } = require('../controllers/authController')
const auth = require('../middleware/auth')
const { authLimiter } = require('../middleware/rateLimit')
const validate = require('../middleware/validate')
const { registerSchema, loginSchema } = require('../middleware/schemas')

router.post('/register', authLimiter, validate(registerSchema), register)
router.post('/login', authLimiter, validate(loginSchema), login)
router.get('/me', auth, getMe)

module.exports = router
