import { useState } from 'react'
import type { Credentials } from './types'
import LoginForm from './components/LoginForm'
import ChatWindow from './components/ChatWindow'

export default function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(() => {
    const stored = localStorage.getItem('max-chat-creds')
    return stored ? JSON.parse(stored) : null
  })

  const handleConnect = (creds: Credentials) => {
    localStorage.setItem('max-chat-creds', JSON.stringify(creds))
    setCredentials(creds)
  }

  const handleLogout = () => {
    localStorage.removeItem('max-chat-creds')
    setCredentials(null)
  }

  if (!credentials) {
    return <LoginForm onConnect={handleConnect} />
  }

  return <ChatWindow credentials={credentials} onLogout={handleLogout} />
}
