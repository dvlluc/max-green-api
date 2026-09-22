import { useEffect, useMemo, useRef } from 'react'
import type { Credentials, Chat, Message, NotificationBody } from '../types'
import { createApi } from '../api/greenApi'

const TEXT_MESSAGE_TYPES = new Set(['textMessage', 'quotedMessage', 'extendedTextMessage'])

interface ParsedNotification {
  isIncoming: boolean
  chatId: string
  phoneNumber: string
  message: Message
}

function parseNotification(body: NotificationBody): ParsedNotification | null {
  const isIncoming = body.typeWebhook === 'incomingMessageReceived'
  const isOutgoing = body.typeWebhook === 'outgoingMessageReceived'
  if (!isIncoming && !isOutgoing) return null

  const { senderData, idMessage, messageData } = body
  if (!senderData?.chatId || !idMessage || !messageData) return null
  if (!TEXT_MESSAGE_TYPES.has(messageData.typeMessage)) return null

  const text =
    messageData.textMessageData?.textMessage ??
    messageData.extendedTextMessageData?.text
  if (typeof text !== 'string') return null

  return {
    isIncoming,
    chatId: senderData.chatId,
    phoneNumber: senderData.senderPhoneNumber
      ? String(senderData.senderPhoneNumber)
      : senderData.chatId,
    message: {
      id: idMessage,
      chatId: senderData.chatId,
      text,
      timestamp: body.timestamp,
      isOutgoing: !isIncoming,
    },
  }
}

export function useNotifications(
  credentials: Credentials | null,
  chats: Chat[],
  onMessage: (msg: Message) => void,
  onNewChat?: (chat: Chat) => void,
  onPollError?: (message: string) => void,
) {
  const api = useMemo(
    () => (credentials ? createApi(credentials) : null),
    [credentials],
  )
  const chatsRef = useRef(chats)
  const onMessageRef = useRef(onMessage)
  const onNewChatRef = useRef(onNewChat)
  const onPollErrorRef = useRef(onPollError)
  const backoffRef = useRef(1500)

  useEffect(() => {
    chatsRef.current = chats
    onMessageRef.current = onMessage
    onNewChatRef.current = onNewChat
    onPollErrorRef.current = onPollError
  })

  useEffect(() => {
    if (!api) return
    const client = api

    let timerId: ReturnType<typeof setTimeout> | null = null
    let stopped = false

    function schedule() {
      if (!stopped) timerId = setTimeout(poll, backoffRef.current)
    }

    function failPoll(message: string) {
      backoffRef.current = Math.min(backoffRef.current * 2, 10000)
      onPollErrorRef.current?.(message)
      schedule()
    }

    function handleNotification(body: NotificationBody) {
      if (stopped) return

      const parsed = parseNotification(body)
      if (!parsed) return

      const { isIncoming, chatId, phoneNumber, message } = parsed
      const isKnownChat = chatsRef.current.some((c) => c.chatId === chatId)

      if (!isKnownChat && isIncoming) {
        onNewChatRef.current?.({ chatId, phoneNumber })
      }

      if (isKnownChat || (isIncoming && onNewChatRef.current)) {
        onMessageRef.current(message)
      }
    }

    async function poll() {
      if (stopped) return

      let notification = null
      try {
        notification = await client.receiveNotification()
      } catch (err) {
        console.error('Ошибка receiveNotification:', err)
        failPoll(
          err instanceof Error ? err.message : 'Ошибка получения уведомлений',
        )
        return
      }

      if (notification) {
        try {
          handleNotification(notification.body)
        } catch (err) {
          console.error('Ошибка обработки уведомления:', err)
        }

        try {
          await client.deleteNotification(notification.receiptId)
        } catch (err) {
          console.error('Ошибка deleteNotification:', err)
          failPoll(
            err instanceof Error
              ? `Не удалось подтвердить уведомление: ${err.message}`
              : 'Не удалось подтвердить уведомление',
          )
          return
        }
      }

      backoffRef.current = 1500
      onPollErrorRef.current?.('')
      schedule()
    }

    schedule()

    return () => {
      stopped = true
      if (timerId !== null) clearTimeout(timerId)
    }
  }, [api])
}
