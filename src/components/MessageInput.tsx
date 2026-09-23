import { useState } from 'react'
import { IconButton, Input } from '@maxhub/max-ui'

interface Props {
  onSend: (text: string) => Promise<boolean>
}

export default function MessageInput({ onSend }: Props) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || sending) return

    setSending(true)
    try {
      const ok = await onSend(trimmed)
      if (ok) setText((prev) => (prev === trimmed ? '' : prev))
    } finally {
      setSending(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 border-t border-[var(--divider-primary)] bg-[var(--background-primary)]"
      style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}
    >
      <div style={{ flex: '1 1 0%', minWidth: 0 }}>
        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введите сообщение"
          maxLength={4000}
        />
      </div>
      <IconButton
        type="submit"
        variant="primary"
        size="medium"
        disabled={!text.trim() || sending}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </IconButton>
    </form>
  )
}
