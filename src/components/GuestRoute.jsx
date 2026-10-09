import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/** The inverse of ProtectedRoute: sends already-logged-in users away from
 * auth pages (login/signup/forgot password) to their dashboard. */
export default function GuestRoute({ children }) {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
