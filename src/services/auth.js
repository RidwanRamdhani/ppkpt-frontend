import { apiRequest } from './apiClient'
import { mockResponse } from './mock'

const useMock = import.meta.env.VITE_USE_MOCK !== 'false'

export async function login(credentials) {
  if (useMock) {
    const role = credentials.username.toLowerCase().includes('pejabat') ? 'PEJABAT' : 'SATGAS'
    return mockResponse({
      role,
      user: {
        name: credentials.username,
        id: role === 'SATGAS' ? 'satgas-a' : 'pejabat-1',
        teamName: role === 'SATGAS' ? 'Satgas A' : undefined,
      },
      mustChangePassword: credentials.password === 'GantiPassword123!',
    }, 450)
  }
  return apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) })
}
export async function logout() {
  if (useMock) return mockResponse({ ok: true })
  return apiRequest('/api/auth/logout', { method: 'POST' })
}
export async function changePassword(payload) {
  if (useMock) return mockResponse({ ok: true })
  return apiRequest('/api/auth/password', { method: 'PUT', body: JSON.stringify(payload) })
}
