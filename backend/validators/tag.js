const { check } = require('express-validator')

exports.createTagValidation = [
  check('name').not().isEmpty().withMessage('Please provide a tag name.'),
]
