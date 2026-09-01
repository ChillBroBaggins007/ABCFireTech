import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import type { UserRole } from '../lib/supabase'

export default function ProtectedRoute({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const { session, profile } = useAuth()

  if (!session) return <Navigate to="/signin" replace />
  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    )
  }
  if (profile.role !== role) {
    return <Navigate to={profile.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }
  return <>{children}</>
}
