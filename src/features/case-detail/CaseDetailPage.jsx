import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'
import CaseConclusionTab from './CaseConclusionTab'
import CaseDataTab from './CaseDataTab'
import CaseEvidenceTab from './CaseEvidenceTab'
import CaseHistoryTab from './CaseHistoryTab'
import CaseReferralTab from './CaseReferralTab'
import CaseReviewTab from './CaseReviewTab'
import CaseVerificationTab from './CaseVerificationTab'
import { useAuth } from '../../hooks/useAuth'
import { getCase, takeCase } from '../../services/cases'

const tabs = [
  ['data', 'Data laporan'],
  ['evidence', 'Bukti'],
  ['verification', 'Verifikasi'],
  ['review', 'Penelaahan dan pemeriksaan'],
  ['referrals', 'Rujukan layanan'],
  ['conclusion', 'Kesimpulan'],
  ['history', 'Riwayat'],
]

function isAssignedTo(caseAssignee, user) {
  if (!caseAssignee || !user) return false
  const assigneeValues = typeof caseAssignee === 'object'
    ? [caseAssignee.id, caseAssignee.name, caseAssignee.username]
    : [caseAssignee]
  return [user.id, user.name, user.teamName].filter(Boolean).some((value) => assigneeValues.includes(value))
}

export default function CaseDetailPage() {
  const { id } = useParams()
  const { session } = useAuth()
  const [caseData, setCaseData] = useState(null)
  const [activeTab, setActiveTab] = useState('data')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    let active = true
    getCase(id)
      .then((result) => {
        if (active) {
          setCaseData(result)
          setError('')
        }
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || 'Detail kasus gagal dimuat.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  async function reloadCase() {
    const result = await getCase(id)
    setCaseData(result)
    setError('')
    return result
  }

  const isOwner = isAssignedTo(caseData?.assignedTo, session?.user)
  const canEdit = Boolean(isOwner && caseData?.status !== 'SELESAI')

  async function runAction(action, successMessage) {
    setSaving(true)
    setError('')
    setToast('')
    try {
      await action()
      await reloadCase()
      setToast(successMessage)
      window.setTimeout(() => setToast(''), 3500)
      return true
    } catch (actionError) {
      setError(actionError.message || 'Perubahan gagal disimpan.')
      return false
    } finally { setSaving(false) }
  }

  async function handleTakeCase() {
    await runAction(() => takeCase(id, session?.user?.teamName || session?.user?.name), 'Kasus berhasil diambil.')
  }

  if (loading) return <p role="status">Memuat detail kasus...</p>
  if (!caseData) return <section className="card case-tab-card"><h1>Detail kasus tidak tersedia</h1><p role="alert">{error}</p><button className="btn btn-outline" type="button" onClick={() => { setLoading(true); reloadCase().catch((loadError) => setError(loadError.message)).finally(() => setLoading(false)) }}>Coba lagi</button><Link className="btn btn-outline" to="/satgas/kasus">Kembali ke daftar kasus</Link></section>

  const activeIndex = tabs.findIndex(([key]) => key === activeTab)
  const handleTabKeyDown = (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (activeIndex + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
    setActiveTab(tabs[nextIndex][0])
    window.requestAnimationFrame(() => document.getElementById(`case-tab-${tabs[nextIndex][0]}`)?.focus())
  }

  let panel
  if (activeTab === 'data') panel = <CaseDataTab caseData={caseData} />
  if (activeTab === 'evidence') panel = <CaseEvidenceTab caseData={caseData} canEdit={canEdit} onAction={runAction} />
  if (activeTab === 'verification') panel = <CaseVerificationTab caseData={caseData} canEdit={canEdit} onAction={runAction} />
  if (activeTab === 'review') panel = <CaseReviewTab caseData={caseData} canEdit={canEdit} onAction={runAction} />
  if (activeTab === 'referrals') panel = <CaseReferralTab caseData={caseData} canEdit={canEdit} onAction={runAction} />
  if (activeTab === 'conclusion') panel = <CaseConclusionTab caseData={caseData} canEdit={canEdit} onAction={runAction} />
  if (activeTab === 'history') panel = <CaseHistoryTab caseData={caseData} />

  return <div className="case-detail-page">
    <header className="case-detail-header">
      <div>
        <Link to="/satgas/kasus" className="case-back-link">‹ Kembali ke daftar kasus</Link>
        <h1>Kasus {caseData.caseNumber}</h1>
        <p>{caseData.violationType} · {caseData.channel} · dilaporkan {caseData.createdAt}</p>
      </div>
      <div className="case-detail-assignee"><StatusBadge status={caseData.status} /><span>{caseData.assignedTo || 'Belum ditugaskan'}</span></div>
    </header>

    {error && <div role="alert" className="case-alert case-alert-error">{error}<button type="button" onClick={() => { setLoading(true); reloadCase().catch((loadError) => setError(loadError.message)).finally(() => setLoading(false)) }}>Coba lagi</button></div>}
    {toast && <div role="status" className="case-alert case-alert-success">{toast}</div>}
    {!isOwner && <div className="case-alert case-alert-info">{caseData.assignedTo ? `Kasus ini ditangani ${typeof caseData.assignedTo === 'object' ? caseData.assignedTo.name : caseData.assignedTo}. Anda dapat melihat detail, tetapi tidak mengubahnya.` : 'Kasus ini belum ditangani oleh anggota Satgas.'}{!caseData.assignedTo && <Button disabled={saving} onClick={handleTakeCase}>{saving ? 'Memproses...' : 'Ambil Kasus'}</Button>}</div>}
    {isOwner && caseData.status === 'SELESAI' && <div className="case-alert case-alert-info">Kasus selesai dan hanya dapat dibaca.</div>}

    <div className="case-tabs-scroll">
      <div className="case-tabs" role="tablist" aria-label="Bagian detail kasus">
        {tabs.map(([key, label]) => <button key={key} id={`case-tab-${key}`} type="button" role="tab" aria-selected={activeTab === key} aria-controls="case-tab-panel" tabIndex={activeTab === key ? 0 : -1} onClick={() => setActiveTab(key)} onKeyDown={handleTabKeyDown}>{label}</button>)}
      </div>
    </div>
    <div id="case-tab-panel" role="tabpanel" aria-labelledby={`case-tab-${activeTab}`} className={saving ? 'case-panel-saving' : ''}>
      {saving && <p className="case-saving-label" role="status">Menyimpan perubahan...</p>}
      {panel}
    </div>
  </div>
}
