const { Readable } = require('stream')
const { getBucket } = require('../config/gridfs')

const savePhoto = (buffer, filename, contentType) =>
  new Promise((resolve, reject) => {
    const uploadStream = getBucket().openUploadStream(filename, { contentType })
    Readable.from(buffer).pipe(uploadStream)
      .on('error', reject)
      .on('finish', () => resolve(uploadStream.id))
  })

const deletePhoto = async (fileId) => {
  if (!fileId) return
  try { await getBucket().delete(fileId) } catch (_) { /* already gone — fine */ }
}

module.exports = { savePhoto, deletePhoto }
