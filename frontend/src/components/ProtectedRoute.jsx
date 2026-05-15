import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export function ProtectedRoute({ children, role }) {
  const { isAuthed, user } = useAuth()
  if (!isAuthed) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/" replace />
  return children
}

