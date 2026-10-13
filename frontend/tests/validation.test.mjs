import test from 'node:test'
import assert from 'node:assert/strict'
import { loginSchema, registerSchema, reportSchema } from '../lib/validation.js'

test('loginSchema validates valid credentials', () => {
  const result = loginSchema.safeParse({
    email: 'user@example.com',
    password: 'password123'
  })
  assert.equal(result.success, true)
})

test('loginSchema rejects invalid email or short password', () => {
  const invalidEmail = loginSchema.safeParse({
    email: 'not-an-email',
    password: 'password123'
  })
  assert.equal(invalidEmail.success, false)

  const shortPassword = loginSchema.safeParse({
    email: 'user@example.com',
    password: '123'
  })
  assert.equal(shortPassword.success, false)
})

test('registerSchema validates valid user registration', () => {
  const result = registerSchema.safeParse({
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'securePassword!'
  })
  assert.equal(result.success, true)
})

test('registerSchema rejects short name', () => {
  const result = registerSchema.safeParse({
    name: 'J',
    email: 'jane@example.com',
    password: 'securePassword!'
  })
  assert.equal(result.success, false)
})

test('reportSchema validates civic issue report', () => {
  const result = reportSchema.safeParse({
    title: 'Broken streetlight on Main Blvd',
    description: 'The light has been flickering and went completely dark last night.',
    category: 'streetlight',
    latitude: 33.6844,
    longitude: 73.0479,
    address: 'Main Blvd, Sector G-9, Islamabad'
  })
  assert.equal(result.success, true)
})

test('reportSchema rejects invalid category or missing coordinates', () => {
  const invalidCat = reportSchema.safeParse({
    title: 'Broken streetlight on Main Blvd',
    category: 'invalid_cat',
    latitude: 33.6844,
    longitude: 73.0479
  })
  assert.equal(invalidCat.success, false)

  const missingCoords = reportSchema.safeParse({
    title: 'Broken streetlight on Main Blvd',
    category: 'streetlight'
  })
  assert.equal(missingCoords.success, false)
})
