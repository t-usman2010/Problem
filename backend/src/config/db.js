const mongoose = require('mongoose')
const { initBucket } = require('./gridfs')

let connectionPromise = null

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI)
      .then(() => {
        initBucket()
        console.log('MongoDB connected, GridFS bucket ready')
      })
      .catch((error) => {
        connectionPromise = null
        throw error
      })
  }

  await connectionPromise
}

module.exports = connectDB
