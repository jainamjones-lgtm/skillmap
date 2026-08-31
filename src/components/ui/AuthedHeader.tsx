"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { NavSearch } from "@/components/ui/PublicNav";
import { AccountMenu } from "@/components/ui/AccountMenu";

const LINKS = [
  { label: "Explore", href: "/dashboard" },
  { label: "Skill Map", href: "/dashboard/skill-map" },
  { label: "Courses", href: "/dashboard/browse" },
  { label: "My Learning", href: "/dashboard/my-courses" },
];

const ADMIN_LINK = { label: "Admin", href: "/dashboard/admin" };

export function AuthedHeader({
  user,
  isAdmin = false,
}: {
  user: { name: string; email?: string; role: string; avatarColor: string };
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const links = isAdmin ? [...LINKS, ADMIN_LINK] : LINKS;

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas">
      <div className="content-max flex h-[72px] items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-8">
          <Logo href="/dashboard" />
          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
            {links.map((l) => {
              const active =
                l.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "t-label border-b-2 border-primary pb-1 text-primary"
                      : "t-label text-muted transition-colors duration-150 ease-out hover:text-primary"
                  }
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <NavSearch className="hidden min-w-[300px] lg:flex" />
          <button
            type="button"
            aria-label="Notifications"
            className="grid size-10 shrink-0 place-items-center rounded-full text-muted transition duration-150 ease-out hover:bg-surface-low hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
              <path d="M18 8a6 6 0 0 0-12 0c0 6-2 7-2 7h16s-2-1-2-7" />
              <path d="M13.7 20a2 2 0 0 1-3.4 0" />
            </svg>
          </button>
          <AccountMenu user={user} />
        </div>
      </div>
    </header>
  );
}
