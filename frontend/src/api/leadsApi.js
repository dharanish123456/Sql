import api from '../utils/api'

function buildQuery(params) {
  const query = new URLSearchParams()
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      query.set(key, value)
    }
  })
  const out = query.toString()
  return out ? `?${out}` : ''
}

export async function getLeads(params = {}) {
  const response = await api.get(`/api/v1/leads${buildQuery(params)}`)
  return Array.isArray(response?.data) ? response.data : []
}

export async function getLeadById(id) {
  const response = await api.get(`/api/v1/leads/${id}`)
  return response?.data || null
}

export async function getLeadFilters() {
  const response = await api.get('/api/v1/leads/filters')
  return response?.data || {}
}

export async function getAssignableLeadGroups() {
  const response = await api.get('/api/v1/leads/assignable-groups')
  const rows = Array.isArray(response?.data) ? response.data : []
  return rows
    .map((row) => ({
      id: row?.id,
      name: row?.name || '',
    }))
    .filter((row) => row.id != null && row.name)
}

export async function createLead(payload) {
  const response = await api.post('/api/v1/leads', payload)
  return response?.data || {}
}

export async function updateLeadRowStatus(id, status) {
  const response = await api.patch(`/api/v1/leads/${id}/status`, { status })
  return response?.data || {}
}

export async function getAssignableAllocators(leadId) {
  const response = await api.get(`/api/v1/leads/${leadId}/assignable-allocators`)
  return Array.isArray(response?.data) ? response.data : []
}

export async function updateLeadAllocator(leadId, ownerUserId) {
  const response = await api.patch(`/api/v1/leads/${leadId}/allocator`, { ownerUserId })
  return response?.data || {}
}
