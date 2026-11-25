import { apiRequest } from './apiClient'
import { mockResponse } from './mock'

const useMock = import.meta.env.VITE_USE_MOCK !== 'false'
const dummyCases = [
  { id: '20481735', caseNumber: '20481735', violationType: 'Seksual', channel: 'Portal', status: 'DILAPORKAN', assignedTo: null, daysLeft: 5 },
  { id: '20481701', caseNumber: '20481701', violationType: 'Psikis', channel: 'Hotline', status: 'PENELAAHAN', assignedTo: 'Satgas C', daysLeft: 3 },
  { id: '20481622', caseNumber: '20481622', violationType: 'Perundungan', channel: 'Rujukan unit', status: 'PEMERIKSAAN', assignedTo: 'Satgas B', daysLeft: -3 },
  { id: '20481590', caseNumber: '20481590', violationType: 'Perundungan', channel: 'Rujukan unit', status: 'PEMERIKSAAN', assignedTo: 'Satgas B', daysLeft: 9 },
  { id: '20481411', caseNumber: '20481411', violationType: 'Fisik', channel: 'Portal', status: 'SELESAI', assignedTo: 'Satgas A', daysLeft: null },
  { id: '20481333', caseNumber: '20481333', violationType: 'Psikis', channel: 'Tatap muka', status: 'PERLU_DILENGKAPI', assignedTo: 'Satgas A', daysLeft: 4 },
  { id: '20481290', caseNumber: '20481290', violationType: 'Diskriminasi dan intoleransi', channel: 'Portal', status: 'REKOMENDASI', assignedTo: 'Satgas C', daysLeft: 2 },
  { id: '20481277', caseNumber: '20481277', violationType: 'Seksual', channel: 'Hotline', status: 'PEMERIKSAAN', assignedTo: 'Satgas A', daysLeft: 18 },
  { id: '20481144', caseNumber: '20481144', violationType: 'Fisik', channel: 'Rujukan unit', status: 'PENELAAHAN', assignedTo: 'Satgas B', daysLeft: 6 },
  { id: '20481098', caseNumber: '20481098', violationType: 'Psikis', channel: 'Portal', status: 'KEPUTUSAN', assignedTo: 'Satgas C', daysLeft: null },
  { id: '20481031', caseNumber: '20481031', violationType: 'Perundungan', channel: 'Tatap muka', status: 'PEMANTAUAN', assignedTo: 'Satgas A', daysLeft: null },
  { id: '20480987', caseNumber: '20480987', violationType: 'Seksual', channel: 'Portal', status: 'SELESAI', assignedTo: 'Satgas A', daysLeft: null },
  { id: '20480812', caseNumber: '20480812', violationType: 'Perundungan', channel: 'Hotline', status: 'SELESAI', assignedTo: 'Satgas B', daysLeft: null },
  { id: '20480655', caseNumber: '20480655', violationType: 'Fisik', channel: 'Rujukan unit', status: 'SELESAI', assignedTo: 'Satgas C', daysLeft: null },
  { id: '20480547', caseNumber: '20480547', violationType: 'Psikis', channel: 'Portal', status: 'PENELAAHAN', assignedTo: null, daysLeft: 2 },
]
let cases = [...dummyCases]
let nextCaseNumber = 20481842
const caseDetails = new Map()

function createCaseDetail(record) {
  const history = [
    { action: 'Laporan diterima', actor: 'Sistem', at: '2026-10-02T08:15:00.000Z' },
    { action: 'Kasus diambil', actor: record.assignedTo || 'Belum ditugaskan', at: '2026-10-13T09:20:00.000Z' },
  ]
  return {
    ...record,
    createdAt: '2026-10-02',
    reporter: { name: 'Rina Pelapor (dummy)', age: 21, gender: 'Perempuan', status: 'Mahasiswa', identity: '1301230001', faculty: 'Informatika / S1 Informatika', whatsapp: '0812xxxxxx01', email: 'rina@example.test' },
    victim: { name: 'Dina Korban (dummy)', gender: 'Perempuan', status: 'Mahasiswa', faculty: 'Informatika / S1 Informatika', contact: '0813xxxxxx02', relation: 'Teman satu kelas' },
    reportedPerson: { name: 'Budi Terlapor (dummy)', status: 'Mahasiswa', identity: '1301220099', faculty: 'Informatika / S1 Informatika', relation: 'Teman satu kelas' },
    incidents: [{ dateStart: '2026-09-15', dateEnd: '2026-09-18', location: 'Gedung Fakultas, lantai 3', description: 'Korban mengalami tindakan yang tidak diinginkan berulang kali selama kegiatan kelompok. Kejadian dirasakan mengganggu aktivitas belajar. (Data dummy.)' }],
    chronology: 'Laporan dan kronologi contoh untuk prototipe. Seluruh keterangan pada halaman ini adalah data dummy.',
    additionalDescription: 'Data contoh untuk demonstrasi.',
    reportedElsewhere: false,
    violationTypes: [record.violationType],
    evidences: record.id === '20481590' ? [
      { id: 'evidence-1', originalName: 'Tangkapan layar percakapan.png', mimeType: 'image/png', sizeBytes: 2100000, uploadedBy: 'Pelapor', uploadedAt: '13/10/2026' },
      { id: 'evidence-2', originalName: 'Rekaman suara saksi.pdf', mimeType: 'application/pdf', sizeBytes: 600000, uploadedBy: 'Satgas B', uploadedAt: '06/10/2026' },
      { id: 'evidence-3', originalName: 'Surat keterangan konseling.pdf', mimeType: 'application/pdf', sizeBytes: 900000, uploadedBy: 'Satgas A', uploadedAt: '02/10/2026' },
    ] : [],
    verification: { checks: [], result: '', note: '', violationType: record.violationType },
    review: { summary: '', sessions: [], examDueDays: record.daysLeft },
    caseCondition: 'TIDAK_DARURAT',
    referrals: [],
    recovery: { status: 'Belum dipantau', note: '' },
    conclusion: { result: '', category: '', severity: '', basis: '', submitted: false },
    delivery: null,
    history,
  }
}

function getMutableCaseDetail(id) {
  if (!caseDetails.has(id)) {
    const record = cases.find((item) => item.id === id) || { id, caseNumber: id, status: 'PENELAAHAN', assignedTo: null, channel: 'Portal', violationType: 'Belum diverifikasi', daysLeft: 7 }
    caseDetails.set(id, createCaseDetail(record))
  }
  return caseDetails.get(id)
}

function addActivity(detail, action, actor = detail.assignedTo || 'Satgas A') {
  detail.history.unshift({ action, actor, at: new Date().toISOString() })
}

async function updateMockCase(id, updater) {
  const detail = getMutableCaseDetail(id)
  updater(detail)
  return mockResponse(detail, 350)
}

export async function getCases(filters = {}) {
  if (!useMock) {
    const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== '' && value != null)).toString()
    return apiRequest(`/api/cases${query ? `?${query}` : ''}`)
  }

  const { search = '', status = '', violationType = '', channel = '', page = 1, pageSize = 10 } = filters
  const filtered = cases.filter((item) =>
    item.caseNumber.includes(search) &&
    (!status || item.status === status) &&
    (!violationType || item.violationType === violationType) &&
    (!channel || item.channel === channel),
  )
  const start = (Number(page) - 1) * Number(pageSize)
  return mockResponse({ items: filtered.slice(start, start + Number(pageSize)), total: filtered.length })
}

export async function createCase(payload) {
  if (!useMock) return apiRequest('/api/cases', { method: 'POST', body: JSON.stringify(payload) })
  const caseNumber = String(nextCaseNumber++)
  cases = [{ id: caseNumber, caseNumber, violationType: payload.violationTypes?.[0] || 'Belum diverifikasi', channel: payload.channel || 'Tatap muka', status: 'DILAPORKAN', assignedTo: payload.assignToMe ? 'Satgas A' : null, daysLeft: 7 }, ...cases]
  const detail = createCaseDetail(cases[0])
  if (payload.reporter) detail.reporter = { ...detail.reporter, ...payload.reporter, whatsapp: payload.reporter.contact || '' }
  if (payload.victim) detail.victim = { ...detail.victim, ...payload.victim }
  if (payload.perpetrator) detail.reportedPerson = { ...detail.reportedPerson, ...payload.perpetrator }
  if (payload.incidents?.length) {
    detail.incidents = payload.incidents
    detail.chronology = payload.incidents.map((incident) => incident.description).filter(Boolean).join('\n')
  }
  if (payload.violationTypes?.length) detail.violationTypes = payload.violationTypes
  if (payload.officerNote) detail.additionalDescription = payload.officerNote
  if (payload.evidences?.length) {
    detail.evidences = payload.evidences.map((file, index) => ({
      ...file,
      id: `evidence-${caseNumber}-${index}`,
      uploadedBy: 'Satgas A',
      uploadedAt: new Date().toLocaleDateString('id-ID'),
    }))
  }
  caseDetails.set(caseNumber, detail)
  return mockResponse({ caseNumber, pin: '483920' }, 450)
}

export async function getCase(id) {
  if (!useMock) return apiRequest(`/api/cases/${id}`)
  if (!cases.some((record) => record.id === id)) {
    const error = new Error('Kasus tidak ditemukan.')
    error.status = 404
    throw error
  }
  return mockResponse(getMutableCaseDetail(id))
}

export async function takeCase(id, assignedTo = 'Satgas A') {
  if (!useMock) return apiRequest(`/api/cases/${id}/take`, { method: 'POST' })
  cases = cases.map((item) => item.id === id ? { ...item, assignedTo } : item)
  const detail = getMutableCaseDetail(id)
  detail.assignedTo = assignedTo
  addActivity(detail, 'Kasus diambil')
  return mockResponse({ ok: true })
}

export async function saveVerification(id, payload) {
  if (!useMock) return apiRequest(`/api/cases/${id}/verification`, { method: 'POST', body: JSON.stringify(payload) })
  return updateMockCase(id, (detail) => {
    detail.verification = { ...detail.verification, ...payload }
    detail.status = payload.result === 'PERLU_DILENGKAPI' ? 'PERLU_DILENGKAPI' : 'PENELAAHAN'
    if (payload.violationType) detail.violationTypes = [payload.violationType]
    detail.violationType = payload.violationType || detail.violationType
    cases = cases.map((item) => item.id === id ? { ...item, status: detail.status, violationType: payload.violationType || item.violationType } : item)
    addActivity(detail, `Verifikasi disimpan: ${payload.result}`)
  })
}

export async function saveReview(id, payload) {
  if (!useMock) return apiRequest(`/api/cases/${id}/review`, { method: 'POST', body: JSON.stringify(payload) })
  return updateMockCase(id, (detail) => {
    detail.review = { ...detail.review, ...payload }
    detail.status = 'PEMERIKSAAN'
    cases = cases.map((item) => item.id === id ? { ...item, status: 'PEMERIKSAAN' } : item)
    addActivity(detail, 'Penelaahan diperbarui')
  })
}

export async function addExaminationSession(id, payload) {
  if (!useMock) return apiRequest(`/api/cases/${id}/sessions`, { method: 'POST', body: JSON.stringify(payload) })
  return updateMockCase(id, (detail) => {
    detail.review.sessions.push({ ...payload, id: `session-${Date.now()}` })
    addActivity(detail, `Sesi pemeriksaan ditambahkan: ${payload.party}`)
  })
}

export async function addCaseEvidence(id, formData, category = 'BUKTI') {
  if (!useMock) {
    formData.append('category', category)
    return apiRequest(`/api/cases/${id}/evidences`, { method: 'POST', body: formData })
  }
  const files = formData.getAll('evidences')
  return updateMockCase(id, (detail) => {
    for (const file of files) {
      detail.evidences.push({
        id: `evidence-${Date.now()}-${detail.evidences.length}`,
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        uploadedBy: 'Satgas A',
        uploadedAt: new Date().toLocaleDateString('id-ID'),
        category,
      })
    }
    addActivity(detail, category === 'BAI' ? 'Berita acara pemeriksaan diunggah' : 'Bukti tambahan diunggah')
  })
}

export async function saveCaseCondition(id, payload) {
  if (!useMock) return apiRequest(`/api/cases/${id}/condition`, { method: 'PUT', body: JSON.stringify(payload) })
  return updateMockCase(id, (detail) => {
    detail.caseCondition = payload.caseCondition
    addActivity(detail, 'Kondisi kasus diperbarui')
  })
}

export async function addReferral(id, payload) {
  if (!useMock) return apiRequest(`/api/cases/${id}/referrals`, { method: 'POST', body: JSON.stringify(payload) })
  return updateMockCase(id, (detail) => {
    detail.referrals.push({ ...payload, id: `referral-${Date.now()}`, status: 'Diajukan', createdAt: new Date().toLocaleDateString('id-ID') })
    addActivity(detail, `Rujukan layanan ditambahkan: ${payload.service}`)
  })
}

export async function saveRecovery(id, payload) {
  if (!useMock) return apiRequest(`/api/cases/${id}/recovery`, { method: 'POST', body: JSON.stringify(payload) })
  return updateMockCase(id, (detail) => {
    detail.recovery = { ...detail.recovery, ...payload }
    addActivity(detail, 'Pemantauan pemulihan diperbarui')
  })
}

export async function saveConclusion(id, payload) {
  if (!useMock) return apiRequest(`/api/cases/${id}/conclusion`, { method: 'POST', body: JSON.stringify(payload) })
  return updateMockCase(id, (detail) => {
    detail.conclusion = { ...detail.conclusion, ...payload, submitted: false }
    addActivity(detail, 'Draf kesimpulan disimpan')
  })
}

export async function submitConclusion(id) {
  if (!useMock) return apiRequest(`/api/cases/${id}/conclusion/submit`, { method: 'POST' })
  return updateMockCase(id, (detail) => {
    detail.conclusion.submitted = true
    detail.status = 'REKOMENDASI'
    cases = cases.map((item) => item.id === id ? { ...item, status: 'REKOMENDASI' } : item)
    addActivity(detail, 'Rekomendasi diajukan ke pejabat')
  })
}

export async function saveDelivery(id, payload) {
  if (!useMock) return apiRequest(`/api/cases/${id}/delivery`, { method: 'POST', body: JSON.stringify(payload) })
  return updateMockCase(id, (detail) => {
    detail.delivery = { ...payload, recordedAt: new Date().toISOString() }
    addActivity(detail, 'Penyampaian hasil keputusan dicatat')
  })
}

export async function closeCase(id) {
  if (!useMock) return apiRequest(`/api/cases/${id}/close`, { method: 'POST' })
  return updateMockCase(id, (detail) => {
    detail.status = 'SELESAI'
    cases = cases.map((item) => item.id === id ? { ...item, status: 'SELESAI' } : item)
    addActivity(detail, 'Kasus ditutup')
  })
}

export async function downloadEvidence(caseId, evidenceId) {
  if (useMock) {
    const detail = getMutableCaseDetail(caseId)
    const evidence = detail.evidences.find((item) => item.id === evidenceId)
    if (!evidence) throw new Error('Berkas bukti tidak ditemukan.')
    addActivity(detail, `Bukti diunduh: ${evidence.originalName}`)
    return mockResponse(new Blob([`Data dummy prototipe untuk ${evidence.originalName}.`], { type: 'text/plain' }))
  }
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/evidences/${evidenceId}/download`, { credentials: 'include' })
  if (!response.ok) {
    const error = new Error('Berkas bukti gagal diunduh.')
    error.status = response.status
    throw error
  }
  return response.blob()
}

export { dummyCases }
