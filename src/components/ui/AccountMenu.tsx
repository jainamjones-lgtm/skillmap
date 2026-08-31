"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { logout } from "@/lib/auth";
import { initials } from "@/lib/format";

export function AccountMenu({
  user,
  align = "right",
}: {
  user: { name: string; email?: string; role: string; avatarColor: string };
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Account menu for ${user.name}`}
        className="grid size-11 place-items-center rounded-full text-sm font-bold text-white transition duration-150 ease-out hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        style={{ background: user.avatarColor }}
      >
        {initials(user.name)}
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Account"
          className={`absolute top-full z-40 mt-2 w-60 rounded-lg border border-hairline bg-canvas p-1.5 shadow-lift ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
            {user.email && (
              <p className="truncate text-xs text-muted">{user.email}</p>
            )}
          </div>
          <div className="mx-1 border-t border-hairline" />
          <Link
            href="/dashboard/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-ink transition duration-150 ease-out hover:bg-surface-low"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 text-muted"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
            </svg>
            Profile
          </Link>
          <form action={logout}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm font-medium text-error transition duration-150 ease-out hover:bg-error/10"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
                aria-hidden="true"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}