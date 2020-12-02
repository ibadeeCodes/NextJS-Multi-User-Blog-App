const Tag = require('../models/Tag')
const slugify = require('slugify')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.create = async (req, res) => {
  const { name } = req.body

  try {
    const slug = slugify(name, {
      lower: true,
    })

    let tag = await Tag.create({ name, slug })

    if (!tag) {
      return res.status(500).json({ message: 'Tag creation failed!' })
    }
    return res.status(200).json({ success: true, tag })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: errorHandler(error) })
  }
}

exports.list = async (req, res) => {
  try {
    let tags = await Tag.find().lean()
    return res.status(200).json({ tags })
  } catch (error) {
    return res.status(500).json({ message: errorHandler(error) })
  }
}

exports.read = async (req, res) => {
  const slug = req.params.slug.toLowerCase()
  try {
    let tag = await Tag.findOne({ slug }).lean()
    return res.status(200).json({ tag })
  } catch (error) {
    return res.status(500).json({ message: errorHandler(error) })
  }
}

exports.remove = async (req, res) => {
  const slug = req.params.slug.toLowerCase()
  try {
    let tag = await Tag.findOneAndDelete({ slug })
    return res.status(200).json({ tag })
  } catch (error) {
    return res.status(500).json({ message: errorHandler(error) })
  }
}
