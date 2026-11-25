import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Checkbox from '../../components/ui/Checkbox'
import FileUpload from '../../components/ui/FileUpload'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import { VIOLATION_TYPES } from '../../constants/options'
import { createCase } from '../../services/cases'

const initialForm = {
  channel: '', receivedAt: '', receivedBy: '', sourceUnit: '',
  reporterIdentityHidden: false, reporterName: '', reporterStatus: '', reporterContact: '', reporterEmail: '',
  victimName: '', victimGender: '', victimStatus: '', victimFaculty: '', victimContact: '',
  perpetratorName: '', perpetratorIdentity: '', perpetratorFaculty: '', perpetratorContact: '',
  incidentDate: '', incidentLocation: '', incidentDescription: '', violationTypes: [],
  officerNote: '', assignToMe: false, evidences: [],
}

export default function ManualEntryPage() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  function update(key, value) { setForm((current) => ({ ...current, [key]: value })) }

  async function submit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!form.channel) nextErrors.channel = 'Pilih kanal laporan'
    if (!form.receivedAt) nextErrors.receivedAt = 'Tanggal diterima wajib diisi'
    if (!form.receivedBy.trim()) nextErrors.receivedBy = 'Petugas penerima wajib diisi'
    if (!form.victimName.trim()) nextErrors.victimName = 'Nama korban wajib diisi'
    if (!form.incidentDate) nextErrors.incidentDate = 'Tanggal kejadian wajib diisi'
    if (!form.incidentLocation.trim()) nextErrors.incidentLocation = 'Lokasi wajib diisi'
    if (!form.incidentDescription.trim()) nextErrors.incidentDescription = 'Uraian kejadian wajib diisi'
    if (!form.violationTypes.length) nextErrors.violationTypes = 'Pilih minimal satu jenis dugaan'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setLoading(true)
    try {
      const saved = await createCase({
        channel: form.channel,
        receivedAt: form.receivedAt,
        receivedBy: form.receivedBy,
        sourceUnit: form.sourceUnit,
        reporter: {
          identityHidden: form.reporterIdentityHidden,
          name: form.reporterIdentityHidden ? '' : form.reporterName,
          status: form.reporterStatus,
          contact: form.reporterContact,
          email: form.reporterEmail,
        },
        victim: { name: form.victimName, gender: form.victimGender, status: form.victimStatus, faculty: form.victimFaculty, contact: form.victimContact },
        perpetrator: { name: form.perpetratorName, identity: form.perpetratorIdentity, faculty: form.perpetratorFaculty, contact: form.perpetratorContact },
        incidents: [{ dateStart: form.incidentDate, location: form.incidentLocation, description: form.incidentDescription }],
        violationTypes: form.violationTypes,
        officerNote: form.officerNote,
        assignToMe: form.assignToMe,
        evidences: form.evidences.map(({ name, type, size }) => ({ originalName: name, mimeType: type, sizeBytes: size })),
      })
      setResult(saved)
      setErrors({})
    } catch (error) {
      setErrors({ submit: error.message || 'Laporan manual gagal disimpan.' })
    } finally { setLoading(false) }
  }

  function reset() { setForm(initialForm); setErrors({}); setResult(null) }

  const grid = 'report-grid'
  const identityStatuses = ['Mahasiswa', 'Dosen', 'Tenaga kependidikan', 'Lainnya']

  if (result) return <section style={{ maxWidth: 720, margin: '32px auto' }}><div className="card" style={{ padding: 32, textAlign: 'center' }}><h1 style={{ fontSize: 28, margin: '0 0 12px' }}>Laporan manual tersimpan</h1><p style={{ color: 'var(--muted)' }}>Berikan kode tiket dan PIN ini kepada pelapor agar dapat memantau status.</p><div className="manual-result-codes"><div className="card" style={{ padding: 16 }}><span style={{ color: 'var(--muted)' }}>Kode tiket</span><strong>{result.caseNumber}</strong></div><div className="card" style={{ padding: 16 }}><span style={{ color: 'var(--muted)' }}>PIN</span><strong>{result.pin}</strong></div></div><div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20, flexWrap: 'wrap' }}><Button variant="outline" onClick={reset}>Input laporan lain</Button><Link className="btn btn-primary" to={`/satgas/kasus/${result.caseNumber}`} style={{ textDecoration: 'none' }}>Buka kasus</Link></div></div></section>

  return <div style={{ display: 'grid', gap: 18 }}>
    <header><h1 style={{ fontSize: 28, margin: 0 }}>Input Manual</h1><p style={{ color: 'var(--muted)', marginTop: 4 }}>Untuk laporan yang masuk lewat hotline, tatap muka, atau rujukan unit.</p></header>
    <form onSubmit={submit} style={{ display: 'grid', gap: 14 }}>
      <section className="card manual-section"><h2>1. Sumber laporan</h2><div className={grid}><Select label="Kanal masuk *" id="manual-channel" value={form.channel} error={errors.channel} onChange={(e) => update('channel', e.target.value)}><option value="">Pilih kanal</option>{['Hotline', 'Tatap muka', 'Rujukan unit'].map((value) => <option key={value}>{value}</option>)}</Select><Input label="Tanggal diterima *" id="received-at" type="date" value={form.receivedAt} error={errors.receivedAt} onChange={(e) => update('receivedAt', e.target.value)} /><Input label="Petugas penerima *" id="received-by" placeholder="Nama petugas" value={form.receivedBy} error={errors.receivedBy} onChange={(e) => update('receivedBy', e.target.value)} /><Input label="Unit / pihak perujuk (jika rujukan)" id="source-unit" placeholder="Contoh: Fakultas Informatika" value={form.sourceUnit} onChange={(e) => update('sourceUnit', e.target.value)} /></div></section>

      <section className="card manual-section"><h2>2. Pelapor</h2><Checkbox label="Pelapor ingin identitasnya dirahasiakan" checked={form.reporterIdentityHidden} onChange={(e) => update('reporterIdentityHidden', e.target.checked)} /><div className={grid}><Input label="Nama pelapor" id="reporter-name" value={form.reporterName} disabled={form.reporterIdentityHidden} onChange={(e) => update('reporterName', e.target.value)} /><Select label="Status" id="reporter-status" value={form.reporterStatus} onChange={(e) => update('reporterStatus', e.target.value)}><option value="">Pilih status</option>{identityStatuses.map((value) => <option key={value}>{value}</option>)}</Select><Input label="Nomor WhatsApp" id="reporter-contact" value={form.reporterContact} onChange={(e) => update('reporterContact', e.target.value)} /><Input label="Email (untuk kode tiket dan PIN)" id="reporter-email" type="email" value={form.reporterEmail} onChange={(e) => update('reporterEmail', e.target.value)} /></div></section>

      <section className="card manual-section"><h2>3. Korban</h2><div className={grid}><Input label="Nama korban *" id="victim-name" value={form.victimName} error={errors.victimName} onChange={(e) => update('victimName', e.target.value)} /><Select label="Jenis kelamin" id="victim-gender" value={form.victimGender} onChange={(e) => update('victimGender', e.target.value)}><option value="">Pilih</option><option>Perempuan</option><option>Laki-laki</option><option>Lainnya</option></Select><Select label="Status" id="victim-status" value={form.victimStatus} onChange={(e) => update('victimStatus', e.target.value)}><option value="">Pilih status</option>{identityStatuses.map((value) => <option key={value}>{value}</option>)}</Select><Input label="Fakultas / unit" id="victim-faculty" value={form.victimFaculty} onChange={(e) => update('victimFaculty', e.target.value)} /><Input label="Nomor kontak" id="victim-contact" value={form.victimContact} onChange={(e) => update('victimContact', e.target.value)} /></div></section>

      <section className="card manual-section"><h2>4. Terlapor</h2><p style={{ color: 'var(--muted)', margin: '-8px 0 16px' }}>Identitas terlapor boleh tidak lengkap.</p><div className={grid}><Input label="Nama terlapor" id="perpetrator-name" value={form.perpetratorName} onChange={(e) => update('perpetratorName', e.target.value)} /><Input label="NIM / NIP / NIK" id="perpetrator-id" value={form.perpetratorIdentity} onChange={(e) => update('perpetratorIdentity', e.target.value)} /><Input label="Fakultas / unit" id="perpetrator-faculty" value={form.perpetratorFaculty} onChange={(e) => update('perpetratorFaculty', e.target.value)} /><Input label="Nomor kontak" id="perpetrator-contact" value={form.perpetratorContact} onChange={(e) => update('perpetratorContact', e.target.value)} /></div></section>

      <section className="card manual-section"><h2>5. Kejadian</h2><div className={grid}><Input label="Tanggal kejadian *" id="incident-date" type="date" value={form.incidentDate} error={errors.incidentDate} onChange={(e) => update('incidentDate', e.target.value)} /><Input label="Lokasi *" id="incident-location" value={form.incidentLocation} error={errors.incidentLocation} onChange={(e) => update('incidentLocation', e.target.value)} /></div><div style={{ marginTop: 16 }}><Textarea label="Uraian kejadian *" id="incident-description" value={form.incidentDescription} error={errors.incidentDescription} onChange={(e) => update('incidentDescription', e.target.value)} /></div><div style={{ marginTop: 12 }}><b>Jenis dugaan kekerasan *</b><div className="manual-checks">{VIOLATION_TYPES.map((type) => <Checkbox key={type} label={type} checked={form.violationTypes.includes(type)} onChange={(e) => update('violationTypes', e.target.checked ? [...form.violationTypes, type] : form.violationTypes.filter((value) => value !== type))} />)}</div>{errors.violationTypes && <div className="error-text" role="alert">{errors.violationTypes}</div>}</div></section>

      <section className="card manual-section"><h2>6. Bukti dan catatan</h2><FileUpload files={form.evidences} onChange={(files) => update('evidences', files)} /><div style={{ marginTop: 16 }}><Textarea label="Catatan petugas" id="officer-note" value={form.officerNote} onChange={(e) => update('officerNote', e.target.value)} /></div><Checkbox label="Saya yang menangani kasus ini (Satgas A)" checked={form.assignToMe} onChange={(e) => update('assignToMe', e.target.checked)} />{errors.submit && <div className="error-text" role="alert">{errors.submit}</div>}</section>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}><Link to="/satgas/kasus" className="btn btn-outline" style={{ textDecoration: 'none' }}>Batal</Link><Button type="submit" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan laporan'}</Button></div>
    </form>
  </div>
}
