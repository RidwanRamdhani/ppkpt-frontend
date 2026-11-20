import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Textarea from '../../components/ui/Textarea'
import FileUpload from '../../components/ui/FileUpload'
import Button from '../../components/ui/Button'
import { completeReport } from '../../services/reports'

export default function CompleteReportPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    if (!description.trim()) { setError('Tambahkan keterangan terlebih dahulu'); return }
    setLoading(true)
    try { const formData = new FormData(); formData.append('additionalDescription', description); files.forEach((file) => formData.append('evidences', file)); await completeReport(state?.caseNumber || '20481735', formData); navigate('/status', { state: { ...state, status: 'PENELAAHAN' } }) }
    catch { setError('Lampiran gagal dikirim') }
    finally { setLoading(false) }
  }

  return <section style={{ maxWidth: 760, margin: '0 auto', padding: '52px 24px' }}><form className="card" onSubmit={submit} style={{ padding: 28 }}><h1 style={{ fontSize: 26, margin: '0 0 12px' }}>Lengkapi Laporan</h1><div style={{ background: '#fff7ed', borderRadius: 8, padding: 16, marginBottom: 18 }}><b>Catatan Satgas:</b> Mohon lampirkan bukti tambahan.</div>{error && <div className="error-text" role="alert" style={{ marginBottom: 12 }}>{error}</div>}<Textarea label="Data atau keterangan tambahan" value={description} onChange={(e) => setDescription(e.target.value)} /><div style={{ marginTop: 16 }}><FileUpload files={files} onChange={setFiles} /></div><Button type="submit" style={{ marginTop: 20 }} disabled={loading}>{loading ? 'Mengirim...' : 'Kirim Pelengkap'}</Button></form></section>
}
