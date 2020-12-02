const express = require('express')
const router = express.Router()
const { createTagValidation } = require('../validators/tag')
const { runValidation } = require('../validators')
const { create, list, read, remove } = require('../controllers/tag')
const { requireSignIn, adminMiddleware } = require('../middleware/auth')

router.post(
  '/tag',
  createTagValidation,
  runValidation,
  requireSignIn,
  adminMiddleware,
  create
)
router.get('/tags', list)
router.get('/tag/:slug', read)
router.delete('/tag/:slug', requireSignIn, adminMiddleware, remove)

module.exports = router
