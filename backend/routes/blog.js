const express = require('express')
const router = express.Router()
const {
  create,
  list,
  listAllBlogsCategoriesTags,
  read,
  remove,
  update,
  blogPhoto,
  SearchBlogs,
  listBlogUser,
} = require('../controllers/blog')
const {
  requireSignIn,
  adminMiddleware,
  authMiddleware,
} = require('../middleware/auth')

router.get('/blogs/search', SearchBlogs)
router.post('/blogs', requireSignIn, adminMiddleware, create)
router.get('/blogs', list)
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags)
router.get('/blogs/:slug', read)
router.delete('/blogs/:slug', requireSignIn, adminMiddleware, remove)
router.put('/blogs/:slug', requireSignIn, adminMiddleware, update)
router.get('/blogs/photo/:slug', blogPhoto)

// User Blog CRUD.
router.post('/user/blogs', requireSignIn, authMiddleware, create)
router.get('/:username/blogs', listBlogUser)
router.delete('/user/blogs/:slug', requireSignIn, authMiddleware, remove)
router.put('/user/blogs/:slug', requireSignIn, authMiddleware, update)

module.exports = router
