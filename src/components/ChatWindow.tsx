import { useState, useCallback, useMemo } from 'react'
import { Button, Typography } from '@maxhub/max-ui'
import type { Credentials, Chat, Message } from '../types'
import { createApi } from '../api/greenApi'
import { useNotifications } from '../hooks/useNotifications'
import PhoneInput from './PhoneInput'
import ChatList from './ChatList'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import HelpButton from './HelpButton'

interface Props {
  credentials: Credentials
  onLogout: () => void
}

export default function ChatWindow({ credentials, onLogout }: Props) {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [error, setError] = useState('')
  const [pollError, setPollError] = useState('')
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

  const appendChat = useCallback((chat: Chat) => {
    setChats((prev) =>
      prev.some((c) => c.chatId === chat.chatId) ? prev : [...prev, chat],
    )
  }, [])

  const handleNewChat = useCallback(
    (chat: Chat) => {
      appendChat(chat)
      setActiveChatId((prev) => prev ?? chat.chatId)
    },
    [appendChat],
  )

  useNotifications(credentials, chats, handleNewMessage, handleNewChat, setPollError)

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
        setError('Пользователь не найден в мессенджере')
        return
      }

      const chat: Chat = {
        chatId: result.chatId,
        phoneNumber: identifier,
      }

      appendChat(chat)
      setActiveChatId(chat.chatId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка проверки аккаунта')
    } finally {
      setAddingChat(false)
    }
  }, [api, appendChat])

  const handleSend = useCallback(
    async (text: string): Promise<boolean> => {
      if (!activeChatId) return false
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
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка отправки')
        return false
      }
    },
    [activeChatId, api],
  )

  const activeChatName = useMemo(
    () => chats.find((c) => c.chatId === activeChatId)?.phoneNumber || activeChatId,
    [chats, activeChatId],
  )

  const handleBack = () => setActiveChatId(null)

  const handleSelectChat = useCallback((chatId: string) => {
    setError('')
    setActiveChatId(chatId)
  }, [])

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
          className="px-4 pr-15 md:pr-4 py-3 bg-[var(--background-primary)] border-b border-[var(--divider-primary)]"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/icon.svg" alt="" className="w-7 h-7" aria-hidden="true" />
            <Typography.Title variant="small-strong" color="primary">
              G Chat
            </Typography.Title>
          </div>
          <Button variant="ghost" size="small" onClick={onLogout}>
            Выйти
          </Button>
        </div>

        <PhoneInput onAdd={handleAddChat} loading={addingChat} />

        {(error || pollError) && (
          <div className="px-4 py-2 bg-[var(--button-negative)]/10 text-[var(--text-negative)] text-xs">
            {error || pollError}
          </div>
        )}

        <ChatList
          chats={chats}
          activeChatId={activeChatId}
          onSelect={handleSelectChat}
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
            {(error || pollError) && (
              <div className="px-4 py-2 bg-[var(--button-negative)]/10 text-[var(--text-negative)] text-xs md:hidden">
                {error || pollError}
              </div>
            )}
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

      <HelpButton />
    </div>
  );
}
