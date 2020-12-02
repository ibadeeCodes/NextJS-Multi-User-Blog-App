const User = require('../models/User')
const shortId = require('shortid')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
const mv = require('mv')

// @desc      SignUp User
// @route     POST /api/auth/signup
// @access    PUBLIC
exports.signup = async (req, res) => {
  const { name, email, password } = req.body
  try {
    const emailExist = await User.findOne({ email }).lean()
    if (emailExist) {
      return res
        .status(409)
        .json({ success: false, message: 'Email already exists' })
    }

    let username = shortId.generate()
    let profile = `${process.env.CLIENT_URL}/profile/${username}`

    let user = await User.create({ name, email, password, username, profile })

    if (user) {
      return res.status(200).json({
        success: true,
        message: 'Signed in successfully.',
      })
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error' })
  }
}

// @desc      SignIn User
// @route     POST /api/auth/signin
// @access    PUBLIC
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body
    // check if user exist

    let user = await User.findOne({ email })

    if (!user) {
      return res
        .status(409)
        .json({ sucess: false, message: 'Unregistered email. Please signup' })
    }

    let isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res
        .status(409)
        .json({ success: false, message: 'Password didnt match.' })
    }

    // if exist generate token
    let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })

    res.cookie('token', token, { expiresIn: '1d' })

    return res.status(200).json({
      success: true,
      token,
      message: 'Signin successfully',
      user,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Please check your internet connection.',
    })
  }
}

exports.signout = (req, res) => {
  res.clearCookie('token')
  return res
    .status(200)
    .json({ success: true, message: 'Signout successfully' })
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

exports.googleLogin = async (req, res) => {
  const idToken = req.body.tokenID

  const response = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  })

  const { email_verified, email, name, jti } = response.payload

  if (email_verified) {
    const userExist = await User.findOne({ email })
    if (userExist) {
      const token = jwt.sign({ _id: userExist._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      })

      res.cookie('token', token, { expiresIn: '1d' })

      return res.status(200).json({ token, user: userExist })
    } else {
      let username = shortId.generate()
      let profile = `${process.env.CLIENT_URL}/profile/${username}`
      let password = jti
      const user = await User.create({
        username,
        profile,
        email,
        name,
        password,
      })

      if (!user) {
        return res
          .status(400)
          .json({ success: false, error: 'Error while creating user' })
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      })

      res.cookie('token', token, { expiresIn: '1d' })

      // const { _id, name, email, role } = user

      return res.status(200).json({ token, user })
    }
  } else {
    return res
      .status(400)
      .json({ success: false, error: 'Google login failed.' })
  }
}

exports.updateUser = async (req, res) => {
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

      console.log(fields, 'fields')
      console.log(files)
      let { name, username, about } = fields

      if (!name || !name.length) {
        return res.status(400).json({
          success: false,
          message: 'Name field can not be empty.',
        })
      }

      if (!username || !username.length) {
        return res
          .status(400)
          .json({ success: false, message: 'Username is too short.' })
      }

      if (username) {
        let UsernameExist = await User.findOne({
          username,
          _id: { $ne: req.profile._id },
        }).lean()
        if (UsernameExist) {
          return res.status(400).json({
            success: false,
            message: 'This Username is already taken.',
          })
        }
      }

      let user = await User.findOne({ _id: req.profile._id })

      // Updating Fields.
      user.name = name
      user.username = username
      user.about = about

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
        fs.unlink(
          `${process.env.USER_PROFILE_UPLOAD_PATH}/${user.photo}`,
          (err) => {
            if (err) {
              console.log(err)
            } else {
              console.log('successfully deleted photo.')
            }
          }
        )

        // Create custom filename
        file.name = `profile_${req.user._id}${path.parse(file.name).ext}`

        user.photo = file.name

        mv(
          file.path,
          `${process.env.USER_PROFILE_UPLOAD_PATH}/${file.name}`,
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

      user.save()

      return res
        .status(200)
        .json({ success: true, message: 'User Profile Updated.', user })
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: 'Network error.' })
  }
}
