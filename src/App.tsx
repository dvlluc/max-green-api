import { Navigate, Route, Routes } from 'react-router'
import LoginPage from './pages/LoginPage'
import ChatsPage from './pages/ChatsPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chats" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/chats" element={<ChatsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
