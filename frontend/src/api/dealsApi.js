import api from '../utils/api'

export async function getDeals() {
  const response = await api.get('/api/v1/deals')
  return Array.isArray(response?.data) ? response.data : []
}

export async function getDealById(id) {
  const response = await api.get(`/api/v1/deals/${id}`)
  return response?.data || null
}

export async function updateDeal(id, payload) {
  const response = await api.patch(`/api/v1/deals/${id}`, payload)
  return response?.data || null
}

export async function deleteDeal(id) {
  await api.delete(`/api/v1/deals/${id}`)
}
