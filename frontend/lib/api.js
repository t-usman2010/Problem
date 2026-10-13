import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    if (error.response?.status === 429) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('app-toast', {
            detail: {
              message: error.response?.data?.message || 'Too many requests. Please slow down and try again shortly.',
              type: 'error'
            }
          })
        )
      }
    }
    return Promise.reject(error)
  }
)

export default api
