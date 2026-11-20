import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import Checkbox from '../../components/ui/Checkbox'
import Stepper from '../../components/ui/Stepper'
import FileUpload from '../../components/ui/FileUpload'
import Button from '../../components/ui/Button'
import { useReport } from '../../features/report-form/useReport'
import { VIOLATION_TYPES } from '../../constants/options'
import { createReport } from '../../services/reports'

const steps = ['Pelapor', 'Korban', 'Terlapor', 'Kejadian', 'Bukti', 'Persetujuan']

export default function ReportWizard() {
  const { data, setData, step, setStep } = useReport()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const required = (value) => String(value || '').trim().length > 0
  const setNested = (key, field, value) => setData((current) => ({ ...current, [key]: { ...current[key], [field]: value } }))
  const setArrayItem = (key, index, field, value) => setData((current) => ({ ...current, [key]: current[key].map((item, i) => i === index ? { ...item, [field]: value } : item) }))

  const validate = () => {
    const next = {}
    if (step === 1) {
      ;['name','age','gender','status','identity','campus','faculty','program','whatsapp','email'].forEach((field) => { if (!required(data.reporter[field])) next[field] = 'Wajib diisi' })
    }
    if (step === 2 && !data.reporterIsVictim) {
      ;['name','gender','status','faculty','program','contact','relation'].forEach((field) => { if (!required(data.victim[field])) next[field] = 'Wajib diisi' })
    }
    if (step === 3) data.parties.forEach((party, index) => { if (!required(party.name)) next[`party${index}`] = 'Nama terlapor wajib diisi' })
    if (step === 4) {
      if (!data.incidents.some((item) => required(item.dateStart) && required(item.description) && required(item.location))) next.incidents = 'Lengkapi minimal satu kejadian'
      if (data.violationTypes.length === 0) next.violationTypes = 'Pilih minimal satu jenis dugaan'
    }
    if (step === 5) {
      if (!required(data.evidence.chronology)) next.chronology = 'Kronologi wajib diisi'
      if (data.evidence.files.length === 0) next.files = 'Unggah minimal satu bukti'
    }
    if (step === 6 && (!data.consent || data.consentVersion !== '1.0')) next.consent = 'Persetujuan wajib dicentang'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const next = () => { if (validate()) setStep((current) => Math.min(6, current + 1)) }

  const submit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('data', JSON.stringify(data))
      data.evidence.files.forEach((file) => formData.append('evidences', file))
      const result = await createReport(formData)
      navigate('/lapor/berhasil', { state: result })
    } catch (error) {
      setErrors({ submit: error.status === 429 ? 'Terlalu sering mengirim. Coba lagi nanti.' : 'Laporan gagal dikirim.' })
    } finally { setLoading(false) }
  }

  return <section style={{ maxWidth: 1180, margin: '0 auto', padding: '38px 24px' }}><h1 style={{ fontSize: 32, margin: '0 0 24px' }}>Formulir Pelaporan</h1><Stepper steps={steps} current={step} /><div className="card" style={{ padding: 28 }}>
    {step === 1 && <><h2 style={{ marginBottom: 20 }}>Langkah 1: Data pelapor</h2><div className="report-grid">{['name','age','gender','status','identity','campus','faculty','program','whatsapp','email'].map((field) => field === 'gender' || field === 'status' ? <Select key={field} label={{gender:'Jenis kelamin',status:'Status'}[field]} id={field} value={data.reporter[field]} error={errors[field]} onChange={(e) => setNested('reporter', field, e.target.value)}><option value="">Pilih</option>{(field === 'gender' ? ['Laki-laki','Perempuan','Lainnya'] : ['Mahasiswa','Dosen','Tenaga kependidikan','Lainnya']).map((value) => <option key={value}>{value}</option>)}</Select> : <Input key={field} label={{name:'Nama lengkap',age:'Usia',identity:'NIM / NIP / NIK',campus:'Asal kampus / instansi',faculty:'Fakultas / direktorat',program:'Program studi / bagian',whatsapp:'Nomor WhatsApp',email:'Email'}[field]} id={field} value={data.reporter[field]} error={errors[field]} onChange={(e) => setNested('reporter', field, e.target.value)} />)}</div></>}

    {step === 2 && <><h2>Langkah 2: Korban</h2><div style={{ display: 'grid', gap: 8, margin: '12px 0 20px' }}><Checkbox label="Ya, saya korban langsung" id="is-victim" checked={data.reporterIsVictim} onChange={(e) => setData((c) => ({ ...c, reporterIsVictim: e.target.checked }))} /><Checkbox label="Tidak, saya melapor untuk orang lain" checked={!data.reporterIsVictim} onChange={(e) => setData((c) => ({ ...c, reporterIsVictim: !e.target.checked }))} /></div>{!data.reporterIsVictim && <div className="report-grid"><Input label="Nama korban" id="victim-name" value={data.victim.name} error={errors.name} onChange={(e) => setNested('victim', 'name', e.target.value)} /><Select label="Jenis kelamin" id="victim-gender" value={data.victim.gender} error={errors.gender} onChange={(e) => setNested('victim', 'gender', e.target.value)}><option value="">Pilih</option><option>Laki-laki</option><option>Perempuan</option></Select><Select label="Status" id="victim-status" value={data.victim.status} error={errors.status} onChange={(e) => setNested('victim', 'status', e.target.value)}><option value="">Pilih</option><option>Mahasiswa</option><option>Dosen</option><option>Tenaga kependidikan</option></Select><Input label="Fakultas / direktorat" id="victim-faculty" value={data.victim.faculty} error={errors.faculty} onChange={(e) => setNested('victim', 'faculty', e.target.value)} /><Input label="Program studi / bagian" id="victim-program" value={data.victim.program} error={errors.program} onChange={(e) => setNested('victim', 'program', e.target.value)} /><Input label="Nomor kontak" id="victim-contact" value={data.victim.contact} error={errors.contact} onChange={(e) => setNested('victim', 'contact', e.target.value)} /><Input label="Hubungan dengan terlapor" id="victim-relation" value={data.victim.relation} error={errors.relation} onChange={(e) => setNested('victim', 'relation', e.target.value)} /></div>}</>}

    {step === 3 && <><h2>Langkah 3: Terlapor</h2>{data.parties.map((party, index) => <div key={index} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: '1px solid var(--border)' }}><h3 style={{ fontSize: 16 }}>Terlapor {index + 1}</h3><div className="report-grid"><Input label="Nama terlapor" value={party.name} error={errors[`party${index}`]} onChange={(e) => setArrayItem('parties', index, 'name', e.target.value)} /><Select label="Jenis kelamin" value={party.gender} onChange={(e) => setArrayItem('parties', index, 'gender', e.target.value)}><option value="">Pilih</option><option>Laki-laki</option><option>Perempuan</option></Select><Input label="NIM / NIP / NIK" value={party.identity} onChange={(e) => setArrayItem('parties', index, 'identity', e.target.value)} /><Input label="Asal instansi" value={party.campus} onChange={(e) => setArrayItem('parties', index, 'campus', e.target.value)} /><Input label="Fakultas / direktorat" value={party.faculty} onChange={(e) => setArrayItem('parties', index, 'faculty', e.target.value)} /><Input label="Program studi / bagian" value={party.program} onChange={(e) => setArrayItem('parties', index, 'program', e.target.value)} /></div></div>)}<Button variant="outline" onClick={() => setData((c) => ({ ...c, parties: [...c.parties, { name: '', gender: '', identity: '', campus: '', faculty: '', program: '', contact: '', relation: '' }] }))}>+ Tambah terlapor</Button></>}

    {step === 4 && <><h2>Langkah 4: Kejadian</h2>{data.incidents.map((incident, index) => <div key={index} style={{ marginBottom: 20 }}><div className="report-grid"><Input label="Tanggal kejadian" type="date" value={incident.dateStart} onChange={(e) => setArrayItem('incidents', index, 'dateStart', e.target.value)} /><Input label="Sampai tanggal (jika rentang)" type="date" value={incident.dateEnd} onChange={(e) => setArrayItem('incidents', index, 'dateEnd', e.target.value)} /><Input label="Lokasi" value={incident.location} onChange={(e) => setArrayItem('incidents', index, 'location', e.target.value)} /></div><div style={{ marginTop: 16 }}><Textarea label="Uraian kejadian" value={incident.description} onChange={(e) => setArrayItem('incidents', index, 'description', e.target.value)} /></div></div>)}<Button variant="outline" onClick={() => setData((c) => ({ ...c, incidents: [...c.incidents, { dateStart: '', dateEnd: '', location: '', description: '' }] }))}>+ Tambah kejadian</Button><div style={{ marginTop: 20 }}><b>Jenis dugaan kekerasan *</b><div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 4, marginTop: 8 }}>{VIOLATION_TYPES.map((type) => <Checkbox key={type} label={type} checked={data.violationTypes.includes(type)} onChange={(e) => setData((c) => ({ ...c, violationTypes: e.target.checked ? [...c.violationTypes, type] : c.violationTypes.filter((item) => item !== type) }))} />)}</div>{errors.violationTypes && <div className="error-text" role="alert">{errors.violationTypes}</div>}</div></>}

    {step === 5 && <><h2>Langkah 5: Bukti</h2><Textarea label="Kronologi singkat *" value={data.evidence.chronology} error={errors.chronology} onChange={(e) => setNested('evidence', 'chronology', e.target.value)} /><div style={{ marginTop: 16 }}><Textarea label="Deskripsi tambahan" value={data.evidence.additionalDescription} onChange={(e) => setNested('evidence', 'additionalDescription', e.target.value)} /></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}><Checkbox label="Sudah melapor ke pihak lain" checked={data.evidence.reportedElsewhere} onChange={(e) => setNested('evidence', 'reportedElsewhere', e.target.checked)} /><Input label="Pihak yang sudah dituju" value={data.evidence.reportedTo} onChange={(e) => setNested('evidence', 'reportedTo', e.target.value)} /><Textarea label="Upaya yang dilakukan" value={data.evidence.effortsMade} onChange={(e) => setNested('evidence', 'effortsMade', e.target.value)} /><Textarea label="Harapan terhadap penanganan" value={data.evidence.expectation} onChange={(e) => setNested('evidence', 'expectation', e.target.value)} /></div><div style={{ marginTop: 16 }}><FileUpload files={data.evidence.files} error={errors.files} onChange={(files) => setNested('evidence', 'files', files)} /></div></>}

    {step === 6 && <><h2>Langkah 6: Persetujuan</h2><div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 16 }}>Saya menyatakan bahwa data dan bukti yang saya sampaikan adalah benar. (Versi pernyataan 1.0)</div><Checkbox label="Saya menyetujui pernyataan di atas" checked={data.consent} onChange={(e) => { setData((c) => ({ ...c, consent: e.target.checked, consentVersion: '1.0' })) }} /><div style={{ height: 58, margin: '16px 0', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 16px', color: 'var(--muted)' }}>CaptchaPlaceholder</div>{errors.consent && <div className="error-text" role="alert">{errors.consent}</div>}{errors.submit && <div className="error-text" role="alert">{errors.submit}</div>}</>}

    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 20 }}><Button variant="outline" onClick={() => step === 1 ? navigate('/') : setStep(step - 1)}>Kembali</Button>{step < 6 ? <Button onClick={next}>Lanjut</Button> : <Button onClick={submit} disabled={loading}>{loading ? 'Mengirim...' : 'Kirim Laporan'}</Button>}</div>
  </div></section>
}

