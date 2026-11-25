import { useState } from 'react'
import Button from '../../components/ui/Button'
import Checkbox from '../../components/ui/Checkbox'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import { VIOLATION_TYPES } from '../../constants/options'
import { saveVerification } from '../../services/cases'

const checklist = [
  'Identitas pelapor dan korban sudah jelas',
  'Uraian kejadian cukup rinci (waktu, tempat, pelaku)',
  'Bukti awal memadai',
  'Kejadian termasuk kewenangan Satgas PPKPT',
  'Jenis kekerasan sudah sesuai',
]

export default function CaseVerificationTab({ caseData, canEdit, onAction }) {
  const saved = caseData.verification || {}
  const [checks, setChecks] = useState(saved.checks || [])
  const [result, setResult] = useState(saved.result || '')
  const [note, setNote] = useState(saved.note || '')
  const [violationType, setViolationType] = useState(saved.violationType || caseData.violationType || '')
  const [error, setError] = useState('')
  const remaining = caseData.daysLeft
  const deadlineLabel = remaining == null ? 'Tenggat verifikasi: 5 hari' : remaining < 0 ? `Lewat ${Math.abs(remaining)} hari` : `Tenggat verifikasi: sisa ${remaining} hari`

  async function submit() {
    setError('')
    if (!result) { setError('Pilih hasil verifikasi.'); return }
    if (result === 'LENGKAP' && checks.length !== checklist.length) { setError('Centang semua butir sebelum memilih lengkap.'); return }
    if (result === 'PERLU_DILENGKAPI' && !note.trim()) { setError('Tambahkan catatan yang akan ditampilkan kepada pelapor.'); return }
    await onAction(() => saveVerification(caseData.id, { checks, result, note, violationType }), 'Verifikasi berhasil disimpan.')
  }

  return <section className="card case-tab-card">
    <header className="case-section-heading"><h2>Verifikasi laporan</h2><span className="deadline-badge">{deadlineLabel}</span></header>
    <div className="verification-checks">{checklist.map((item) => <Checkbox key={item} label={item} checked={checks.includes(item)} disabled={!canEdit} onChange={(event) => setChecks((current) => event.target.checked ? [...current, item] : current.filter((entry) => entry !== item))} />)}</div>
    <div className="case-form-grid" style={{ marginTop: 16 }}>
      <Select label="Hasil verifikasi *" id="verification-result" value={result} disabled={!canEdit} onChange={(event) => setResult(event.target.value)}><option value="">Pilih hasil</option><option value="LENGKAP">Lengkap, lanjut ke penelaahan</option><option value="PERLU_DILENGKAPI">Perlu dilengkapi</option></Select>
      <Select label="Jenis kekerasan setelah verifikasi" id="verified-violation-type" value={violationType} disabled={!canEdit} onChange={(event) => setViolationType(event.target.value)}><option value="">Pilih jenis</option>{VIOLATION_TYPES.map((type) => <option key={type}>{type}</option>)}</Select>
    </div>
    <div style={{ marginTop: 16 }}><Textarea label="Catatan untuk pelapor (ditampilkan di Cek Status)" id="verification-note" value={note} disabled={!canEdit} placeholder="Contoh: mohon lampirkan bukti tambahan" onChange={(event) => setNote(event.target.value)} /></div>
    {error && <p className="error-text" role="alert">{error}</p>}
    {!canEdit && <p className="muted-copy" style={{ marginTop: 12 }}>Hanya Satgas penanggung jawab yang dapat mengubah verifikasi.</p>}
    <Button disabled={!canEdit} style={{ marginTop: 16 }} onClick={submit}>Simpan verifikasi</Button>
  </section>
}
