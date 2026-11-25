import { useState } from 'react'
import Button from '../../components/ui/Button'
import FileUpload from '../../components/ui/FileUpload'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import { addCaseEvidence, addExaminationSession, saveReview } from '../../services/cases'

const emptySession = { date: '', party: '', reviewer: '', summary: '' }

export default function CaseReviewTab({ caseData, canEdit, onAction }) {
  const [summary, setSummary] = useState(caseData.review?.summary || '')
  const [sessions, setSessions] = useState(emptySession)
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [minutesFiles, setMinutesFiles] = useState([])
  const [error, setError] = useState('')
  const remaining = caseData.review?.examDueDays ?? caseData.daysLeft
  const progress = remaining == null ? 0 : Math.min(100, Math.max(0, ((30 - remaining) / 30) * 100))

  async function submitSession(event) {
    event.preventDefault()
    setError('')
    if (!sessions.date || !sessions.party || !sessions.reviewer || !sessions.summary.trim()) {
      setError('Lengkapi semua informasi sesi pemeriksaan.')
      return
    }
    const saved = await onAction(() => addExaminationSession(caseData.id, sessions), 'Sesi pemeriksaan berhasil ditambahkan.')
    if (saved) {
      setSessions(emptySession)
      setShowSessionForm(false)
    }
  }

  async function uploadMinutes() {
    if (minutesFiles.length === 0) return
    const saved = await onAction(async () => {
      const formData = new FormData()
      minutesFiles.forEach((file) => formData.append('evidences', file))
      await addCaseEvidence(caseData.id, formData, 'BAI')
    }, 'Berita acara berhasil diunggah.')
    if (saved) setMinutesFiles([])
  }

  return <div className="case-tab-stack">
    <section className="card case-tab-card">
      <header className="case-section-heading"><h2>Tenggat pemeriksaan</h2><span className="deadline-badge">{remaining == null ? 'Tenggat maksimal 30 hari' : remaining < 0 ? `Lewat ${Math.abs(remaining)} hari` : `Sisa ${remaining} hari dari 30`}</span></header>
      <div className="deadline-track" role="progressbar" aria-label="Progres tenggat pemeriksaan" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${progress}%` }} /></div>
    </section>

    <section className="card case-tab-card">
      <h2>Penelaahan</h2>
      <Textarea label="Hasil penelaahan" id="review-summary" value={summary} disabled={!canEdit} placeholder="Catat ringkasan hasil penelaahan" onChange={(event) => setSummary(event.target.value)} />
      {canEdit && <Button style={{ marginTop: 12 }} variant="outline" onClick={() => onAction(() => saveReview(caseData.id, { summary }), 'Hasil penelaahan berhasil disimpan.')}>Simpan penelaahan</Button>}
    </section>

    <section className="card case-tab-card">
      <header className="case-section-heading"><h2>Sesi pemeriksaan</h2>{canEdit && <Button variant="outline" onClick={() => setShowSessionForm((value) => !value)}>{showSessionForm ? 'Tutup form' : '+ Tambah sesi'}</Button>}</header>
      {caseData.review?.sessions?.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>Tanggal</th><th>Pihak diperiksa</th><th>Pemeriksa</th><th>Ringkasan</th></tr></thead><tbody>{caseData.review.sessions.map((session) => <tr key={session.id}><td>{session.date}</td><td>{session.party}</td><td>{session.reviewer}</td><td>{session.summary}</td></tr>)}</tbody></table></div> : <p className="muted-copy">Belum ada sesi pemeriksaan yang dicatat.</p>}
      {showSessionForm && <form className="case-subform" onSubmit={submitSession}><div className="case-form-grid"><Input label="Tanggal *" id="session-date" type="date" value={sessions.date} onChange={(event) => setSessions((current) => ({ ...current, date: event.target.value }))} /><Select label="Pihak diperiksa *" id="session-party" value={sessions.party} onChange={(event) => setSessions((current) => ({ ...current, party: event.target.value }))}><option value="">Pilih pihak</option><option>Korban</option><option>Terlapor</option><option>Saksi</option><option>Ahli</option></Select><Input label="Pemeriksa *" id="session-reviewer" value={sessions.reviewer} onChange={(event) => setSessions((current) => ({ ...current, reviewer: event.target.value }))} /><Textarea label="Ringkasan *" id="session-summary" value={sessions.summary} onChange={(event) => setSessions((current) => ({ ...current, summary: event.target.value }))} /></div>{error && <p className="error-text" role="alert">{error}</p>}<Button type="submit" disabled={!canEdit} style={{ marginTop: 12 }}>Simpan sesi</Button></form>}
    </section>

    <section className="card case-tab-card">
      <h2>Berita acara investigasi</h2>
      <FileUpload files={minutesFiles} onChange={setMinutesFiles} label="Unggah Berita Acara" disabled={!canEdit} />
      <Button disabled={!canEdit || minutesFiles.length === 0} style={{ marginTop: 12 }} onClick={uploadMinutes}>Simpan Berita Acara</Button>
    </section>
  </div>
}
