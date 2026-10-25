const test = require('node:test')
const assert = require('node:assert/strict')
const {
  sendReportSubmittedEmail,
  sendReportProcessingEmail,
  sendReportResolvedEmail
} = require('../src/services/emailService')

// Set NODE_ENV to test so jsonTransport is used
process.env.NODE_ENV = 'test'

test('sendReportSubmittedEmail dispatches confirmation email for new reports', async () => {
  const user = {
    name: 'Ahmed Khan',
    email: 'ahmed@example.com'
  }

  const issue = {
    _id: '671abc1234567890abcdef12',
    title: 'Broken Streetlight on 7th Avenue',
    category: 'streetlight',
    createdAt: new Date(),
    location: {
      address: '7th Avenue, G-7/2, Islamabad'
    }
  }

  const result = await sendReportSubmittedEmail(user, issue)
  assert.ok(result, 'Result should be returned from email dispatch')

  const parsed = JSON.parse(result.message)
  assert.equal(parsed.to[0].address, 'ahmed@example.com')
  assert.ok(parsed.subject.includes('Report Submitted'))
  assert.ok(parsed.subject.includes('Broken Streetlight on 7th Avenue'))
})

test('sendReportProcessingEmail dispatches notification when issue is in-progress', async () => {
  const user = {
    name: 'Sara Ali',
    email: 'sara@example.com'
  }

  const issue = {
    _id: '671abc1234567890abcdef34',
    title: 'Water Pipe Burst near Sector F-8',
    category: 'water',
    assignedDept: 'Water & Sewerage',
    createdAt: new Date(),
    location: {
      address: 'Sector F-8/4, Islamabad'
    }
  }

  const result = await sendReportProcessingEmail(user, issue)
  assert.ok(result)

  const parsed = JSON.parse(result.message)
  assert.equal(parsed.to[0].address, 'sara@example.com')
  assert.ok(parsed.subject.includes('In Processing'))
})

test('sendReportResolvedEmail dispatches notification when issue is marked resolved', async () => {
  const user = {
    name: 'Bilal Tariq',
    email: 'bilal@example.com'
  }

  const issue = {
    _id: '671abc1234567890abcdef56',
    title: 'Open Garbage Dump Cleared',
    category: 'garbage',
    assignedDept: 'Sanitation',
    createdAt: new Date(),
    location: {
      address: 'Sector I-9/1, Islamabad'
    }
  }

  const result = await sendReportResolvedEmail(user, issue)
  assert.ok(result)

  const parsed = JSON.parse(result.message)
  assert.equal(parsed.to[0].address, 'bilal@example.com')
  assert.ok(parsed.subject.includes('Resolved'))
})
