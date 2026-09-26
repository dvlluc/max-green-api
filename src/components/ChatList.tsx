import { useMemo } from 'react'
import { Avatar, CellSimple, Counter, Typography } from '@maxhub/max-ui'
import type { Chat, Message } from '../types'
import { formatPhone } from '../utils/phone'
import ChatAvatar, { PersonIcon } from './ChatAvatar'

interface Props {
  chats: Chat[]
  lastMessages: Record<string, Message>
  unread: Record<string, number>
  activeChatId: string | null
  onSelect: (chatId: string) => void
}

function formatListTime(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const ms = date.getTime()

  if (ms >= startOfToday) {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }
  if (ms >= startOfToday - 86_400_000) {
    return 'Вчера'
  }
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
  }
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
      <Avatar.Container size={64} form="circle" className="shrink-0">
        <Avatar.Text gradient="blue">
          <span className="flex size-full items-center justify-center leading-none">
            <PersonIcon size={30} />
          </span>
        </Avatar.Text>
      </Avatar.Container>
      <Typography.Text variant="body" color="secondary">
        Добавьте номер телефона, чтобы начать чат
      </Typography.Text>
    </div>
  )
}

export default function ChatList({
  chats,
  lastMessages,
  unread,
  activeChatId,
  onSelect,
}: Props) {
  const sortedChats = useMemo(() => {
    return [...chats].sort(
      (a, b) =>
        (lastMessages[b.chatId]?.timestamp ?? 0) - (lastMessages[a.chatId]?.timestamp ?? 0),
    )
  }, [chats, lastMessages])

  if (chats.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="flex-1 overflow-y-auto p-2">
      {sortedChats.map((chat) => {
        const last = lastMessages[chat.chatId]
        const unreadCount = unread[chat.chatId] ?? 0
        const isActive = activeChatId === chat.chatId

        return (
          <CellSimple
            key={chat.chatId}
            onClick={() => onSelect(chat.chatId)}
            before={<ChatAvatar chatId={chat.chatId} />}
            title={formatPhone(chat.phoneNumber)}
            subtitle={
              last ? (
                <span
                  className={
                    unreadCount > 0 && !isActive
                      ? 'text-[var(--text-primary)] font-medium'
                      : ''
                  }
                >
                  {last.isOutgoing ? 'Вы: ' : ''}
                  {last.text}
                </span>
              ) : (
                'Нет сообщений'
              )
            }
            subtitleMode={last ? 'secondary' : 'tertiary'}
            after={
              last || unreadCount > 0 ? (
                <div className="flex flex-col items-end gap-1">
                  {last && (
                    <Typography.Text
                      variant="detail"
                      color={unreadCount > 0 && !isActive ? 'primary' : 'secondary'}
                      className="whitespace-nowrap"
                    >
                      {formatListTime(last.timestamp)}
                    </Typography.Text>
                  )}
                  {unreadCount > 0 && (
                    <Counter value={unreadCount} variant="primary" />
                  )}
                </div>
              ) : undefined
            }
            innerClassNames={{
              before: 'shrink-0',
              title: 'truncate',
              subtitle: 'truncate',
            }}
            className={`my-0.5 cursor-pointer rounded-xl transition-colors ${
              isActive
                ? 'bg-[var(--background-secondary)]'
                : 'hover:bg-[var(--background-secondary)]/50'
            }`}
          />
        )
      })}
    </div>
  )
}
