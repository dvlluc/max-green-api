import { useEffect, useRef } from 'react'
import { Typography } from '@maxhub/max-ui'
import type { Message } from '../types'
import MessageBubble from './MessageBubble'

interface Props {
  messages: Message[]
}

export default function MessageList({ messages }: Props) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          flex: '1 1 0%',
        }}
      >
        <Typography.Text variant="detail" color="secondary">
          Нет сообщений
        </Typography.Text>
      </div>
    )
  }

  return (
    <div
      style={{
        flex: '1 1 0%',
        width: '100%',
        overflowY: 'auto',
        padding: 16,
      }}
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={endRef} />
    </div>
  )
}
