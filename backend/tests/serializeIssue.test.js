const test = require('node:test')
const assert = require('node:assert/strict')
const serializeIssue = require('../src/utils/serializeIssue')

test('serializeIssue handles plain objects (.lean())', () => {
  const plain = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Pothole on Main St',
    upvotes: ['user1', 'user2']
  }

  const result = serializeIssue(plain, 'user1')
  assert.equal(result.title, 'Pothole on Main St')
  assert.equal(result.upvoteCount, 2)
  assert.equal(result.hasUpvoted, true)
  assert.equal(result.upvotes, undefined)
})

test('serializeIssue handles Mongoose toObject() models', () => {
  const mockDoc = {
    _id: '507f1f77bcf86cd799439012',
    title: 'Broken Streetlight',
    upvotes: ['user2'],
    toObject() {
      return {
        _id: this._id,
        title: this.title,
        upvotes: [...this.upvotes]
      }
    }
  }

  const result = serializeIssue(mockDoc, 'user1')
  assert.equal(result.upvoteCount, 1)
  assert.equal(result.hasUpvoted, false)
})

test('serializeIssue computes photoUrl if photoId is present', () => {
  process.env.BASE_URL = 'http://localhost:5000'
  const plain = {
    _id: 'issue123',
    photoId: 'photo456',
    upvotes: []
  }

  const result = serializeIssue(plain, null)
  assert.equal(result.photoUrl, 'http://localhost:5000/api/issues/issue123/photo')
})
