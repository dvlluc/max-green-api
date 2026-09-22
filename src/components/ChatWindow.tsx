import { useState, useCallback, useMemo } from 'react'
import { Button, Typography } from '@maxhub/max-ui'
import type { Credentials, Chat, Message } from '../types'
import { createApi } from '../api/greenApi'
import { useNotifications } from '../hooks/useNotifications'
import PhoneInput from './PhoneInput'
import ChatList from './ChatList'
import MessageList from './MessageList'
import MessageInput from './MessageInput'

interface Props {
  credentials: Credentials
  onLogout: () => void
}

export default function ChatWindow({ credentials, onLogout }: Props) {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [error, setError] = useState('')
  const [addingChat, setAddingChat] = useState(false)

  const api = useMemo(() => createApi(credentials), [credentials])

  const handleNewMessage = useCallback(
    (msg: Message) => {
      setMessages((prev) => {
        const chatMessages = prev[msg.chatId] || []
        if (chatMessages.some((m) => m.id === msg.id)) return prev
        return {
          ...prev,
          [msg.chatId]: [...chatMessages, msg],
        }
      })
    },
    [],
  )

  useNotifications(credentials, chats, handleNewMessage, (chat) => {
    setChats((prev) => {
      if (prev.some((c) => c.chatId === chat.chatId)) return prev
      return [...prev, chat]
    })
    setActiveChatId(chat.chatId)
  })

  const handleAddChat = useCallback(async (identifier: string) => {
    setError('')
    setAddingChat(true)
    try {
      const result = await api.checkAccount(identifier)

      if (result.status === false) {
        setError(result.reason || 'Инстанс не авторизован')
        return
      }

      if (!result.exist || !result.chatId) {
        setError('Пользователь не найден в MAX')
        return
      }

      const chat: Chat = {
        chatId: result.chatId,
        phoneNumber: identifier,
      }

      setChats((prev) => {
        if (prev.some((c) => c.chatId === chat.chatId)) return prev
        return [...prev, chat]
      })
      setActiveChatId(chat.chatId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка проверки аккаунта')
    } finally {
      setAddingChat(false)
    }
  }, [api])

  const handleSend = useCallback(async (text: string) => {
    if (!activeChatId) return
    setError('')

    try {
      const result = await api.sendMessage(activeChatId, text)

      const msg: Message = {
        id: result.idMessage,
        chatId: activeChatId,
        text,
        timestamp: Math.floor(Date.now() / 1000),
        isOutgoing: true,
      }

      setMessages((prev) => {
        const chatMessages = prev[activeChatId] || []
        if (chatMessages.some((m) => m.id === msg.id)) return prev
        return {
          ...prev,
          [activeChatId]: [...chatMessages, msg],
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки')
    }
  }, [activeChatId, api])

  const activeChatName = useMemo(
    () => chats.find((c) => c.chatId === activeChatId)?.phoneNumber || activeChatId,
    [chats, activeChatId],
  )

  const handleBack = () => setActiveChatId(null)

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <div
        className={`
          w-full md:w-80 bg-[var(--background-primary)] border-r border-[var(--divider-primary)] flex-col flex
          ${activeChatId ? 'hidden md:flex' : 'flex'}
        `}
        style={{ height: '100vh', flexShrink: 0 }}
      >
        <div
          className="px-4 py-3 bg-[var(--background-primary)] border-b border-[var(--divider-primary)]"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
        >
          <Typography.Title variant="small-strong" color="primary">
            MAX Chat
          </Typography.Title>
          <Button variant="ghost" size="small" onClick={onLogout}>
            Выйти
          </Button>
        </div>

        <PhoneInput onAdd={handleAddChat} loading={addingChat} />

        {error && (
          <div className="px-4 py-2 bg-[var(--button-negative)]/10 text-[var(--text-negative)] text-xs">
            {error}
          </div>
        )}

        <ChatList
          chats={chats}
          activeChatId={activeChatId}
          onSelect={setActiveChatId}
        />
      </div>

      <div
        className={`
          flex-col flex flex-1 bg-[var(--background-secondary)]
          ${activeChatId ? 'flex' : 'hidden md:flex'}
        `}
        style={{ height: '100vh', flex: '1 1 0%', minWidth: 0 }}
      >
        {activeChatId ? (
          <>
            <div
              className="px-4 py-3 bg-[var(--background-primary)] border-b border-[var(--divider-primary)]"
              style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}
            >
              <Button variant="ghost" size="small" onClick={handleBack} className="md:hidden">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
              </Button>
              <Typography.Title variant="small-strong">
                {activeChatName}
              </Typography.Title>
            </div>
            <MessageList messages={messages[activeChatId] || []} />
            <MessageInput onSend={handleSend} />
          </>
        ) : (
          <div
            className="flex-1 flex items-center justify-center"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}
          >
            <Typography.Text variant="detail" color="secondary">
              Выберите чат
            </Typography.Text>
          </div>
        )}
      </div>
    </div>
  )
}
