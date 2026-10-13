const serializeIssue = (issue, requestingUserId) => {
  if (!issue) return null
  const obj = typeof issue.toObject === 'function'
    ? issue.toObject({ virtuals: true })
    : { ...issue }

  if (obj.photoId && !obj.photoUrl && process.env.BASE_URL) {
    obj.photoUrl = `${process.env.BASE_URL}/api/issues/${obj._id}/photo`
  }

  const upvotes = Array.isArray(obj.upvotes) ? obj.upvotes : []
  const upvoteCount = upvotes.length
  const hasUpvoted = requestingUserId
    ? upvotes.some(id => (id?._id || id)?.toString() === requestingUserId.toString())
    : false
  delete obj.upvotes
  return { ...obj, upvoteCount, hasUpvoted }
}
module.exports = serializeIssue
