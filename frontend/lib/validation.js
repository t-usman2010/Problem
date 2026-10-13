import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const reportSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().optional(),
  category: z.enum(['pothole', 'streetlight', 'garbage', 'water', 'other'], {
    required_error: 'Please select a category'
  }),
  latitude: z.number({ required_error: 'Please select a location on the map' }),
  longitude: z.number({ required_error: 'Please select a location on the map' }),
  address: z.string().optional()
})
