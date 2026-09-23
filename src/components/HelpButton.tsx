import { useState } from "react";
import HelpDrawer from "./HelpDrawer";

export default function HelpButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Как пользоваться"
        title="Как пользоваться"
        className="group fixed top-3 right-4 z-30 flex items-center gap-2.5 rounded-full border border-[var(--divider-primary)] bg-[var(--background-primary)]/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.12)] p-2 md:pl-3 md:pr-4 md:py-2 text-sm font-medium text-[var(--text-primary)] transition-all duration-200 hover:shadow-[0_6px_24px_rgba(0,0,0,0.18)] hover:border-[var(--text-themed)]/40 active:scale-95 cursor-pointer"
      >
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--text-themed)]/12 text-[var(--text-themed)] transition-transform duration-200 group-hover:scale-110">
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
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </span>
        <span className="hidden md:inline">Как пользоваться?</span>
      </button>

      <HelpDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
