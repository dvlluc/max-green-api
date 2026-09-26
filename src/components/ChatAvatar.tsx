import type { AvatarTextGradient } from '@maxhub/max-ui'
import { Avatar } from '@maxhub/max-ui'

const GRADIENTS: AvatarTextGradient[] = ['red', 'orange', 'green', 'blue', 'purple']

function pickGradient(seed: string): AvatarTextGradient {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length]
}

export function PersonIcon({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      className="block mx-auto"
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  )
}

export default function ChatAvatar({ chatId, size = 44 }: { chatId: string; size?: number }) {
  return (
    <Avatar.Container size={size} form="circle" className="shrink-0">
      <Avatar.Text gradient={pickGradient(chatId)}>
        <span className="flex size-full items-center justify-center leading-none">
          <PersonIcon size={Math.round(size * 0.5)} />
        </span>
      </Avatar.Text>
    </Avatar.Container>
  )
}
