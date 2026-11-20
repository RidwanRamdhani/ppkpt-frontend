import { getStaffStatus } from '../../constants/status'

export default function StatusBadge({ status }) {
  const colors = { DILAPORKAN: '#2563eb', PERLU_DILENGKAPI: '#dc2626', PENELAAHAN: '#d97706', PEMERIKSAAN: '#c8102e', REKOMENDASI: '#7c3aed', KEPUTUSAN: '#059669', PEMANTAUAN: '#0891b2', SELESAI: '#059669' }
  return <span className="status-dot" style={{ color: colors[status] || '#6b7280' }}>{getStaffStatus(status)}</span>
}
