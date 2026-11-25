import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import StatusBadge from '../../components/ui/StatusBadge'
import { CASE_STATUSES } from '../../constants/options'
import { getStaffStatus } from '../../constants/status'
import { getCases, takeCase } from '../../services/cases'

const violationOptions = ['Fisik', 'Psikis', 'Perundungan', 'Seksual', 'Diskriminasi dan intoleransi']
const channels = ['Portal', 'Hotline', 'Tatap muka', 'Rujukan unit']
const pageSize = 10

export default function CasesPage() {
  const [filters, setFilters] = useState({ search: '', status: '', violationType: '', channel: '' })
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let active = true
    getCases({ ...filters, page, pageSize })
      .then((result) => {
        if (!active) return
        setItems(result.items)
        setTotal(result.total)
        setError('')
      })
      .catch(() => {
        if (active) setError('Daftar kasus gagal dimuat. Silakan coba kembali.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [filters, page, reload])

  function updateFilter(key, value) {
    setLoading(true)
    setPage(1)
    setFilters((current) => ({ ...current, [key]: value }))
  }

  async function assignCase(id) {
    setLoading(true)
    setBusyId(id)
    setError('')
    try {
      await takeCase(id)
      setReload((value) => value + 1)
    } catch {
      setError('Kasus tidak dapat diambil. Silakan coba kembali.')
      setLoading(false)
    } finally { setBusyId('') }
  }

  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  return <div style={{ display: 'grid', gap: 20 }}>
    <header><h1 style={{ fontSize: 28, margin: 0 }}>Daftar Kasus</h1></header>
    <section className="card" style={{ padding: 20 }}>
      <div className="case-filters">
        <Input aria-label="Cari kode tiket" placeholder="Cari kode tiket" value={filters.search} onChange={(event) => updateFilter('search', event.target.value.replace(/\D/g, ''))} />
        <Select aria-label="Filter status" value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}><option value="">Semua status</option>{CASE_STATUSES.map((status) => <option key={status} value={status}>{getStaffStatus(status)}</option>)}</Select>
        <Select aria-label="Filter jenis kekerasan" value={filters.violationType} onChange={(event) => updateFilter('violationType', event.target.value)}><option value="">Semua jenis</option>{violationOptions.map((item) => <option key={item}>{item}</option>)}</Select>
        <Select aria-label="Filter kanal" value={filters.channel} onChange={(event) => updateFilter('channel', event.target.value)}><option value="">Semua kanal</option>{channels.map((item) => <option key={item}>{item}</option>)}</Select>
      </div>
      {error && <div role="alert" className="error-text" style={{ margin: '14px 0' }}>{error} <button type="button" onClick={() => { setLoading(true); setReload((value) => value + 1) }} style={{ border: 0, background: 'none', color: 'var(--accent)', cursor: 'pointer' }}>Coba lagi</button></div>}
      {loading ? <p role="status" style={{ padding: 24 }}>Memuat daftar kasus...</p> : items.length === 0 ? <div style={{ padding: 28, textAlign: 'center', color: 'var(--muted)' }}>Tidak ada kasus yang sesuai dengan filter.</div> : <div className="table-scroll"><table className="data-table"><thead><tr><th>Kode tiket</th><th>Jenis</th><th>Kanal</th><th>Status</th><th>Penanggung jawab</th><th>Aksi</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.caseNumber}</td><td>{item.violationType}</td><td>{item.channel}</td><td><StatusBadge status={item.status} /></td><td>{item.assignedTo || 'Belum ada'}</td><td>{!item.assignedTo ? <Button disabled={busyId === item.id} onClick={() => assignCase(item.id)}>{busyId === item.id ? 'Memproses...' : 'Ambil Kasus'}</Button> : <Link className="btn btn-outline" style={{ textDecoration: 'none' }} to={`/satgas/kasus/${item.id}`}>Buka</Link>}</td></tr>)}</tbody></table></div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--muted)', fontSize: 13 }}>Menampilkan {total ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, total)} dari {total} kasus</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Button variant="outline" disabled={page <= 1 || loading} onClick={() => { setLoading(true); setPage((value) => value - 1) }}>Sebelumnya</Button><span aria-live="polite">{page} / {pageCount}</span><Button variant="outline" disabled={page >= pageCount || loading} onClick={() => { setLoading(true); setPage((value) => value + 1) }}>Berikutnya</Button></div>
      </div>
    </section>
  </div>
}
