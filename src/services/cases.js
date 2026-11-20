import { apiRequest } from './apiClient'
import { mockResponse } from './mock'
const useMock = import.meta.env.VITE_USE_MOCK !== 'false'

export async function getCases(filters = {}) {
  if (useMock) return mockResponse({ items: [], total: 0 })
  const query = new URLSearchParams(filters).toString()
  return apiRequest(`/api/cases${query ? `?${query}` : ''}`)
}
export async function createCase(payload) {
  if (useMock) return mockResponse({ caseNumber: '20481842', pin: '483920' }, 500)
  return apiRequest('/api/cases', { method: 'POST', body: JSON.stringify(payload) })
}
export async function getCase(id) {
  if (useMock) return mockResponse({ id, caseNumber: id, status: 'PENELAAHAN' })
  return apiRequest(`/api/cases/${id}`)
}
export async function takeCase(id) {
  if (useMock) return mockResponse({ ok: true })
  return apiRequest(`/api/cases/${id}/take`, { method: 'POST' })
}
