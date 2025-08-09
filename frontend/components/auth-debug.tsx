'use client'

import { useAuth } from '@/lib/auth-context'

export function AuthDebug() {
  const { user, loading } = useAuth()

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div>Loading: {loading ? 'true' : 'false'}</div>
      <div>User: {user ? 'Logged in' : 'Not logged in'}</div>
      {user && (
        <div>
          <div>Name: {user.name}</div>
          <div>Email: {user.email}</div>
          <div>Role: {user.role}</div>
        </div>
      )}
      <div>Token: {typeof window !== 'undefined' ? (localStorage.getItem('token') ? 'Present' : 'Missing') : 'N/A'}</div>
    </div>
  )
}
