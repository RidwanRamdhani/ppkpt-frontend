export default function PlaceholderPage({ title = 'Halaman', children }) {
  return <section style={{ maxWidth: 1180, margin: '0 auto', padding: '48px 24px' }}><div className="card" style={{ padding: 32 }}><h1 style={{ fontSize: 30, margin: '0 0 12px' }}>{title}</h1>{children || <p style={{ color: 'var(--muted)' }}>Konten fase berikutnya.</p>}</div></section>
}
