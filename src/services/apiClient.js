const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: options.body instanceof FormData
      ? options.headers
      : { 'Content-Type': 'application/json', ...options.headers },
  })

  let payload = null
  try { payload = await response.json() } catch { payload = null }

  if (!response.ok) {
    const error = new Error(payload?.message || 'Terjadi kesalahan pada sistem')
    error.status = response.status
    error.payload = payload
    throw error
  }
  return payload
}

export function normalizeError(error) {
  return { status: error?.status || 500, message: error?.message || 'Terjadi kesalahan pada sistem' }
}
