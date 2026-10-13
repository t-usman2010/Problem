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
  latitude: z.string().or(z.number()).transform(Number).pipe(
    z.number({ invalid_type_error: 'Latitude must be a number' })
      .min(-90, 'Latitude must be between -90 and 90')
      .max(90, 'Latitude must be between -90 and 90')
  ),
  longitude: z.string().or(z.number()).transform(Number).pipe(
    z.number({ invalid_type_error: 'Longitude must be a number' })
      .min(-180, 'Longitude must be between -180 and 180')
      .max(180, 'Longitude must be between -180 and 180')
  ),
  address: z.string().max(300, 'Address must be at most 300 characters').trim().optional()
})

// Comment schema
const addCommentSchema = z.object({
  text: z.string().min(1, 'Comment cannot be empty').max(500, 'Comment must be at most 500 characters').trim()
})

// Status update schema
const updateStatusSchema = z.object({
  status: z.enum(['pending', 'in-progress', 'resolved'], {
    errorMap: () => ({ message: 'Status must be pending, in-progress, or resolved' })
  }),
  assignedDept: z.enum([
    'Roads & Infrastructure',
    'Street Lighting',
    'Sanitation',
    'Water & Sewerage',
    'General'
  ], {
    errorMap: () => ({ message: 'Invalid department' })
  }).optional().nullable()
})

// User role schema
const updateRoleSchema = z.object({
  role: z.enum(['citizen', 'admin'], {
    errorMap: () => ({ message: 'Role must be citizen or admin' })
  })
})

module.exports = {
  registerSchema,
  loginSchema,
  createIssueSchema,
  addCommentSchema,
  updateStatusSchema,
  updateRoleSchema
}
