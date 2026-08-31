"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";

/**
 * Pill catalog search used by both site headers. Posts to the browse page,
 * which reads the `q` search param.
 */
export function NavSearch({ className = "" }: { className?: string }) {
  return (
    <form
      action="/dashboard/browse"
      method="get"
      role="search"
      className={`flex h-12 items-center gap-2 rounded-full border border-hairline bg-canvas px-4 transition duration-150 ease-out focus-within:border-primary ${className}`}
    >
      <input
        type="search"
        name="q"
        placeholder="Search skills or courses..."
        aria-label="Search skills or courses"
        className="w-full min-w-0 border-none bg-transparent p-0 text-sm text-ink outline-none placeholder:text-muted"
      />
      <button
        type="submit"
        aria-label="Search"
        className="grid size-6 shrink-0 place-items-center rounded-full text-muted transition duration-150 ease-out hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>
    </form>
  );
}

export function PublicNav({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas">
      <div className="content-max flex h-[72px] items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-6">
          <Logo href="/" />
          <NavSearch className="hidden min-w-[260px] lg:flex" />
        </div>

        <div className="flex items-center gap-6">
          <nav
            className="hidden items-center gap-6 lg:flex"
            aria-label="Primary"
          >
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                className={
                  i === 0
                    ? "t-label border-b-2 border-primary pb-1 text-primary"
                    : "t-label text-muted transition-colors duration-150 ease-out hover:text-primary"
                }
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/login"
              className="btn-secondary btn-sm hidden whitespace-nowrap sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="btn-primary btn-sm whitespace-nowrap"
            >
              Get started
            </Link>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full border border-hairline text-ink transition duration-150 ease-out hover:bg-surface-low focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">Toggle menu</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                className="size-5"
                aria-hidden="true"
              >
                {open ? (
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-hairline bg-canvas px-6 py-4 lg:hidden"
          aria-label="Mobile"
        >
          <NavSearch className="mb-3 w-full" />
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-sm font-semibold text-body transition duration-150 ease-out hover:bg-surface-low hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2.5 text-sm font-semibold text-body transition duration-150 ease-out hover:bg-surface-low hover:text-primary"
              >
                Log in
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
