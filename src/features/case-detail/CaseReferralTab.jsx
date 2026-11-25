import { useState } from 'react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import { addReferral, saveCaseCondition, saveRecovery } from '../../services/cases'

const initialReferral = { service: '', organization: '', note: '' }

export default function CaseReferralTab({ caseData, canEdit, onAction }) {
  const [condition, setCondition] = useState(caseData.caseCondition || 'TIDAK_DARURAT')
  const [referral, setReferral] = useState(initialReferral)
  const [recovery, setRecovery] = useState(caseData.recovery || { status: 'Belum dipantau', note: '' })
  const [error, setError] = useState('')

  async function submitReferral(event) {
    event.preventDefault()
    setError('')
    if (!referral.service.trim() || !referral.organization.trim()) {
      setError('Jenis layanan dan lembaga tujuan wajib diisi.')
      return
    }
    const saved = await onAction(() => addReferral(caseData.id, referral), 'Rujukan layanan berhasil ditambahkan.')
    if (saved) setReferral(initialReferral)
  }

  return <div className="case-tab-stack">
    <section className="card case-tab-card">
      <h2>Kondisi dan kebutuhan layanan</h2>
      <div className="case-form-grid">
        <Select label="Kondisi kasus" id="case-condition" value={condition} disabled={!canEdit} onChange={(event) => setCondition(event.target.value)}><option value="TIDAK_DARURAT">Tidak darurat</option><option value="DARURAT">Darurat</option></Select>
        <div className="case-align-end">{canEdit && <Button variant="outline" onClick={() => onAction(() => saveCaseCondition(caseData.id, { caseCondition: condition }), 'Kondisi kasus berhasil disimpan.')}>Simpan kondisi</Button>}</div>
      </div>
      <p className="muted-copy" style={{ marginTop: 12 }}>{condition === 'DARURAT' ? 'Prioritaskan rujukan yang aman dan sesuai kebutuhan korban.' : 'Rujukan dapat diberikan sesuai kebutuhan dan persetujuan korban.'}</p>
    </section>

    <section className="card case-tab-card">
      <h2>Rujukan layanan untuk korban</h2>
      {caseData.referrals?.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>Layanan</th><th>Lembaga tujuan</th><th>Status</th><th>Tanggal rujuk</th><th>Catatan</th></tr></thead><tbody>{caseData.referrals.map((item) => <tr key={item.id}><td>{item.service}</td><td>{item.organization}</td><td>{item.status}</td><td>{item.createdAt}</td><td>{item.note || '—'}</td></tr>)}</tbody></table></div> : <p className="muted-copy">Belum ada rujukan layanan.</p>}
      {canEdit && <form className="case-subform" onSubmit={submitReferral}><h3>Tambah rujukan</h3><div className="case-form-grid"><Input label="Jenis layanan *" id="referral-service" placeholder="Contoh: Layanan psikologis" value={referral.service} onChange={(event) => setReferral((current) => ({ ...current, service: event.target.value }))} /><Input label="Lembaga tujuan *" id="referral-organization" placeholder="Contoh: Unit Konseling Kampus" value={referral.organization} onChange={(event) => setReferral((current) => ({ ...current, organization: event.target.value }))} /></div><div style={{ marginTop: 14 }}><Textarea label="Catatan" id="referral-note" value={referral.note} onChange={(event) => setReferral((current) => ({ ...current, note: event.target.value }))} /></div>{error && <p className="error-text" role="alert">{error}</p>}<Button type="submit" style={{ marginTop: 12 }}>Simpan rujukan</Button></form>}
    </section>

    <section className="card case-tab-card">
      <h2>Pemantauan pemulihan</h2>
      <div className="case-form-grid"><Select label="Status pemantauan" id="recovery-status" value={recovery.status} disabled={!canEdit} onChange={(event) => setRecovery((current) => ({ ...current, status: event.target.value }))}><option>Belum dipantau</option><option>Dalam pemantauan</option><option>Selesai</option><option>Perlu tindak lanjut</option></Select><Textarea label="Catatan pemulihan" id="recovery-note" value={recovery.note || ''} disabled={!canEdit} onChange={(event) => setRecovery((current) => ({ ...current, note: event.target.value }))} /></div>
      {canEdit && <Button variant="outline" style={{ marginTop: 14 }} onClick={() => onAction(() => saveRecovery(caseData.id, recovery), 'Pemantauan pemulihan berhasil disimpan.')}>Simpan pemantauan</Button>}
    </section>
  </div>
}
