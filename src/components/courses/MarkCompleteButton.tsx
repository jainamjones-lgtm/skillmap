"use client";

import { useFormStatus } from "react-dom";

export function MarkCompleteButton({ done }: { done: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${done ? "btn-secondary" : "btn-primary"} btn-sm disabled:opacity-60`}
    >
      {done && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4 text-success"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )}
      {done ? "Completed" : pending ? "Marking…" : "Mark complete"}
    </button>
  );
}
