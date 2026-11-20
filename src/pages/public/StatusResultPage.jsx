import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'

const stages = ['Laporan diterima', 'Verifikasi', 'Penelaahan', 'Pemeriksaan', 'Keputusan', 'Selesai']

export default function StatusResultPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const result = state || { caseNumber: '20481735', status: 'PERLU_DILENGKAPI', deadlineLabel: 'Sisa 7 hari' }
  const needsCompletion = result.status === 'PERLU_DILENGKAPI'
  return <section style={{ maxWidth: 760, margin: '0 auto', padding: '52px 24px' }}><div className="card" style={{ padding: 28 }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}><h1 style={{ fontSize: 26, margin: 0 }}>Kasus {result.caseNumber}</h1><StatusBadge status={result.status} /></div><div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>{stages.map((stage, index) => <div key={stage} style={{ textAlign: 'center', fontSize: 12 }}><div style={{ height: 12, borderRadius: 6, background: index < 3 ? 'var(--accent)' : '#e7e5e4', marginBottom: 8 }} /><span>{stage}</span></div>)}</div><div style={{ marginTop: 24, padding: 16, background: '#fff7ed', borderRadius: 8 }}><b>Batas waktu penanganan:</b> {result.deadlineLabel}</div>{needsCompletion && <div style={{ marginTop: 16 }}><p style={{ marginBottom: 12 }}>Satgas meminta tambahan keterangan atau bukti.</p><Button onClick={() => navigate('/status/lengkapi', { state: result })}>Lengkapi Laporan</Button></div>}</div></section>
}
