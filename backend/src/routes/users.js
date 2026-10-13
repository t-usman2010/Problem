const express = require('express')
const router = express.Router()
const { getMyReports, getAllUsers, updateUserRole } = require('../controllers/userController')
const auth = require('../middleware/auth')
const role = require('../middleware/role')
const validate = require('../middleware/validate')
const { updateRoleSchema } = require('../middleware/schemas')

router.get('/my-reports', auth, getMyReports)
router.get('/', auth, role('admin'), getAllUsers)
router.patch('/:id/role', auth, role('admin'), validate(updateRoleSchema), updateUserRole)

module.exports = router
