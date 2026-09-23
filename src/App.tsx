import { useState } from 'react'
import type { Credentials } from './types'
import LoginForm from './components/LoginForm'
import ChatWindow from './components/ChatWindow'

export default function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(() => {
    const stored = localStorage.getItem('green-chat-creds')
    return stored ? JSON.parse(stored) : null
  })

  const handleConnect = (creds: Credentials) => {
    localStorage.setItem('green-chat-creds', JSON.stringify(creds))
    setCredentials(creds)
  }

  const handleLogout = () => {
    localStorage.removeItem('green-chat-creds')
    setCredentials(null)
  }

  if (!credentials) {
    return <LoginForm onConnect={handleConnect} />
  }

  return <ChatWindow credentials={credentials} onLogout={handleLogout} />
}
