import { Link } from 'react-router'
import { Button, Flex, Typography } from '@maxhub/max-ui'

export default function NotFoundPage() {
  return (
    <Flex
      align="center"
      justify="center"
      className="min-h-screen bg-[var(--background-secondary)] px-4"
    >
      <div className="text-center">
        <Typography.Title variant="large-strong" className="block mb-2">
          404
        </Typography.Title>
        <Typography.Text variant="body" color="secondary" className="block mb-6">
          Страница не найдена
        </Typography.Text>
        <Link to="/chats">
          <Button variant="primary" size="medium">
            К чатам
          </Button>
        </Link>
      </div>
    </Flex>
  )
}
