import { apiRequest } from './apiClient'
import { mockResponse } from './mock'

const useMock = import.meta.env.VITE_USE_MOCK !== 'false'

export async function login(credentials) {
  if (useMock) return mockResponse({ role: credentials.username.includes('pejabat') ? 'PEJABAT' : 'SATGAS', user: { name: credentials.username } }, 450)
  return apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) })
}
export async function logout() {
  if (useMock) return mockResponse({ ok: true })
  return apiRequest('/api/auth/logout', { method: 'POST' })
}
