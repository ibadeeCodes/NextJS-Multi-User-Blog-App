const { check } = require('express-validator')

exports.signUpValidator = [
  check('name').not().isEmpty().withMessage('Please provide a name.'),
  check('email').isEmail().withMessage('Please provide a valid email.'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be atleast 6 characters long'),
]

exports.signInValidator = [
  check('email').isEmail().withMessage('Please provide a valid email.'),
]
