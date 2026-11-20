import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { getReportStatus } from '../../services/reports'

export default function StatusCheckPage() {
  const [ticket, setTicket] = useState('')
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(event) {
    event.preventDefault(); setError('')
    if (!/^\d{8}$/.test(ticket)) { setError('Kode tiket harus terdiri dari 8 digit angka'); return }
    if (!/^\d{6}$/.test(pin)) { setError('PIN harus terdiri dari 6 digit angka'); return }
    setLoading(true)
    try { const result = await getReportStatus(ticket, pin); navigate('/status', { state: result }) }
    catch (err) { setError(err.status === 423 ? 'PIN dikunci sementara. Tunggu hingga waktu penguncian berakhir.' : err.status === 401 ? 'Kode tiket atau PIN salah.' : 'Gagal memeriksa status laporan.') }
    finally { setLoading(false) }
  }

  return <section style={{ maxWidth: 520, margin: '0 auto', padding: '70px 24px' }}><form className="card" onSubmit={submit} style={{ padding: 32 }}><h1 style={{ fontSize: 28, margin: '0 0 24px' }}>Cek Status Laporan</h1>{error && <div className="error-text" role="alert" style={{ marginBottom: 12 }}>{error}</div>}<Input label="Kode tiket (8 digit)" id="ticket" inputMode="numeric" maxLength={8} value={ticket} onChange={(e) => setTicket(e.target.value.replace(/\D/g, ''))} /><div style={{ position: 'relative', marginTop: 16 }}><Input label="PIN" id="pin" type={showPin ? 'text' : 'password'} inputMode="numeric" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} /><button type="button" onClick={() => setShowPin((v) => !v)} style={{ position: 'absolute', right: 10, bottom: 10, minHeight: 36, border: 0, background: 'transparent', color: 'var(--accent)', cursor: 'pointer' }}>{showPin ? 'Sembunyikan' : 'Tampilkan'}</button></div><Button type="submit" style={{ width: '100%', marginTop: 18 }} disabled={loading}>{loading ? 'Memeriksa...' : 'Cek Status'}</Button></form></section>
}
