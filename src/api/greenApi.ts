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

export function createApi(creds: Credentials) {
  const instance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
  })

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      const status = err.response?.status
      const msg = err.response?.data?.message || err.message
      const fullMsg = status ? `[${status}] ${msg}` : msg
      return Promise.reject(new Error(fullMsg))
    },
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

    receiveNotification: () =>
      instance
        .get<ReceiveNotificationResponse | null>(
          `${base}/receiveNotification/${token}`,
          { params: { receiveTimeout: 5 } },
        )
        .then((r) => r.data ?? null),

    deleteNotification: (receiptId: number) =>
      instance
        .delete<DeleteNotificationResponse>(
          `${base}/deleteNotification/${token}/${receiptId}`,
        )
        .then((r) => r.data),
  }
}
