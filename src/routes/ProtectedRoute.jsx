import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ allowedRoles, children }) {
  const { session } = useAuth()
  const location = useLocation()

  if (!session) return <Navigate to="/login" replace state={{ message: 'Sesi berakhir', from: location.pathname }} />
  if (!allowedRoles.includes(session.role)) return <Navigate to="/login" replace />
  return children
}
