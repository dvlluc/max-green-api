import type { Credentials } from '../types'

const STORAGE_KEY = 'green-chat-creds'

function isValidCredentials(value: unknown): value is Credentials {
  if (value === null || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return (
    typeof record.idInstance === 'string' &&
    record.idInstance.length > 0 &&
    typeof record.apiTokenInstance === 'string' &&
    record.apiTokenInstance.length > 0
  )
}

export function loadCredentials(): Credentials | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isValidCredentials(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveCredentials(credentials: Credentials): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials))
}

export function clearCredentials(): void {
  localStorage.removeItem(STORAGE_KEY)
}
