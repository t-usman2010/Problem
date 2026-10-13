import test from 'node:test'
import assert from 'node:assert/strict'
import {
  CATEGORIES,
  STATUSES,
  MAP_DEFAULTS,
  getCategoryColor,
  getStatusColor,
  getStatusOpacity
} from '../lib/constants.js'

test('getCategoryColor returns exact design token colors', () => {
  assert.equal(getCategoryColor('pothole'), '#ef4444')
  assert.equal(getCategoryColor('streetlight'), '#eab308')
  assert.equal(getCategoryColor('garbage'), '#22c55e')
  assert.equal(getCategoryColor('water'), '#3b82f6')
  assert.equal(getCategoryColor('other'), '#6b7280')
  assert.equal(getCategoryColor('unknown'), '#6b7280')
})

test('getStatusColor returns exact status badge colors', () => {
  assert.equal(getStatusColor('pending'), '#ef4444')
  assert.equal(getStatusColor('in-progress'), '#eab308')
  assert.equal(getStatusColor('resolved'), '#22c55e')
  assert.equal(getStatusColor('unknown'), '#ef4444')
})

test('getStatusOpacity returns defined marker opacities without altering fill color', () => {
  assert.equal(getStatusOpacity('pending'), 1)
  assert.equal(getStatusOpacity('in-progress'), 0.8)
  assert.equal(getStatusOpacity('resolved'), 0.4)
  assert.equal(getStatusOpacity('unknown'), 1)
})

test('MAP_DEFAULTS contains valid center and zoom', () => {
  assert.equal(Array.isArray(MAP_DEFAULTS.center), true)
  assert.equal(MAP_DEFAULTS.center.length, 2)
  assert.equal(typeof MAP_DEFAULTS.center[0], 'number')
  assert.equal(typeof MAP_DEFAULTS.center[1], 'number')
  assert.equal(typeof MAP_DEFAULTS.zoom, 'number')
})

test('CATEGORIES and STATUSES have valid schema structures', () => {
  assert.equal(CATEGORIES.length, 5)
  CATEGORIES.forEach(cat => {
    assert.ok(cat.value)
    assert.ok(cat.label)
    assert.ok(cat.color)
  })

  assert.equal(STATUSES.length, 3)
  STATUSES.forEach(st => {
    assert.ok(st.value)
    assert.ok(st.label)
    assert.ok(st.color)
  })
})
