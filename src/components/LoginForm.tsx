import { useState } from "react";
import { Button, Input, Typography, Container, Flex } from "@maxhub/max-ui";
import type { Credentials } from "../types";
import { createApi } from "../api/greenApi";
import HelpButton from "./HelpButton";

interface Props {
  onConnect: (creds: Credentials) => void;
}

export default function LoginForm({ onConnect }: Props) {
  const [idInstance, setIdInstance] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const api = createApi({ idInstance, apiTokenInstance: apiToken });
      const state = await api.getStateInstance();

      if (state.stateInstance !== "authorized") {
        setError("Инстанс не авторизован");
        return;
      }

      onConnect({ idInstance, apiTokenInstance: apiToken });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка подключения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      className="min-h-screen bg-[var(--background-secondary)] px-4"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--background-primary)] rounded-2xl shadow-lg p-8 w-full max-w-sm"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src="/icon.svg" alt="" className="w-9 h-9" aria-hidden="true" />
          <Typography.Title variant="large-strong" className="block">
            G Chat
          </Typography.Title>
        </div>

        <Container className="mb-4">
          <Typography.Label
            variant="small"
            className="block mb-2 text-[var(--text-secondary)]"
          >
            ID инстанса
          </Typography.Label>
          <Input
            type="text"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            required
          />
        </Container>

        <Container className="mb-4">
          <Typography.Label
            variant="small"
            className="block mb-2 text-[var(--text-secondary)]"
          >
            API Token
          </Typography.Label>
          <Input
            type="password"
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
            required
          />
        </Container>

        {error && (
          <div className="block mb-4 text-[var(--text-negative)] text-xs">
            {error}
          </div>
        )}

        <Container>
          <Button
            type="submit"
            variant="primary"
            stretched
            disabled={loading}
            loading={loading}
          >
            {loading ? "Подключение..." : "Подключить"}
          </Button>
        </Container>
      </form>

      <HelpButton />
    </Flex>
  );
}
