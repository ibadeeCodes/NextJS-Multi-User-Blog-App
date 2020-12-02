const express = require('express')
const router = express.Router()
const {
  signup,
  signin,
  signout,
  googleLogin,
  updateUser,
} = require('../controllers/auth')
const { requireSignIn } = require('../middleware/auth')
const { signUpValidator, signInValidator } = require('../validators/auth')
const { runValidation } = require('../validators')
const { authMiddleware } = require('../middleware/auth')

router.post('/signup', signUpValidator, runValidation, signup)
router.post('/signin', signInValidator, runValidation, signin)
router.post('/signout', signout)
router.put('/updateProfile', requireSignIn, authMiddleware, updateUser)
router.get('/secret', requireSignIn, (req, res) => {
  res.status(200).json({ user: req.user })
})
//google-auth

router.post('/google-login', googleLogin)

module.exports = router
