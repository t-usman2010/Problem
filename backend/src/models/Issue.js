const mongoose = require('mongoose')

const IssueSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: {
    type: String,
    enum: ['pothole', 'streetlight', 'garbage', 'water', 'other'],
    required: true
  },
  photoId: { type: mongoose.Schema.Types.ObjectId, default: null },
  photoContentType: { type: String, default: null },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number],
    address: { type: String }
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved'],
    default: 'pending'
  },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  assignedDept: {
    type: String,
    enum: {
      values: ['Roads & Infrastructure', 'Street Lighting', 'Sanitation', 'Water & Sewerage', 'General', null],
      message: '{VALUE} is not a valid department'
    },
    default: null
  },
  resolvedAt: { type: Date, default: null }
}, { timestamps: true })

// Virtual — computed, not stored
IssueSchema.virtual('photoUrl').get(function () {
  return this.photoId ? `${process.env.BASE_URL}/api/issues/${this._id}/photo` : null
})
IssueSchema.set('toJSON', { virtuals: true })
IssueSchema.set('toObject', { virtuals: true })

// Indexes
IssueSchema.index({ location: '2dsphere' })
IssueSchema.index({ category: 1, status: 1 })
IssueSchema.index({ title: 'text', description: 'text' })

module.exports = mongoose.model('Issue', IssueSchema)
