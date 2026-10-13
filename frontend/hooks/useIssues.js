'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import api from '@/lib/api'
import { useSocket } from '@/context/SocketContext'

export function useIssues(filters = {}) {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { socket } = useSocket()
  const abortRef = useRef(null)

  const fetchIssues = useCallback(async (params = {}) => {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      setLoading(true)
      setError(null)
      const queryParams = new URLSearchParams()
      if (params.category && params.category !== 'all') queryParams.set('category', params.category)
      if (params.status && params.status !== 'all') queryParams.set('status', params.status)
      if (params.lat) queryParams.set('lat', params.lat)
      if (params.lng) queryParams.set('lng', params.lng)
      if (params.radius) queryParams.set('radius', params.radius)

      const endpoint = params.lat ? '/issues/nearby' : '/issues'
      const res = await api.get(`${endpoint}?${queryParams.toString()}`, {
        signal: controller.signal
      })
      setIssues(res.data.issues || res.data)
    } catch (err) {
      if (err.name !== 'CanceledError') {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIssues(filters)
    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, [filters.category, filters.status, filters.lat, filters.lng])

  // Socket listeners - FUNCTIONAL updates to avoid stale closures
  useEffect(() => {
    if (!socket) return

    const handleNew = (issue) => {
      setIssues(prev => [issue, ...prev])
    }
    const handleUpdated = (updated) => {
      setIssues(prev => prev.map(i => i._id === updated._id ? { ...i, ...updated } : i))
    }
    const handleDeleted = ({ id }) => {
      setIssues(prev => prev.filter(i => i._id !== id))
    }

    socket.on('issue:new', handleNew)
    socket.on('issue:updated', handleUpdated)
    socket.on('issue:deleted', handleDeleted)

    return () => {
      socket.off('issue:new', handleNew)
      socket.off('issue:updated', handleUpdated)
      socket.off('issue:deleted', handleDeleted)
    }
  }, [socket])

  return { issues, loading, error, refetch: fetchIssues }
}
