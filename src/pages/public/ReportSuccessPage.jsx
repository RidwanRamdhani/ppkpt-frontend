import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'

export default function ReportSuccessPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const caseNumber = state?.caseNumber || '20481735'
  const pin = state?.pin || '493027'
  async function copy() { await navigator.clipboard?.writeText(`Kode tiket: ${caseNumber}\nPIN: ${pin}`) }
  return <section style={{ maxWidth: 620, margin: '0 auto', padding: '70px 24px' }}><div className="card" style={{ padding: 32, textAlign: 'center' }}><h1 style={{ fontSize: 28, margin: '0 0 12px' }}>Laporan berhasil dikirim</h1><p style={{ color: 'var(--muted)', marginBottom: 24 }}>Simpan kode tiket dan PIN berikut. Keduanya dikirim ke email Anda.</p><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}><div className="card" style={{ padding: 16 }}><small>kode tiket</small><div style={{ fontSize: 30, letterSpacing: 5, fontWeight: 800 }}>{caseNumber}</div></div><div className="card" style={{ padding: 16 }}><small>PIN</small><div style={{ fontSize: 30, letterSpacing: 5, fontWeight: 800 }}>{pin}</div></div></div><div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}><Button variant="outline" onClick={copy}>Salin kode dan PIN</Button><Button onClick={() => navigate('/cek-status')}>Cek Status Laporan</Button></div></div></section>
}
