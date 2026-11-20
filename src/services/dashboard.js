import { apiRequest } from './apiClient'
import { mockResponse } from './mock'
const useMock = import.meta.env.VITE_USE_MOCK !== 'false'

export async function getDashboardSummary() {
  if (useMock) return mockResponse({ total: 128, verification: 14, assigned: 7, nearDeadline: 6, overdue: 2 })
  return apiRequest('/api/dashboard/summary')
}
export async function getDashboardDistribution() {
  if (useMock) return mockResponse({ status: [], violations: [] })
  return apiRequest('/api/dashboard/distribution')
}
