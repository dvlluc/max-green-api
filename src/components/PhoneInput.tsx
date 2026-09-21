import { useState } from 'react'
import { Button, Input } from '@maxhub/max-ui'

interface Props {
  onAdd: (identifier: string) => void
  loading?: boolean
}

export default function PhoneInput({ onAdd, loading = false }: Props) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || loading) return
    onAdd(trimmed)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 border-b border-[var(--divider-primary)]"
      style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}
    >
      <div style={{ flex: '1 1 0%', minWidth: 0 }}>
        <Input
          type="tel"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Номер телефона"
          disabled={loading}
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        size="medium"
        disabled={loading || !input.trim()}
        loading={loading}
      >
        +
      </Button>
    </form>
  )
}
