# MAX Chat

Чат-клиент для мессенджера MAX через [GREEN-API](https://green-api.com/max).

## Запуск

```bash
npm install
npm run dev
```

Откроется на `http://localhost:5173`.

## Технологии

- React 19 + TypeScript
- Vite 8 + Tailwind CSS 4
- Axios
- Node.js >= 18

## .env

`VITE_API_URL` — это `apiUrl` из вашего инстанса в [console.green-api.com](https://console.green-api.com). Формат: `https://{clusterNumber}.api.green-api.com`. Точный URL указан в настройках инстанса.
```
VITE_API_URL=https://3100.api.green-api.com
```

## Настройка в console.green-api.com

1. Зарегистрируйтесь на [console.green-api.com](https://console.green-api.com)
2. Создайте инстанс с типом **MAX**
3. Отсканируйте QR-код в приложении MAX (Профиль → Устройства → Войти по QR-коду)
4. В настройках инстанса включите отправку вебхуков:
   - Receive webhooks on incoming messages and files — **Yes**
   - Receive webhooks on messages sent from phone — **Yes**
5. Скопируйте `idInstance` и `apiTokenInstance` — вставьте их в форму входа в приложении
6. Введите номер телефона получателя (например `79161234567`) и начните общаться

Входящие уведомления работают через HTTP API polling (приложение само опрашивает сервер). **Webhook URL в настройках инстанса должен быть пустым**, иначе polling не будет получать уведомления. Без включённых вебхуков (пункт 4) приложение не будет получать входящие сообщения и сообщения, отправленные с телефона.
