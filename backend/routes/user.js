const express = require('express')
const router = express.Router()
const { requireSignIn, authMiddleware } = require('../middleware/auth')
const { read } = require('../controllers/user')

router.get('/profile', requireSignIn, authMiddleware, read)

module.exports = router
