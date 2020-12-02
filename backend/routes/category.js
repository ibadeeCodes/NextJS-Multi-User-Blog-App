const express = require('express')
const router = express.Router()
const { createCategoryValidation } = require('../validators/category')
const { runValidation } = require('../validators')
const { create, list, read, remove } = require('../controllers/category')
const { requireSignIn, adminMiddleware } = require('../middleware/auth')

router.post(
  '/category',
  createCategoryValidation,
  runValidation,
  requireSignIn,
  adminMiddleware,
  create
)
router.get('/categories', list)
router.get('/category/:slug', read)
router.delete('/category/:slug', requireSignIn, adminMiddleware, remove)

module.exports = router
