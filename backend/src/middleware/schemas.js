const { z } = require('zod')

// Auth schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters').trim(),
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128, 'Password must be at most 128 characters')
})

const loginSchema = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required')
})

// Issue schemas
const createIssueSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(150, 'Title must be at most 150 characters').trim(),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must be at most 2000 characters').trim().optional(),
  category: z.enum(['pothole', 'streetlight', 'garbage', 'water', 'water_leak', 'road_damage', 'sewage', 'other'], {
    errorMap: () => ({ message: 'Invalid category' })
  }),
  latitude: z.string().or(z.number()).optional(),
  longitude: z.string().or(z.number()).optional(),
  lat: z.string().or(z.number()).optional(),
  lng: z.string().or(z.number()).optional(),
  address: z.string().max(300, 'Address must be at most 300 characters').trim().optional()
}).refine(data => {
  const lat = data.latitude !== undefined ? Number(data.latitude) : (data.lat !== undefined ? Number(data.lat) : NaN)
  const lng = data.longitude !== undefined ? Number(data.longitude) : (data.lng !== undefined ? Number(data.lng) : NaN)
  return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}, { message: 'Latitude must be between -90 and 90, and longitude between -180 and 180' })

// Comment schema
const addCommentSchema = z.object({
  text: z.string().min(1, 'Comment cannot be empty').max(500, 'Comment must be at most 500 characters').trim()
})

// Status update schema
const validDepts = [
  'Roads & Infrastructure',
  'Street Lighting',
  'Sanitation',
  'Water & Sewerage',
  'General'
]

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'in-progress', 'resolved']).optional(),
  assignedDept: z.enum(validDepts).optional()
}).refine(data => data.status !== undefined || data.assignedDept !== undefined, {
  message: 'At least one of status or assignedDept must be provided'
})

module.exports = {
  registerSchema,
  loginSchema,
  createIssueSchema,
  addCommentSchema,
  updateStatusSchema
}
