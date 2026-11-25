import { useState } from 'react'
import Button from '../../components/ui/Button'
import FileUpload from '../../components/ui/FileUpload'
import { addCaseEvidence, downloadEvidence } from '../../services/cases'

function formatSize(bytes) {
  if (!bytes) return '—'
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export default function CaseEvidenceTab({ caseData, canEdit, onAction }) {
  const [files, setFiles] = useState([])
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')

  async function download(file) {
    try {
      const blob = await downloadEvidence(caseData.id, file.id)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = blob.type === 'text/plain' ? `${file.originalName}.dummy.txt` : file.originalName
      link.click()
      URL.revokeObjectURL(url)
      await onAction(async () => {}, 'Bukti diunduh. Aktivitas tercatat.')
    } catch (downloadError) {
      setError(downloadError.message || 'Berkas gagal diunduh.')
    }
  }

  return <div className="case-tab-stack">
    <section className="card case-tab-card">
      <h2>Bukti kasus</h2>
      {caseData.evidences.length === 0 ? <p className="muted-copy">Belum ada bukti yang dilampirkan.</p> : <div className="evidence-list">{caseData.evidences.map((file) => <div className="evidence-row" key={file.id}><div><strong>{file.originalName}</strong><small>{file.mimeType || file.category || 'Berkas'} · {formatSize(file.sizeBytes)} · diunggah {file.uploadedBy} {file.uploadedAt && `/${file.uploadedAt}`}</small></div><div className="evidence-actions"><Button variant="outline" onClick={() => setPreview(file)}>Lihat</Button><Button variant="outline" onClick={() => download(file)}>Unduh</Button></div></div>)}</div>}
      <p className="muted-copy" style={{ marginTop: 12 }}>Setiap unduhan bukti tercatat di audit log.</p>
      {error && <p role="alert" className="error-text">{error}</p>}
    </section>
    <section className="card case-tab-card">
      <h2>Tambah bukti</h2>
      {!canEdit && <p className="muted-copy">Hanya Satgas penanggung jawab yang dapat mengunggah bukti.</p>}
      <FileUpload files={files} onChange={setFiles} disabled={!canEdit} />
      <Button disabled={!canEdit || files.length === 0} style={{ marginTop: 16 }} onClick={() => onAction(async () => {
        const formData = new FormData()
        files.forEach((file) => formData.append('evidences', file))
        await addCaseEvidence(caseData.id, formData, 'BUKTI')
        setFiles([])
      }, 'Bukti berhasil ditambahkan.')}>Simpan bukti</Button>
    </section>
    {preview && <div className="case-modal-backdrop" role="presentation" onClick={() => setPreview(null)}><section role="dialog" aria-modal="true" aria-labelledby="evidence-preview-title" className="card case-preview-modal" onClick={(event) => event.stopPropagation()}><h2 id="evidence-preview-title">Pratinjau bukti</h2><p><strong>{preview.originalName}</strong></p><p className="muted-copy">Berkas ini merupakan data dummy prototipe. Konten bukti tidak tersedia untuk pratinjau.</p><Button variant="outline" onClick={() => setPreview(null)}>Tutup</Button></section></div>}
  </div>
}
