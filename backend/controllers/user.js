const User = require('../models/User')

exports.read = (req, res) => {
  return res.status(200).json({
    success: true,
    profile: req.profile,
  })
}
