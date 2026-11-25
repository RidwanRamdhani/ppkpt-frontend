import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'
import { getCases, takeCase } from '../../services/cases'
import { getDashboardDistribution, getDashboardSummary } from '../../services/dashboard'

const cards = [
  ['total', 'Total kasus'],
  ['verification', 'Perlu verifikasi'],
  ['assigned', 'Kasus saya'],
  ['nearDeadline', 'Mendekati batas'],
  ['overdue', 'Melewati batas'],
]

function Bars({ title, items, color = 'var(--accent)' }) {
  const max = Math.max(...items.map((item) => item.count), 1)
  return <section className="card" style={{ padding: 20 }}>
    <h2 style={{ fontSize: 16, margin: '0 0 16px' }}>{title}</h2>
    <div style={{ display: 'grid', gap: 12 }}>
      {items.map((item) => <div key={item.label} style={{ display: 'grid', gridTemplateColumns: '120px minmax(40px, 1fr) 28px', gap: 10, alignItems: 'center', fontSize: 13 }}>
        <span>{item.label}</span>
        <div style={{ height: 8, background: '#f1f0ef', borderRadius: 99, overflow: 'hidden' }}><div style={{ width: `${(item.count / max) * 100}%`, height: '100%', background: color, borderRadius: 99 }} /></div>
        <b>{item.count}</b>
      </div>)}
    </div>
  </section>
}

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [distribution, setDistribution] = useState(null)
  const [urgent, setUrgent] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const [summaryData, distributionData, caseData] = await Promise.all([
          getDashboardSummary(),
          getDashboardDistribution(),
          getCases({ page: 1, pageSize: 15 }),
        ])
        if (!active) return
        setSummary(summaryData)
        setDistribution(distributionData)
        setUrgent(caseData.items.filter((item) => item.status === 'DILAPORKAN' || (item.daysLeft != null && item.daysLeft <= 2)).slice(0, 5))
      } catch {
        if (active) setError('Data dashboard gagal dimuat. Silakan coba kembali.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  async function assignCase(id) {
    setBusyId(id)
    setError('')
    try {
      await takeCase(id)
      const { items } = await getCases({ page: 1, pageSize: 15 })
      setUrgent(items.filter((item) => item.status === 'DILAPORKAN' || (item.daysLeft != null && item.daysLeft <= 2)).slice(0, 5))
    } catch {
      setError('Kasus tidak dapat diambil. Silakan coba kembali.')
    } finally { setBusyId('') }
  }

  if (loading) return <p role="status">Memuat dashboard...</p>
  if (error) return <div role="alert" className="card" style={{ padding: 24 }}>{error}<Button style={{ marginLeft: 12 }} onClick={() => window.location.reload()}>Coba lagi</Button></div>

  return <div style={{ display: 'grid', gap: 20 }}>
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <div><h1 style={{ fontSize: 28, margin: 0 }}>Dashboard</h1><p style={{ color: 'var(--muted)', marginTop: 4 }}>Ringkasan kasus tahun 2026 (data dummy)</p></div>
      <Link to="/satgas/input-manual" className="btn btn-primary" style={{ textDecoration: 'none' }}>+ Input Manual</Link>
    </header>

    <div className="satgas-metrics">
      {cards.map(([key, label]) => <div className="card" key={key} style={{ padding: 16 }}><div style={{ color: 'var(--muted)', fontSize: 13 }}>{label}</div><strong style={{ display: 'block', fontSize: 28, marginTop: 6, color: key === 'overdue' && summary[key] ? 'var(--accent)' : 'var(--text)' }}>{summary[key]}</strong></div>)}
    </div>

    <div className="satgas-dashboard-grid">
      <section className="card" style={{ padding: 20 }}>
        <h2 style={{ fontSize: 16, margin: '0 0 18px' }}>Kasus masuk per bulan (2026)</h2>
        <div style={{ minHeight: 160, display: 'flex', alignItems: 'end', justifyContent: 'space-around', gap: 8, borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
          {(distribution?.monthly || []).map((count, index) => <div key={index} style={{ flex: 1, maxWidth: 42, textAlign: 'center', fontSize: 11, color: 'var(--muted)' }}><b style={{ display: 'block', color: 'var(--text)', marginBottom: 4 }}>{count}</b><div style={{ height: `${Math.max(count * 13, 12)}px`, background: index === 9 ? 'var(--accent)' : '#dedbd9', borderRadius: '6px 6px 0 0' }} /><span>{['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt'][index]}</span></div>)}
        </div>
      </section>
      <Bars title="Status kasus" items={distribution?.status || []} color="#57534e" />
      <Bars title="Jenis kekerasan" items={distribution?.violations || []} />
      <Bars title="Beban kasus per anggota" items={distribution?.workload || []} />
    </div>

    <section className="card" style={{ padding: 20 }}>
      <h2 style={{ fontSize: 16, margin: '0 0 16px' }}>Perlu tindakan segera</h2>
      {urgent.length === 0 ? <p style={{ color: 'var(--muted)' }}>Tidak ada kasus yang memerlukan tindakan segera.</p> : <div className="table-scroll"><table className="data-table"><thead><tr><th>Kode tiket</th><th>Status</th><th>Batas waktu</th><th>Penanggung jawab</th><th>Aksi</th></tr></thead><tbody>{urgent.map((item) => <tr key={item.id}><td>{item.caseNumber}</td><td><StatusBadge status={item.status} /></td><td>{item.daysLeft == null ? '—' : item.daysLeft < 0 ? `Lewat ${Math.abs(item.daysLeft)} hari` : `Sisa ${item.daysLeft} hari`}</td><td>{item.assignedTo || 'Belum ada'}</td><td>{!item.assignedTo ? <Button disabled={busyId === item.id} onClick={() => assignCase(item.id)}>{busyId === item.id ? 'Memproses...' : 'Ambil Kasus'}</Button> : <Link className="btn btn-outline" style={{ textDecoration: 'none' }} to={`/satgas/kasus/${item.id}`}>Buka</Link>}</td></tr>)}</tbody></table></div>}
    </section>
  </div>
}
