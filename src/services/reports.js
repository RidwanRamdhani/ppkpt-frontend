import { apiRequest } from './apiClient'
import { mockResponse } from './mock'
const useMock = import.meta.env.VITE_USE_MOCK !== 'false'

export async function createReport(formData) {
  if (useMock) return mockResponse({ caseNumber: '20481735', pin: '493027' }, 500)
  return apiRequest('/api/reports', { method: 'POST', body: formData })
}
export async function getReportStatus(ticket, pin) {
  if (useMock) return mockResponse({ caseNumber: ticket, status: 'PEMERIKSAAN', deadlineLabel: 'Sisa 7 hari' }, 450)
  return apiRequest('/api/status', { method: 'POST', body: JSON.stringify({ ticket, pin }) })
}
export async function completeReport(ticket, payload) {
  if (useMock) return mockResponse({ ok: true }, 400)
  return apiRequest(`/api/reports/${ticket}/complete`, { method: 'PUT', body: payload instanceof FormData ? payload : JSON.stringify(payload) })
}
