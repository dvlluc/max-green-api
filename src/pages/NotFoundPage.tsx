import { useNavigate } from 'react-router'
import { Button, Typography, Flex } from '@maxhub/max-ui'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Flex
      align="center"
      justify="center"
      className="min-h-screen bg-[var(--background-secondary)] px-4"
    >
      <div className="bg-[var(--background-primary)] rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
        <Typography.Title variant="large-strong" className="block mb-2">
          404
        </Typography.Title>
        <Typography.Text variant="body" color="secondary" className="block mb-6">
          Страница не найдена
        </Typography.Text>
        <Button variant="primary" stretched onClick={() => navigate('/chats')}>
          К чатам
        </Button>
      </div>
    </Flex>
  )
}
