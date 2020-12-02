const Category = require('../models/Category')
const slugify = require('slugify')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.create = async (req, res) => {
  const { name } = req.body

  try {
    const slug = slugify(name, {
      lower: true,
    })

    let category = await Category.create({ name, slug })

    if (!category) {
      return res.status(500).json({ message: 'Category creation failed!' })
    }
    return res.status(200).json({ success: true, category })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: errorHandler(error) })
  }
}

exports.list = async (req, res) => {
  try {
    let categories = await Category.find().lean()
    return res.status(200).json({ categories })
  } catch (error) {
    return res.status(500).json({ message: errorHandler(error) })
  }
}

exports.read = async (req, res) => {
  const slug = req.params.slug.toLowerCase()
  try {
    let category = await Category.findOne({ slug }).lean()
    return res.status(200).json({ category })
  } catch (error) {
    return res.status(500).json({ message: errorHandler(error) })
  }
}

exports.remove = async (req, res) => {
  const slug = req.params.slug.toLowerCase()
  try {
    let category = await Category.findOneAndDelete({ slug })
    return res.status(200).json({ category })
  } catch (error) {
    return res.status(500).json({ message: errorHandler(error) })
  }
}
