import { useContext } from 'react'
import { authContext } from './context'
import type { AuthContextValue } from './context'

export function useAuth(): AuthContextValue {
  const ctx = useContext(authContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
