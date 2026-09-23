import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Credentials } from '../types'
import { authContext } from './context'
import { clearCredentials, loadCredentials, saveCredentials } from './session'

interface Props {
  children: ReactNode
}

export function AuthProvider({ children }: Props) {
  const [credentials, setCredentials] = useState<Credentials | null>(() =>
    loadCredentials(),
  )

  const login = useCallback((next: Credentials) => {
    saveCredentials(next)
    setCredentials(next)
  }, [])

  const logout = useCallback(() => {
    clearCredentials()
    setCredentials(null)
  }, [])

  const value = useMemo(
    () => ({ credentials, login, logout }),
    [credentials, login, logout],
  )

  return <authContext.Provider value={value}>{children}</authContext.Provider>
}
