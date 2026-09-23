import axios from 'axios'
import type {
  Credentials,
  StateInstanceResponse,
  CheckAccountResponse,
  SendMessageResponse,
  ReceiveNotificationResponse,
  DeleteNotificationResponse,
} from '../types'

const API_URL = import.meta.env.VITE_API_URL as string

export type ApiErrorKind = 'api' | 'timeout' | 'network' | 'cancel'

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status?: number
  readonly code?: string

  constructor(
    message: string,
    kind: ApiErrorKind = 'api',
    status?: number,
    code?: string,
  ) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
    this.code = code
  }
}

const HTTP_MESSAGES: Record<number, string> = {
  400: 'Некорректный запрос к API',
  401: 'Неверный токен доступа к инстансу',
  403: 'Доступ к API запрещён',
  404: 'Инстанс не найден — проверьте ID инстанса',
  408: 'Не удалось выполнить запрос: превышено время ожидания',
  429: 'Слишком много запросов к API — попробуйте позже',
  466: 'Достигнут лимит запросов вашего тарифа',
}

const TRANSIENT_STATUSES = new Set([408, 429, 500, 502, 503, 504])

export function isTransientError(err: unknown): boolean {
  if (err instanceof ApiError) {
    return (
      err.kind !== 'api' ||
      (err.status !== undefined && TRANSIENT_STATUSES.has(err.status))
    )
  }
  return axios.isAxiosError(err) && !err.response
}

function extractServerMessage(body: unknown): string | undefined {
  if (typeof body === 'string') {
    const text = body.trim()
    if (!text || text.startsWith('<') || text.length > 300) return undefined
    return text
  }
  if (body !== null && typeof body === 'object') {
    const message = (body as Record<string, unknown>).message
    if (typeof message === 'string' && message.trim()) return message.trim()
  }
  return undefined
}

function friendlyMessage(
  status: number | undefined,
  body: unknown,
  fallback: string,
): string {
  const serverMessage = extractServerMessage(body)

  if (serverMessage && /custom webhook url/i.test(serverMessage)) {
    return 'У инстанса задан Webhook URL — очистите его в console.green-api.com, иначе polling не будет получать уведомления'
  }
  if (serverMessage && /not authorized/i.test(serverMessage)) {
    return 'Инстанс не авторизован — войдите в мессенджер по QR-коду'
  }
  if (serverMessage) return serverMessage

  if (status === undefined) return fallback
  const known = HTTP_MESSAGES[status]
  if (known) return known
  if (status >= 500) return `Сервис GREEN-API временно недоступен (ошибка ${status})`
  return `Ошибка API (${status})`
}

function extractCode(body: unknown): string | undefined {
  if (body !== null && typeof body === 'object') {
    const code = (body as Record<string, unknown>).code
    if (typeof code === 'string' && code) return code
  }
  return undefined
}

function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err

  if (axios.isCancel(err) || (axios.isAxiosError(err) && err.code === 'ERR_CANCELED')) {
    return new ApiError('Запрос отменён', 'cancel')
  }

  if (axios.isAxiosError(err)) {
    if (!err.response) {
      if (err.code === 'ECONNABORTED' || /timeout/i.test(err.message)) {
        return new ApiError('Превышено время ожидания ответа от сервера', 'timeout')
      }
      return new ApiError('Нет соединения с сервером', 'network')
    }
    const { status, data } = err.response
    return new ApiError(
      friendlyMessage(status, data, err.message),
      'api',
      status,
      extractCode(data),
    )
  }

  return new ApiError(err instanceof Error ? err.message : 'Неизвестная ошибка')
}

function parseReceiveResult(data: unknown): ReceiveNotificationResponse | null {
  if (data == null || data === '') return null

  if (typeof data === 'object') {
    const record = data as Record<string, unknown>

    if (record.status === 'error') {
      throw new ApiError(
        friendlyMessage(undefined, record, 'Не удалось получить уведомление'),
        'api',
        undefined,
        extractCode(record),
      )
    }

    if (
      typeof record.receiptId === 'number' ||
      (typeof record.receiptId === 'string' && /^\d+$/.test(record.receiptId))
    ) {
      if (record.body !== null && typeof record.body === 'object') {
        return {
          receiptId: Number(record.receiptId),
          body: record.body as ReceiveNotificationResponse['body'],
        }
      }
    }
  }

  return null
}

export function createApi(creds: Credentials) {
  const instance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
  })

  instance.interceptors.response.use(
    (res) => res,
    (err) => Promise.reject(toApiError(err)),
  )

  const base = `/waInstance${creds.idInstance}`
  const token = creds.apiTokenInstance

  return {
    getStateInstance: () =>
      instance
        .get<StateInstanceResponse>(`${base}/getStateInstance/${token}`)
        .then((r) => r.data),

    checkAccount: (phoneNumber: string) =>
      instance
        .post<CheckAccountResponse>(`${base}/checkAccount/${token}`, {
          phoneNumber: parseInt(phoneNumber, 10),
        })
        .then((r) => r.data),

    sendMessage: (chatId: string, message: string) =>
      instance
        .post<SendMessageResponse>(`${base}/sendMessage/${token}`, {
          chatId,
          message,
        })
        .then((r) => r.data),

    receiveNotification: (signal?: AbortSignal) =>
      instance
        .get<unknown>(`${base}/receiveNotification/${token}`, {
          params: { receiveTimeout: 5 },
          signal,
        })
        .then((r) => parseReceiveResult(r.data)),

    deleteNotification: (receiptId: number, signal?: AbortSignal) =>
      instance
        .delete<DeleteNotificationResponse>(
          `${base}/deleteNotification/${token}/${receiptId}`,
          { signal },
        )
        .then((r) => r.data),
  }
}
