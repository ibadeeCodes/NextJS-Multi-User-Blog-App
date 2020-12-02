const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tagSchema = new Schema(
  {
    name: {
      type: String,
      max: 32,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Tag', tagSchema)
