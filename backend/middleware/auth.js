const User = require('../models/User')
const expressJwt = require('express-jwt')

exports.requireSignIn = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
})

exports.authMiddleware = async (req, res, next) => {
  let userId = req.user._id

  let user = await User.findById(userId).select('-password')

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  req.profile = user
  next() // next middleware
}

exports.adminMiddleware = async (req, res, next) => {
  let adminId = req.user._id

  let user = await User.findById(adminId).select('-password')

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  if (user.role !== 1) {
    // "1" denotes the admin
    return res.status(403).json({ error: 'Admin route. Access denied.' })
  }

  req.profile = user
  next() // next middleware
}
