export default function FileUpload({ label = 'Unggah bukti', files = [], onChange, accept = '.pdf,.jpg,.jpeg,.png', maxSize = 10 * 1024 * 1024, error }) {
  function handleFiles(event) {
    const incoming = Array.from(event.target.files || [])
    const accepted = incoming.filter((file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type) && file.size <= maxSize)
    onChange([...files, ...accepted].slice(0, 10))
  }
  return <div><div className="card" style={{ borderStyle: 'dashed', borderRadius: 8, padding: 20, textAlign: 'center' }}><div style={{ color: 'var(--muted)', marginBottom: 10 }}>{label} · PDF, JPG, PNG, maksimal 10 MB per berkas</div><input id="evidence-files" type="file" accept={accept} multiple onChange={handleFiles} /><label htmlFor="evidence-files" className="btn btn-outline" style={{ margin: '10px auto 0', cursor: 'pointer' }}>Pilih berkas</label></div>{error && <div className="error-text" role="alert">{error}</div>}<div style={{ display: 'grid', gap: 8, marginTop: 10 }}>{files.map((file, index) => <div key={`${file.name}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px' }}><span>{file.name}</span><button type="button" className="btn btn-outline" style={{ minHeight: 36, padding: '6px 10px' }} onClick={() => onChange(files.filter((_, i) => i !== index))}>Hapus</button></div>)}</div></div>
}
