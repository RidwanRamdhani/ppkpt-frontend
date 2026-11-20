import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'
import { login as authLogin } from '../../services/auth'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(useLocation().state?.message || '')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  async function submit(event) {
    event.preventDefault()
    setLoading(true); setError('')
    try {
      const result = await authLogin({ username, password })
      login(result.role, result.user)
      navigate(result.role === 'SATGAS' ? '/satgas/dashboard' : '/pejabat/kasus', { replace: true })
    } catch (err) { setError(err.status === 423 ? 'Akun terkunci sementara' : err.message) }
    finally { setLoading(false) }
  }

  return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}><form className="card" onSubmit={submit} style={{ width: 'min(380px, 100%)', padding: 28 }}><div style={{ color: 'var(--accent)', fontWeight: 800, marginBottom: 18 }}>Satgas PPKPT</div><h1 style={{ fontSize: 26, margin: '0 0 24px' }}>Masuk petugas</h1>{error && <div className="error-text" role="alert" style={{ marginBottom: 12 }}>{error}</div>}<Input label="Nama pengguna atau email" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required /><div style={{ marginTop: 16 }}><Input label="Password" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div><Button type="submit" className="w-full" style={{ width: '100%', marginTop: 18 }} disabled={loading}>{loading ? 'Memuat...' : 'Masuk'}</Button></form></div>
}
