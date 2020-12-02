const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_CLOUD, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })

    console.log(`MongoDB Connected`)
  } catch (error) {
    console.log('Connection Error :(')
  }
}

module.exports = connectDB
