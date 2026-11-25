function InfoCard({ title, rows }) {
  return <section className="card case-info-card"><h2>{title}</h2><dl>{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || 'Tidak tersedia'}</dd></div>)}</dl></section>
}

export default function CaseDataTab({ caseData }) {
  const reporter = caseData.reporter || {}
  const victim = caseData.victim || {}
  const perpetrator = caseData.reportedPerson || {}
  const incident = caseData.incidents?.[0] || {}
  const types = caseData.violationTypes?.join(', ') || caseData.violationType

  return <div className="case-info-grid">
    <InfoCard title="Pelapor" rows={[
      ['Nama', reporter.name], ['Usia / gender', [reporter.age, reporter.gender].filter(Boolean).join(' / ')],
      ['Status', reporter.status], ['NIM / NIP / NIK', reporter.identity], ['Fakultas / prodi', reporter.faculty],
      ['WhatsApp', reporter.whatsapp], ['Email', reporter.email],
    ]} />
    <InfoCard title="Korban" rows={[
      ['Nama', victim.name], ['Jenis kelamin', victim.gender], ['Status', victim.status],
      ['Fakultas / prodi', victim.faculty], ['Kontak', victim.contact], ['Hubungan dengan terlapor', victim.relation],
    ]} />
    <InfoCard title="Terlapor" rows={[
      ['Nama', perpetrator.name], ['Status', perpetrator.status], ['NIM / NIP / NIK', perpetrator.identity],
      ['Fakultas / prodi', perpetrator.faculty], ['Hubungan dengan korban', perpetrator.relation],
    ]} />
    <InfoCard title="Kejadian" rows={[
      ['Tanggal', [incident.dateStart, incident.dateEnd].filter(Boolean).join(' sampai ')],
      ['Lokasi', incident.location], ['Jenis dugaan', types], ['Kanal laporan', caseData.channel],
      ['Sudah lapor ke pihak lain', caseData.reportedElsewhere ? 'Ya' : 'Belum'],
    ]} />
    <section className="card case-description-card"><h2>Uraian kejadian</h2><p>{incident.description || caseData.chronology}</p>{caseData.additionalDescription && <p>{caseData.additionalDescription}</p>}</section>
  </div>
}
