import { useCallback } from 'react'
import { Navigate, useNavigate } from 'react-router'
import LoginForm from '../components/LoginForm'
import { useAuth } from '../auth/useAuth'
import type { Credentials } from '../types'

export default function LoginPage() {
  const { credentials, login } = useAuth()
  const navigate = useNavigate()

  const handleConnect = useCallback(
    (creds: Credentials) => {
      login(creds)
      navigate('/chats', { replace: true })
    },
    [login, navigate],
  )

  if (credentials) return <Navigate to="/chats" replace />

  return <LoginForm onConnect={handleConnect} />
}
