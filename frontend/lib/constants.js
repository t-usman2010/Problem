export const CATEGORIES = [
  { value: 'pothole', label: 'Pothole', color: '#ef4444' },
  { value: 'streetlight', label: 'Streetlight', color: '#eab308' },
  { value: 'garbage', label: 'Garbage', color: '#22c55e' },
  { value: 'water', label: 'Water Issue', color: '#3b82f6' },
  { value: 'other', label: 'Other', color: '#6b7280' }
]

export const STATUSES = [
  { value: 'pending', label: 'Pending', color: '#ef4444' },
  { value: 'in-progress', label: 'In Progress', color: '#eab308' },
  { value: 'resolved', label: 'Resolved', color: '#22c55e' }
]

export const MAP_DEFAULTS = {
  center: [33.6844, 73.0479],
  zoom: 13
}

export const getCategoryColor = (category) => CATEGORIES.find(c => c.value === category)?.color ?? '#6b7280'
export const getStatusColor = (status) => STATUSES.find(s => s.value === status)?.color ?? '#ef4444'
export const getStatusOpacity = (status) => ({ pending: 1, 'in-progress': 0.8, resolved: 0.4 }[status] ?? 1)
