const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const userSchema = new Schema(
  {
    username: {
      type: String,
      max: 32,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      max: 32,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    photo: {
      type: String,
    },
    about: {
      type: String,
    },
    resetPasswordLink: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

module.exports = mongoose.model('User', userSchema)
