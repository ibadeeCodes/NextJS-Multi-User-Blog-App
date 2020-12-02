const Blog = require('../models/Blog')
const User = require('../models/User')
const Category = require('../models/Category')
const { errorHandler } = require('../helpers/dbErrorHandler')
const Tag = require('../models/Tag')
const formidable = require('formidable')
const slugify = require('slugify')
const stripHtml = require('string-strip-html')
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const mv = require('mv')

exports.create = async (req, res) => {
  try {
    let form = formidable.IncomingForm()

    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Image could not upload',
        })
      }

      let { title, body, categories, tags } = fields

      if (!title || !title.length) {
        return res.status(400).json({
          success: false,
          message: 'title is required',
        })
      }

      if (!body || body.length < 200) {
        return res
          .status(400)
          .json({ success: false, message: 'content is too short.' })
      }

      if (!categories || categories.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one category is required',
        })
      }

      if (!tags || tags.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one tag is required',
        })
      }

      let slug = slugify(title).toLowerCase()

      // get categories.
      let listOfCategories = categories && categories.split(',')

      // get tags.
      let listOfTags = tags && tags.split(',')

      // check if photo exist.
      if (!files.photo) {
        return res
          .status(400)
          .json({ success: false, message: 'Please upload an image.' })
      }

      let file = files.photo

      // Make sure the image is a photo.
      if (!file.type.startsWith('image')) {
        return res
          .status(400)
          .json({ success: false, message: 'Only images are allowed.' })
      }

      // size less than 1mb.
      if (file.size > 1000000) {
        return res
          .status(400)
          .json({ success: false, message: 'Image must be less than 1mb.' })
      }

      // Create custom filename
      file.name = `${slug}_${req.user._id}${path.parse(file.name).ext}`

      let { result } = stripHtml(body.substring(0, 160))

      let blog = await Blog.create({
        title,
        body,
        slug,
        photo: file.name,
        mtitle: `${title} | ${process.env.APP_NAME}`,
        mdesc: result,
        excerpt: body.substring(0, 160).concat(' ...'),
        categories: listOfCategories,
        tags: listOfTags,
        postedBy: req.user._id,
      })

      if (!blog) {
        return res
          .status(200)
          .json({ success: false, message: 'Unable to create blog.' })
      }

      mv(
        file.path,
        `${process.env.FILE_UPLOAD_PATH}/${file.name}`,
        function (err) {
          if (err) {
            console.error(err)
            return res
              .status(400)
              .json({ success: false, message: 'error uploading file.' })
          }
        }
      )

      return res
        .status(200)
        .json({ success: true, message: 'Blog created.', blog })
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Network error.' })
  }
}

exports.list = async (req, res) => {
  try {
    let blogs = await Blog.find()
      .populate('categories', '_id name slug')
      .populate('tags', '_id name slug')
      .populate('postedBy', '_id name username')
      .select(
        '_id title slug excerpt categories tags postedBy createdAt updatedAt'
      )

    return res.status(200).json({ success: true, blogs })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' })
  }
}

// get blogs on the basis of limit from req.body and then fetch all tags and categories.
exports.listAllBlogsCategoriesTags = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 10
  let skip = req.body.skip ? parseInt(req.body.skip) : 0

  let blogs
  let categories
  let tags

  Blog.find({})
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name username profile')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select(
      '_id title slug excerpt categories tags photo postedBy createdAt updatedAt'
    )
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        })
      }
      blogs = data // blogs
      // get all categories
      Category.find({}).exec((err, c) => {
        if (err) {
          return res.json({
            error: errorHandler(err),
          })
        }
        categories = c // categories
        // get all tags
        Tag.find({}).exec((err, t) => {
          if (err) {
            return res.json({
              error: errorHandler(err),
            })
          }
          tags = t
          // return all blogs categories tags
          res.json({ blogs, categories, tags, size: blogs.length })
        })
      })
    })
}

exports.read = async (req, res) => {
  const slug = req.params.slug.toLowerCase()
  try {
    const blog = await Blog.findOne({ slug })
      // .select("-photo")
      .populate('categories', '_id name slug')
      .populate('tags', '_id name slug')
      .populate('postedBy', '_id name username')
      .select(
        '_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt photo'
      )

    return res.status(200).json({ blog })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase()
  Blog.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      })
    }
    res.json({
      message: 'Blog deleted successfully',
    })
  })
}

exports.update = async (req, res) => {
  try {
    let form = new formidable.IncomingForm()

    form.keepExtensions = true

    let blog = await Blog.findOne({ slug: req.params.slug })

    if (!blog) {
      res.status(200).json({ sucess: false, message: 'No blog found.' })
    }

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: 'Image could not upload',
        })
      }
      let slugBeforeMerge = blog.slug

      blog = _.merge(blog, fields)

      const { body, title, categories, tags } = fields

      if (body) {
        blog.excerpt = body.substring(0, 160).concat(' ...')
        let { result } = stripHtml(body.substring(0, 160))
        blog.mdesc = result
      }

      if (categories) {
        console.log(categories)
        blog.categories = categories && categories.split(',')
      }

      if (tags) {
        blog.tags = tags && tags.split(',')
      }

      // check if photo exist.
      if (files.photo) {
        let file = files.photo

        // Make sure the image is a photo.
        if (!file.type.startsWith('image')) {
          return res
            .status(400)
            .json({ success: false, message: 'Only images are allowed.' })
        }

        // size less than 1mb.
        if (file.size > 1000000) {
          return res
            .status(400)
            .json({ success: false, message: 'Image must be less than 1mb.' })
        }

        // Delete old photo of blog from public folder.
        fs.unlink(`${process.env.FILE_UPLOAD_PATH}/${blog.photo}`, (err) => {
          if (err) {
            console.log(err)
          } else {
            console.log('successfully deleted photo')
          }
        })

        // now save new photo

        // Create custom filename
        file.name = `${slugBeforeMerge}_${req.user._id}${
          path.parse(file.name).ext
        }`

        blog.photo = file.name

        mv(
          file.path,
          `${process.env.FILE_UPLOAD_PATH}/${file.name}`,
          function (err) {
            if (err) {
              console.error(err)
              return res
                .status(400)
                .json({ success: false, message: 'error uploading file.' })
            }
          }
        )
      }

      blog.save()

      return res
        .status(200)
        .json({ success: true, message: 'Blog updated successfully.', blog })
    })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error.' })
  }
}

exports.blogPhoto = async (req, res) => {
  try {
    let blog = await Blog.findOne({ slug: req.params.slug })
      .lean()
      .select('_id photo')

    if (!blog) {
      return res
        .status(400)
        .json({ success: false, message: 'Unable to fetch blog photo.' })
    }

    return res.status(200).json({ success: true, blog })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error.' })
  }
}

exports.SearchBlogs = async (req, res) => {
  const { search } = req.query

  try {
    if (search) {
      const blogs = await Blog.find({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { body: { $regex: search, $options: 'i' } },
        ],
      }).select('title slug')

      if (!blogs) {
        return res
          .status(400)
          .json({ success: false, message: 'No blogs found' })
      }

      return res.status(200).json({ success: true, blogs })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'No Internet Connection.' })
  }
}

// List User Blogs...

exports.listBlogUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .lean()
      .select('_id')

    const blogs = await Blog.find({ postedBy: user._id })

    if (blogs.length < 1) {
      return res.status(200).json({ success: true, message: 'No blogs found.' })
    }

    return res.status(200).json({ success: true, blogs })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error.' })
  }
}
