const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
  issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, trim: true, maxlength: 500 }
}, { timestamps: true })

module.exports = mongoose.model('Comment', CommentSchema)
