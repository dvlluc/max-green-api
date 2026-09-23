import { useCallback } from 'react'
import { Navigate, useNavigate } from 'react-router'
import ChatWindow from '../components/ChatWindow'
import { useAuth } from '../auth/useAuth'

export default function ChatsPage() {
  const { credentials, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = useCallback(() => {
    logout()
    navigate('/login', { replace: true })
  }, [logout, navigate])

  if (!credentials) return <Navigate to="/login" replace />

  return <ChatWindow credentials={credentials} onLogout={handleLogout} />
}
