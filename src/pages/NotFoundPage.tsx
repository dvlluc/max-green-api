import { Link } from 'react-router'
import { Button, Flex, Typography } from '@maxhub/max-ui'

export default function NotFoundPage() {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap={16}
      className="min-h-screen bg-[var(--background-secondary)] px-4 text-center"
    >
      <Typography.Title variant="large-strong" className="block">
        404
      </Typography.Title>
      <Typography.Text variant="body" color="secondary" className="block">
        Страница не найдена
      </Typography.Text>
      <Link to="/chats" className="inline-flex">
        <Button variant="primary" size="medium">
          К чатам
        </Button>
      </Link>
    </Flex>
  )
}
