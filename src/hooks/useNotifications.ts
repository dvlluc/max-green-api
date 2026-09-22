import { useEffect, useRef } from 'react'
import type { Credentials, Chat, Message } from '../types'
import { createApi } from '../api/greenApi'

export function useNotifications(
  credentials: Credentials | null,
  chats: Chat[],
  onMessage: (msg: Message) => void,
  onNewChat?: (chat: Chat) => void,
) {
  const apiRef = useRef<ReturnType<typeof createApi> | null>(null)
  const chatsRef = useRef(chats)
  const onMessageRef = useRef(onMessage)
  const onNewChatRef = useRef(onNewChat)
  const backoffRef = useRef(1500)

  useEffect(() => {
    chatsRef.current = chats
  }, [chats])

  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    onNewChatRef.current = onNewChat
  }, [onNewChat])

  useEffect(() => {
    if (credentials) {
      apiRef.current = createApi(credentials)
    }
  }, [credentials])

  useEffect(() => {
    if (!credentials || !apiRef.current) return

    const api = apiRef.current
    let timerId: ReturnType<typeof setTimeout> | null = null
    let stopped = false

    const poll = async () => {
      if (stopped) return

      try {
        const notification = await api.receiveNotification()
        if (!notification) {
          backoffRef.current = 1500
          timerId = setTimeout(poll, backoffRef.current)
          return
        }

        const { receiptId, body } = notification

        const { messageData } = body
        const text =
          messageData.textMessageData?.textMessage ??
          messageData.extendedTextMessageData?.text
        const isTextLike =
          (messageData.typeMessage === 'textMessage' ||
            messageData.typeMessage === 'quotedMessage' ||
            messageData.typeMessage === 'extendedTextMessage') &&
          typeof text === 'string'

        const isIncoming = body.typeWebhook === 'incomingMessageReceived'
        const isOutgoing = body.typeWebhook === 'outgoingMessageReceived'

        if ((isIncoming || isOutgoing) && isTextLike) {
          const chatId = body.senderData.chatId
          const isKnownChat = chatsRef.current.some((c) => c.chatId === chatId)

          if (!isKnownChat && isIncoming && onNewChatRef.current) {
            const phoneNumber = body.senderData.senderPhoneNumber?.toString() || chatId
            onNewChatRef.current({ chatId, phoneNumber })
          }

          if (isKnownChat || (isIncoming && onNewChatRef.current)) {
            onMessageRef.current({
              id: body.idMessage,
              chatId,
              text: text!,
              timestamp: body.timestamp,
              isOutgoing,
            })
          }
        }

        await api.deleteNotification(receiptId)
        backoffRef.current = 1500
      } catch {
        backoffRef.current = Math.min(backoffRef.current * 2, 10000)
      }

      if (!stopped) {
        timerId = setTimeout(poll, backoffRef.current)
      }
    }

    timerId = setTimeout(poll, backoffRef.current)

    return () => {
      stopped = true
      if (timerId !== null) clearTimeout(timerId)
    }
  }, [credentials])
}
