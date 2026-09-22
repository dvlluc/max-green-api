export interface Credentials {
  idInstance: string
  apiTokenInstance: string
}

export interface Chat {
  chatId: string
  phoneNumber: string
}

export interface Message {
  id: string
  chatId: string
  text: string
  timestamp: number
  isOutgoing: boolean
}

export interface SendMessageResponse {
  idMessage: string
}

export interface ReceiveNotificationResponse {
  receiptId: number
  body: NotificationBody
}

export interface NotificationBody {
  typeWebhook: string
  timestamp: number
  idMessage?: string
  senderData?: {
    chatId: string
    chatName: string
    chatType: string
    sender: string
    senderName: string
    senderPhoneNumber?: number
  }
  messageData?: {
    typeMessage: string
    textMessageData?: { textMessage: string }
    extendedTextMessageData?: { text: string; stanzaId?: string; participant?: string }
  }
}

export interface DeleteNotificationResponse {
  result: boolean
  reason: string
}

export interface CheckAccountResponse {
  exist?: boolean
  chatId?: string
  status?: boolean
  reason?: string
}

export interface StateInstanceResponse {
  stateInstance: string
}
