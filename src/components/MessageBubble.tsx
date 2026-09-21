import { memo } from 'react'
import { Typography, Flex } from '@maxhub/max-ui'
import type { Message } from '../types'

interface Props {
  message: Message
}

export default memo(function MessageBubble({ message }: Props) {
  const time = new Date(message.timestamp * 1000).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Flex
      direction="row"
      justify={message.isOutgoing ? 'end' : 'start'}
      className="mb-2"
    >
      <div
        className={`max-w-[75%] px-3 py-2 rounded-2xl ${
          message.isOutgoing
            ? 'bg-[var(--button-primary)] rounded-br-md'
            : 'bg-[var(--background-primary)] rounded-bl-md shadow-sm'
        }`}
      >
        <Typography.Text
          variant="detail"
          className={`break-words ${message.isOutgoing ? 'text-[var(--text-primary-inverse-static)]' : 'text-[var(--text-primary)]'}`}
        >
          {message.text}
        </Typography.Text>
        <Typography.Text
          variant="note"
          className={`block text-right mt-1 ${message.isOutgoing ? 'text-[var(--text-primary-inverse-static)]/70' : 'text-[var(--text-tertiary)]'}`}
        >
          {time}
        </Typography.Text>
      </div>
    </Flex>
  )
})
