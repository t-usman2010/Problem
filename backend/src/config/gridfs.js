const mongoose = require('mongoose')
const { GridFSBucket } = require('mongodb')

let bucket = null

const initBucket = () => {
  bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'photos' })
}

const getBucket = () => {
  if (!bucket) throw new Error('GridFS bucket not initialized — connectDB() must run first')
  return bucket
}

module.exports = { initBucket, getBucket }
