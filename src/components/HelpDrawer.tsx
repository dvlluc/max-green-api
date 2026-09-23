import { useEffect } from "react";
import { Button, Typography, Flex } from "@maxhub/max-ui";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface SetupStep {
  title: string;
  text: string;
  victory?: boolean;
}

const setupSteps: SetupStep[] = [
  {
    title: "Регистрация",
    text: "Зарегистрируйтесь на console.green-api.com",
  },
  {
    title: "Создайте инстанс",
    text: "Создайте инстанс с типом MAX",
  },
  {
    title: "Сканируйте QR-код",
    text: "В приложении MAX: Профиль → Устройства → Войти по QR-коду",
  },
  {
    title: "Включите вебхуки",
    text: "В настройках инстанса включите Receive webhooks on incoming messages and files и Receive webhooks on messages sent from phone — Yes",
  },
  {
    title: "Скопируйте credentials",
    text: "Скопируйте idInstance и apiTokenInstance и вставьте их в форму входа",
  },
  {
    title: "Начните общаться",
    text: "Введите номер телефона получателя (например 79161234567) и начните общаться",
  },
  {
    title: "Победа!",
    text: "Всё готово — входящие сообщения приходят автоматически, можно общаться",
    victory: true,
  },
];

export default function HelpDrawer({ open, onClose }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Инструкция: как пользоваться"
        aria-hidden={!open}
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[26rem] max-w-full bg-[var(--background-primary)] border-l border-[var(--divider-primary)] shadow-[-8px_0_40px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ borderRadius: "16px 0 0 16px" }}
      >
        <Flex
          align="center"
          justify="space-between"
          className="shrink-0 px-6 py-5 border-b border-[var(--divider-primary)]"
        >
          <Flex align="center" gap={12}>
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--text-themed)]/12 text-[var(--text-themed)]">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </span>
            <div>
              <Typography.Title variant="small-strong">
                Как пользоваться
              </Typography.Title>
              <Typography.Text variant="detail" color="secondary">
                Пошаговая инструкция
              </Typography.Text>
            </div>
          </Flex>
          <Button
            variant="ghost"
            size="small"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </Button>
        </Flex>

        <div className="px-6 py-6 overflow-y-auto flex-1">
          <Typography.Label
            variant="small"
            className="block mb-5 uppercase tracking-wider text-[var(--text-tertiary)]"
          >
            Настройка в console.green-api.com
          </Typography.Label>

          <ol className="relative">
            {setupSteps.map((step, i) => (
              <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
                {i < setupSteps.length - 1 && (
                  <span
                    className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-px bg-[var(--divider-primary)]"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`relative z-10 flex items-center justify-center w-8 h-8 shrink-0 rounded-full border text-xs font-semibold ${
                    step.victory
                      ? "bg-[var(--icon-positive)]/15 border-[var(--icon-positive)]/40 text-[var(--icon-positive)]"
                      : "bg-[var(--background-secondary)] border-[var(--divider-primary)] text-[var(--text-themed)]"
                  }`}
                >
                  {step.victory ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                      <path d="M4 22h16" />
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <div className="pt-1 min-w-0">
                  <Typography.Text
                    variant="body-strong"
                    className={`block ${
                      step.victory
                        ? "text-[var(--icon-positive)]"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {step.title}
                  </Typography.Text>
                  <Typography.Text
                    variant="detail"
                    color="secondary"
                    className="block mt-0.5 leading-relaxed"
                  >
                    {step.text}
                  </Typography.Text>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </>
  );
}
