/**
 * Protected Route Component for authentication-based access control
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  fallback?: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback = null, 
  redirectTo = '/auth' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (requiredRole && !hasRole(requiredRole)) {
        router.push('/unauthorized')
        return
      }
    }
  }, [isAuthenticated, isLoading, requiredRole, hasRole, router, redirectTo])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show fallback if not authenticated
  if (!isAuthenticated) {
    return fallback
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return fallback
  }

  return <>{children}</>
}

// Convenience components for common use cases
export function AdminRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin" fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

export function UserRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="user" fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}
