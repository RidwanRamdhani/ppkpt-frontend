import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROLES } from '../constants/roles'

export default function StaffLayout() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const satgas = session?.role === ROLES.SATGAS

  const items = satgas
    ? [['/satgas/dashboard', 'Dashboard'], ['/satgas/kasus', 'Daftar Kasus'], ['/satgas/input-manual', 'Input Manual']]
    : [['/pejabat/kasus', 'Daftar Kasus'], ['/pejabat/riwayat', 'Riwayat Keputusan'], ['/pejabat/dashboard', 'Dashboard']]

  const signOut = () => { logout(); navigate('/login') }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '220px 1fr' }}>
      <aside style={{ background: 'white', borderRight: '1px solid var(--border)', padding: '28px 16px' }}>
        <div style={{ color: 'var(--accent)', fontWeight: 800, marginBottom: 32 }}>{satgas ? 'Satgas PPKPT' : 'Pejabat'}</div>
        <nav style={{ display: 'grid', gap: 6 }}>
          {items.map(([path, label]) => <NavLink key={path} to={path} style={({ isActive }) => ({ textDecoration: 'none', color: 'var(--text)', background: isActive ? '#fee2e2' : 'transparent', borderRadius: 8, padding: '12px 14px', fontWeight: isActive ? 700 : 500 })}>{label}</NavLink>)}
        </nav>
        <button type="button" onClick={signOut} style={{ position: 'absolute', bottom: 24, border: 0, background: 'transparent', color: 'var(--muted)', cursor: 'pointer' }}>Keluar</button>
      </aside>
      <main style={{ padding: '32px 24px', minWidth: 0 }}><Outlet /></main>
    </div>
  )
}
