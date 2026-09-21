import { CellSimple, Typography, Container } from '@maxhub/max-ui'
import type { Chat } from '../types'

interface Props {
  chats: Chat[]
  activeChatId: string | null
  onSelect: (chatId: string) => void
}

export default function ChatList({ chats, activeChatId, onSelect }: Props) {
  if (chats.length === 0) {
    return (
      <Container className="p-4 text-center">
        <Typography.Text variant="detail" color="secondary">
          Добавьте номер телефона для начала чата
        </Typography.Text>
      </Container>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => (
        <CellSimple
          key={chat.chatId}
          title={chat.phoneNumber}
          onClick={() => onSelect(chat.chatId)}
          separator
          className={`cursor-pointer transition-colors ${
            activeChatId === chat.chatId ? 'bg-[var(--background-secondary)]' : 'hover:bg-[var(--background-secondary)]/50'
          }`}
        />
      ))}
    </div>
  )
}
