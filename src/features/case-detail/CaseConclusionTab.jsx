import { useState } from 'react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import { closeCase, saveConclusion, saveDelivery, submitConclusion } from '../../services/cases'

const initialConclusion = { result: '', category: '', severity: '', basis: '' }

export default function CaseConclusionTab({ caseData, canEdit, onAction }) {
  const [conclusion, setConclusion] = useState({ ...initialConclusion, ...(caseData.conclusion || {}) })
  const [delivery, setDelivery] = useState(caseData.delivery || { date: '', recipient: '', method: '' })
  const [error, setError] = useState('')
  const decisionRecorded = ['KEPUTUSAN', 'PEMANTAUAN'].includes(caseData.status)
  const isClosed = caseData.status === 'SELESAI'
  const isSubmitted = Boolean(caseData.conclusion?.submitted)

  function updateConclusion(field, value) {
    setConclusion((current) => ({ ...current, [field]: value }))
  }

  function validateConclusion() {
    if (!conclusion.result || !conclusion.basis.trim()) {
      setError('Pilih kesimpulan dan isi dasar pertimbangannya.')
      return false
    }
    if (conclusion.result === 'TERBUKTI' && (!conclusion.category || !conclusion.severity)) {
      setError('Pilih kategori dan tingkat sanksi untuk kesimpulan terbukti.')
      return false
    }
    setError('')
    return true
  }

  async function saveDraft() {
    if (validateConclusion()) await onAction(() => saveConclusion(caseData.id, conclusion), 'Draf kesimpulan berhasil disimpan.')
  }

  async function submit() {
    if (!validateConclusion()) return
    await onAction(async () => {
      await saveConclusion(caseData.id, conclusion)
      await submitConclusion(caseData.id)
    }, 'Rekomendasi berhasil diajukan ke pejabat.')
  }

  async function recordDelivery(event) {
    event.preventDefault()
    setError('')
    if (!delivery.date || !delivery.recipient || !delivery.method) {
      setError('Lengkapi tanggal, penerima, dan cara penyampaian.')
      return
    }
    await onAction(() => saveDelivery(caseData.id, delivery), 'Penyampaian hasil keputusan berhasil dicatat.')
  }

  return <div className="case-tab-stack">
    <section className="card case-tab-card">
      <h2>Kesimpulan dan rekomendasi</h2>
      {isSubmitted && <div className="notice-box" role="status">Rekomendasi telah diajukan ke pejabat dan menunggu keputusan.</div>}
      {decisionRecorded && <div className="notice-box">Keputusan telah tercatat. Catat penyampaian hasil kepada pihak terkait.</div>}
      {isClosed && <div className="notice-box">Kasus sudah ditutup dan hanya dapat dibaca.</div>}
      <div className="case-form-grid">
        <Select label="Kesimpulan *" id="conclusion-result" value={conclusion.result} disabled={!canEdit || isSubmitted || decisionRecorded || isClosed} onChange={(event) => updateConclusion('result', event.target.value)}><option value="">Pilih kesimpulan</option><option value="TERBUKTI">Terbukti</option><option value="TIDAK_TERBUKTI">Tidak terbukti</option></Select>
        <Select label="Kategori sanksi" id="conclusion-category" value={conclusion.category} disabled={!canEdit || conclusion.result !== 'TERBUKTI' || isSubmitted || decisionRecorded || isClosed} onChange={(event) => updateConclusion('category', event.target.value)}><option value="">Pilih kategori</option><option>Administratif</option><option>Akademik</option><option>Kepegawaian</option></Select>
        <Select label="Tingkat sanksi" id="conclusion-severity" value={conclusion.severity} disabled={!canEdit || conclusion.result !== 'TERBUKTI' || isSubmitted || decisionRecorded || isClosed} onChange={(event) => updateConclusion('severity', event.target.value)}><option value="">Pilih tingkat</option><option>Ringan</option><option>Sedang</option><option>Berat</option></Select>
      </div>
      <div style={{ marginTop: 16 }}><Textarea label="Dasar pertimbangan Satgas *" id="conclusion-basis" value={conclusion.basis} disabled={!canEdit || isSubmitted || decisionRecorded || isClosed} placeholder="Jelaskan hasil penelaahan, sesi pemeriksaan, kesesuaian bukti, dan alasan rekomendasi" onChange={(event) => updateConclusion('basis', event.target.value)} /></div>
      {error && <p className="error-text" role="alert">{error}</p>}
      {canEdit && !isSubmitted && !decisionRecorded && !isClosed && <div className="case-action-row"><Button variant="outline" onClick={saveDraft}>Simpan draf</Button><Button onClick={submit}>Ajukan ke pejabat</Button></div>}
    </section>

    {decisionRecorded && <section className="card case-tab-card">
      <h2>Penyampaian hasil keputusan</h2>
      {caseData.delivery ? <p className="muted-copy">Hasil dicatat disampaikan kepada {caseData.delivery.recipient} pada {caseData.delivery.date} melalui {caseData.delivery.method}.</p> : <form onSubmit={recordDelivery}><div className="case-form-grid"><Input label="Tanggal penyampaian *" id="delivery-date" type="date" value={delivery.date} disabled={!canEdit || isClosed} onChange={(event) => setDelivery((current) => ({ ...current, date: event.target.value }))} /><Input label="Penerima *" id="delivery-recipient" value={delivery.recipient} disabled={!canEdit || isClosed} onChange={(event) => setDelivery((current) => ({ ...current, recipient: event.target.value }))} /><Select label="Cara penyampaian *" id="delivery-method" value={delivery.method} disabled={!canEdit || isClosed} onChange={(event) => setDelivery((current) => ({ ...current, method: event.target.value }))}><option value="">Pilih cara</option><option>Pertemuan langsung</option><option>Email resmi</option><option>Surat resmi</option></Select></div>{canEdit && !isClosed && <Button type="submit" variant="outline" style={{ marginTop: 14 }}>Catat penyampaian</Button>}</form>}
      {caseData.delivery && canEdit && !isClosed && <div className="case-action-row"><Button variant="outline" onClick={() => onAction(() => closeCase(caseData.id), 'Kasus berhasil ditutup.')}>Tutup kasus</Button></div>}
    </section>}
  </div>
}
