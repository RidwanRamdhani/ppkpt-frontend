function formatTimestamp(value) {
  const date = new Date(value)
  return Number.isNaN(date.valueOf()) ? value : date.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function CaseHistoryTab({ caseData }) {
  return <section className="card case-tab-card">
    <h2>Riwayat aktivitas kasus</h2>
    {!caseData.history?.length ? <p className="muted-copy">Belum ada aktivitas yang tercatat.</p> : <ol className="case-timeline">{caseData.history.map((item, index) => <li key={`${item.action}-${item.at}-${index}`}><span className="timeline-marker" /><div><strong>{item.action}</strong><p>{formatTimestamp(item.at)} oleh {item.actor}</p></div></li>)}</ol>}
  </section>
}
