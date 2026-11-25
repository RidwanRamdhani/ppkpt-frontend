import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'
import { changePassword, login as authLogin } from '../../services/auth'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pendingSession, setPendingSession] = useState(null)
  const [error, setError] = useState(useLocation().state?.message || '')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  async function submit(event) {
    event.preventDefault()
    setLoading(true); setError('')
    try {
      const result = await authLogin({ username, password })
      if (result.mustChangePassword) {
        setPendingSession(result)
        return
      }
      login(result.role, result.user)
      navigate(result.role === 'SATGAS' ? '/satgas/dashboard' : '/pejabat/kasus', { replace: true })
    } catch (err) { setError(err.status === 423 ? 'Akun terkunci sementara' : err.message) }
    finally { setLoading(false) }
  }

  async function submitNewPassword(event) {
    event.preventDefault()
    setError('')
    if (newPassword.length < 12) { setError('Password baru minimal 12 karakter.'); return }
    if (newPassword !== confirmPassword) { setError('Konfirmasi password tidak sama.'); return }
    setLoading(true)
    try {
      await changePassword({ currentPassword: password, newPassword })
      login(pendingSession.role, pendingSession.user)
      navigate(pendingSession.role === 'SATGAS' ? '/satgas/dashboard' : '/pejabat/kasus', { replace: true })
    } catch (err) {
      setError(err.message || 'Password gagal diperbarui.')
    } finally { setLoading(false) }
  }

  return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}><form className="card" onSubmit={pendingSession ? submitNewPassword : submit} style={{ width: 'min(380px, 100%)', padding: 28 }}><div style={{ color: 'var(--accent)', fontWeight: 800, marginBottom: 18 }}>Satgas PPKPT</div><h1 style={{ fontSize: 26, margin: '0 0 24px' }}>{pendingSession ? 'Ganti password' : 'Masuk petugas'}</h1>{error && <div className="error-text" role="alert" style={{ marginBottom: 12 }}>{error}</div>}{pendingSession ? <><p style={{ color: 'var(--muted)', marginBottom: 16 }}>Buat password baru minimal 12 karakter untuk melanjutkan.</p><Input label="Password baru" id="new-password" type="password" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /><div style={{ marginTop: 16 }}><Input label="Konfirmasi password baru" id="confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></div></> : <><Input label="Nama pengguna atau email" id="username" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required /><div style={{ marginTop: 16 }}><Input label="Password" id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div></>}<Button type="submit" style={{ width: '100%', marginTop: 18 }} disabled={loading}>{loading ? 'Memuat...' : pendingSession ? 'Simpan password' : 'Masuk'}</Button><p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 16 }}>Akun dibuat oleh pengelola sistem.</p></form></div>
}
