require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./src/models/User')
const Issue = require('./src/models/Issue')
const Comment = require('./src/models/Comment')
const { initBucket, getBucket } = require('./src/config/gridfs')
const { savePhoto } = require('./src/services/photoService')

const ISLAMABAD_COORDS = [
  { lat: 33.6844, lng: 73.0479, address: 'Blue Area, Islamabad' },
  { lat: 33.7215, lng: 73.0433, address: 'F-6, Islamabad' },
  { lat: 33.7294, lng: 73.0931, address: 'F-7, Islamabad' },
  { lat: 33.6995, lng: 73.0363, address: 'G-9, Islamabad' },
  { lat: 33.7110, lng: 73.0584, address: 'F-8, Islamabad' },
  { lat: 33.6938, lng: 73.0651, address: 'G-8, Islamabad' },
  { lat: 33.7380, lng: 73.0845, address: 'F-10, Islamabad' },
  { lat: 33.6607, lng: 73.0467, address: 'I-8, Islamabad' },
  { lat: 33.6539, lng: 73.0197, address: 'I-10, Islamabad' },
  { lat: 33.7070, lng: 73.0736, address: 'G-6, Islamabad' },
  { lat: 33.7469, lng: 73.0536, address: 'F-11, Islamabad' },
  { lat: 33.6756, lng: 73.0725, address: 'H-8, Islamabad' },
  { lat: 33.6623, lng: 73.0833, address: 'H-9, Islamabad' },
  { lat: 33.7164, lng: 73.0351, address: 'F-5, Islamabad' },
  { lat: 33.7376, lng: 73.0375, address: 'E-11, Islamabad' },
  { lat: 33.6900, lng: 73.0260, address: 'G-10, Islamabad' },
  { lat: 33.6699, lng: 73.0130, address: 'I-9, Islamabad' },
  { lat: 33.7520, lng: 73.0160, address: 'E-7, Islamabad' },
  { lat: 33.7350, lng: 73.0650, address: 'F-6/1, Islamabad' },
  { lat: 33.6810, lng: 73.0580, address: 'H-8/4, Islamabad' },
  { lat: 33.7000, lng: 73.0800, address: 'G-7, Islamabad' },
  { lat: 33.7200, lng: 73.0700, address: 'F-7/2, Islamabad' },
  { lat: 33.7100, lng: 73.0500, address: 'F-8/3, Islamabad' },
  { lat: 33.6950, lng: 73.0450, address: 'G-9/4, Islamabad' },
  { lat: 33.6850, lng: 73.0350, address: 'G-11, Islamabad' },
  { lat: 33.7050, lng: 73.0300, address: 'G-10/2, Islamabad' },
  { lat: 33.6780, lng: 73.0680, address: 'H-8/2, Islamabad' },
  { lat: 33.6650, lng: 73.0550, address: 'I-8/3, Islamabad' },
  { lat: 33.7450, lng: 73.0750, address: 'F-10/3, Islamabad' },
  { lat: 33.7300, lng: 73.0500, address: 'F-6/4, Islamabad' },
  { lat: 33.6750, lng: 73.0400, address: 'G-11/4, Islamabad' },
  { lat: 33.7150, lng: 73.0600, address: 'F-8/1, Islamabad' },
  { lat: 33.7250, lng: 73.0800, address: 'F-7/4, Islamabad' },
  { lat: 33.6900, lng: 73.0550, address: 'G-8/4, Islamabad' },
  { lat: 33.6550, lng: 73.0300, address: 'I-10/4, Islamabad' },
  { lat: 33.7400, lng: 73.0400, address: 'E-11/2, Islamabad' },
  { lat: 33.7000, lng: 73.0650, address: 'G-7/2, Islamabad' },
  { lat: 33.6800, lng: 73.0500, address: 'H-8/1, Islamabad' },
  { lat: 33.7100, lng: 73.0400, address: 'F-8/2, Islamabad' },
  { lat: 33.6950, lng: 73.0700, address: 'G-8/1, Islamabad' }
]

const CATEGORIES = ['pothole', 'streetlight', 'garbage', 'water', 'other']
const _DEPARTMENTS = ['Roads & Infrastructure', 'Street Lighting', 'Sanitation', 'Water & Sewerage', 'General']
const DEPT_BY_CATEGORY = {
  pothole: 'Roads & Infrastructure',
  streetlight: 'Street Lighting',
  garbage: 'Sanitation',
  water: 'Water & Sewerage',
  other: 'General'
}

const ISSUE_TITLES = [
  'Large pothole on main road', 'Broken streetlight near park', 'Garbage pile overflowing',
  'Water leak from main pipe', 'Damaged sidewalk tiles', 'Flickering street lamp',
  'Illegal dumping site', 'Sewage overflow on street', 'Cracked road surface',
  'Non-functional traffic light', 'Trash bins not emptied', 'Water supply disruption',
  'Fallen tree blocking road', 'Burnt out streetlight', 'Construction debris left on road',
  'Open manhole cover missing', 'Stray animal issue', 'Noise complaint from construction',
  'Flooded underpass after rain', 'Broken water meter', 'Pothole causing accidents',
  'Street light pole leaning', 'Waste not collected for days', 'Contaminated water supply',
  'Road markings faded', 'Multiple streetlights out', 'Medical waste dumped openly',
  'Burst water pipeline', 'Uneven road speed bumps', 'Park lights not working',
  'Overflowing drainage canal', 'Low water pressure area', 'Sinkhole forming on road',
  'Street light timer malfunction', 'Plastic waste in green belt', 'Rusty water from taps',
  'Road cave-in near school', 'Vandalized light fixtures', 'Household waste on footpath',
  'Fire hydrant leaking'
]

const DESCRIPTIONS = [
  'This has been here for weeks and is getting worse. Several vehicles have been damaged.',
  'This area becomes very dark at night making it unsafe for pedestrians.',
  'The waste has been accumulating for over a week. Strong odor affecting nearby residents.',
  'Water has been running continuously for days. Major wastage of water resources.',
  'Multiple complaints filed but no action taken. Need urgent attention.',
  'The situation is deteriorating rapidly. Immediate intervention required.',
  'Children play in this area and it poses a serious safety hazard.',
  'Residents have been complaining about this for a long time.',
  'This is near a school zone and needs priority fixing.',
  'The problem worsens during rainy season. Please fix before monsoon.',
  'Several elderly residents have tripped and fallen due to this issue.',
  'This is causing traffic congestion during peak hours.',
  'Health hazard for the entire neighborhood. Please address urgently.',
  'This has been reported multiple times but remains unresolved.',
  'New issue spotted today. Needs assessment and quick resolution.'
]

const COMMENTS = [
  'I can confirm this issue. Saw it today.',
  'This needs urgent attention!',
  'I reported the same issue last month.',
  'When will this be fixed?',
  'Thank you for reporting this.',
  'The department should prioritize this area.',
  'I live nearby and this affects us daily.',
  'Please update us on the progress.',
  'This is getting worse every day.',
  'Finally someone reported this!'
]

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)]
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const makeCategorySvgBuffer = (category, title) => {
  const colors = {
    pothole: '#ef4444',
    streetlight: '#eab308',
    garbage: '#22c55e',
    water: '#3b82f6',
    other: '#6b7280'
  }
  const color = colors[category] || '#6b7280'
  const cleanTitle = (title || 'Civic Issue').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect width="800" height="600" fill="#1a1d27"/>
    <rect y="580" width="800" height="20" fill="${color}"/>
    <circle cx="400" cy="240" r="80" fill="${color}" opacity="0.2"/>
    <circle cx="400" cy="240" r="50" fill="${color}"/>
    <text x="400" y="380" font-family="sans-serif" font-size="28" font-weight="bold" fill="#f0f0f0" text-anchor="middle">${category.toUpperCase()} REPORT</text>
    <text x="400" y="420" font-family="sans-serif" font-size="18" fill="#8b8fa8" text-anchor="middle">${cleanTitle}</text>
  </svg>`
  return Buffer.from(svg)
}

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    initBucket()
    try {
      const bucket = getBucket()
      const existingFiles = await bucket.find().toArray()
      for (const file of existingFiles) {
        await bucket.delete(file._id).catch(() => {})
      }
    } catch (_) {}

    // Clear existing data
    await User.deleteMany({})
    await Issue.deleteMany({})
    await Comment.deleteMany({})
    console.log('Cleared existing data')

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@civicapp.com',
      password: 'admin123',
      role: 'admin'
    })

    const citizens = await User.create([
      { name: 'Ahmed Khan', email: 'ahmed@example.com', password: 'password123', role: 'citizen' },
      { name: 'Sara Ali', email: 'sara@example.com', password: 'password123', role: 'citizen' },
      { name: 'Usman Malik', email: 'usman@example.com', password: 'password123', role: 'citizen' },
      { name: 'Fatima Noor', email: 'fatima@example.com', password: 'password123', role: 'citizen' }
    ])

    console.log('Created users: 1 admin + 4 citizens')

    // Create 40 issues
    const issues = []
    const allCitizenIds = citizens.map(c => c._id)

    for (let i = 0; i < 40; i++) {
      const coord = ISLAMABAD_COORDS[i]
      const category = CATEGORIES[i % 5]

      // Status distribution: ~40% pending, ~35% in-progress, ~25% resolved
      let status, assignedDept = null, resolvedAt = null
      const rand = Math.random()
      if (rand < 0.4) {
        status = 'pending'
      } else if (rand < 0.75) {
        status = 'in-progress'
        assignedDept = DEPT_BY_CATEGORY[category]
      } else {
        status = 'resolved'
        assignedDept = DEPT_BY_CATEGORY[category]
      }

      // Create date spread over last 30 days
      const daysAgo = randomInt(1, 30)
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

      if (status === 'resolved') {
        // resolvedAt spread from a few hours to a few days after createdAt
        const hoursToResolve = randomInt(4, 120) // 4 hours to 5 days
        resolvedAt = new Date(createdAt.getTime() + hoursToResolve * 60 * 60 * 1000)
      }

      const reportedBy = allCitizenIds[i % 4]

      // Some issues get upvotes
      const upvoteList = []
      if (Math.random() > 0.5) {
        const numUpvotes = randomInt(1, 4)
        const shuffled = [...allCitizenIds, admin._id].sort(() => 0.5 - Math.random())
        for (let u = 0; u < numUpvotes && u < shuffled.length; u++) {
          if (shuffled[u].toString() !== reportedBy.toString()) {
            upvoteList.push(shuffled[u])
          }
        }
      }

      const photoBuffer = makeCategorySvgBuffer(category, ISSUE_TITLES[i])
      const photoId = await savePhoto(photoBuffer, `${category}-${i + 1}.svg`, 'image/svg+xml')

      const issue = await Issue.create({
        title: ISSUE_TITLES[i],
        description: randomFrom(DESCRIPTIONS),
        category,
        photoId,
        photoContentType: 'image/svg+xml',
        location: {
          type: 'Point',
          coordinates: [coord.lng, coord.lat],
          address: coord.address
        },
        status,
        reportedBy,
        upvotes: upvoteList,
        assignedDept,
        resolvedAt,
        createdAt,
        updatedAt: createdAt
      })

      issues.push(issue)
    }

    console.log(`Created ${issues.length} issues`)

    // Add comments to some issues
    const commentsToCreate = []
    for (let i = 0; i < 15; i++) {
      const issue = issues[randomInt(0, issues.length - 1)]
      const commenter = allCitizenIds[randomInt(0, allCitizenIds.length - 1)]
      commentsToCreate.push({
        issueId: issue._id,
        userId: commenter,
        text: randomFrom(COMMENTS)
      })
    }
    await Comment.create(commentsToCreate)
    console.log(`Created ${commentsToCreate.length} comments`)

    console.log('\n--- Seed Complete ---')
    console.log('Admin login: admin@civicapp.com / admin123')
    console.log('Citizen logins: ahmed@example.com, sara@example.com, usman@example.com, fatima@example.com / password123')

    await mongoose.connection.close()
    process.exit(0)
  } catch (err) {
    console.error('Seed error:', err)
    await mongoose.connection.close()
    process.exit(1)
  }
}

seed()
