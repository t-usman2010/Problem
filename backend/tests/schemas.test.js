const test = require('node:test')
const assert = require('node:assert/strict')
const { createIssueSchema, updateStatusSchema } = require('../src/middleware/schemas')

test('createIssueSchema validates correct issue payload', () => {
  const valid = {
    title: 'Huge pothole',
    description: 'Deep pothole damaging cars',
    category: 'pothole',
    lat: 33.6844,
    lng: 73.0479,
    address: 'Blue Area, Islamabad'
  }

  const parsed = createIssueSchema.safeParse(valid)
  assert.equal(parsed.success, true)
})

test('createIssueSchema rejects invalid coordinates or category', () => {
  const invalid = {
    title: 'Huge pothole',
    description: 'Deep pothole damaging cars',
    category: 'flying_car',
    lat: 100, // Latitude cannot exceed 90
    lng: 73.0479
  }

  const parsed = createIssueSchema.safeParse(invalid)
  assert.equal(parsed.success, false)
})

test('updateStatusSchema allows valid department and status', () => {
  const valid = {
    status: 'in-progress',
    assignedDept: 'Roads & Infrastructure'
  }

  const parsed = updateStatusSchema.safeParse(valid)
  assert.equal(parsed.success, true)
})

test('updateStatusSchema rejects arbitrary department string', () => {
  const invalid = {
    status: 'in-progress',
    assignedDept: 'Fake Nonexistent Dept'
  }

  const parsed = updateStatusSchema.safeParse(invalid)
  assert.equal(parsed.success, false)
})
