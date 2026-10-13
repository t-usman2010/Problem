const mongoose = require('mongoose')
const { initBucket } = require('./gridfs')

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  initBucket()
  console.log('MongoDB connected, GridFS bucket ready')
}

module.exports = connectDB
