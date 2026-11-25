import { apiRequest } from './apiClient'
import { mockResponse } from './mock'
const useMock = import.meta.env.VITE_USE_MOCK !== 'false'

export async function getDashboardSummary() {
  if (useMock) return mockResponse({ total: 15, verification: 1, assigned: 5, nearDeadline: 2, overdue: 1 })
  return apiRequest('/api/dashboard/summary')
}
export async function getDashboardDistribution() {
  if (useMock) return mockResponse({
    monthly: [2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    status: [
      { label: 'Dalam penanganan', count: 8 },
      { label: 'Menunggu keputusan', count: 1 },
      { label: 'Sanksi diputuskan', count: 1 },
      { label: 'Tidak terbukti / ditutup', count: 5 },
    ],
    violations: [
      { label: 'Seksual', count: 3 },
      { label: 'Psikis', count: 4 },
      { label: 'Perundungan', count: 4 },
      { label: 'Fisik', count: 3 },
      { label: 'Diskriminasi', count: 1 },
    ],
    workload: [
      { label: 'Satgas A', count: 5 },
      { label: 'Satgas B', count: 4 },
      { label: 'Satgas C', count: 4 },
      { label: 'Belum ditugaskan', count: 2 },
    ],
  })
  return apiRequest('/api/dashboard/distribution')
}
