import { Link, Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <div className="app-shell">
      <header style={{ height: 74, background: 'white', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 1180, width: '100%', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 800 }}><span className="brand-accent">Satgas PPKPT</span> <span style={{ fontWeight: 500 }}>Telkom University</span></Link>
          <nav className="public-nav" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Link to="/" style={{ color: 'var(--text)', textDecoration: 'none' }}>Beranda</Link>
            <Link to="/lapor" style={{ color: 'var(--text)', textDecoration: 'none' }}>Cara Melapor</Link>
            <Link to="/cek-status" style={{ color: 'var(--text)', textDecoration: 'none' }}>Cek Status</Link>
            <Link to="/lapor" className="btn btn-primary" style={{ textDecoration: 'none' }}>Buat Laporan</Link>
          </nav>
        </div>
      </header>
      <main><Outlet /></main>
    </div>
  )
}
