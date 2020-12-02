const { check } = require('express-validator')

exports.createCategoryValidation = [
  check('name').not().isEmpty().withMessage('Please provide a category name.'),
]
