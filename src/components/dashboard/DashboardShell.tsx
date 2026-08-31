"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthedHeader } from "@/components/ui/AuthedHeader";

const icon = (children: React.ReactNode) => (
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
    {children}
  </svg>
);

const MOBILE_NAV: { href: string; label: string; icon: React.ReactNode }[] = [
  {
    href: "/dashboard",
    label: "Explore",
    icon: icon(
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>,
    ),
  },
  {
    href: "/dashboard/skill-map",
    label: "Skill Map",
    icon: icon(
      <>
        <path d="M3 17l5-8 4 5 4-7 5 6" />
        <path d="M20 20H4" />
      </>,
    ),
  },
  {
    href: "/dashboard/browse",
    label: "Courses",
    icon: icon(
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>,
    ),
  },
  {
    href: "/dashboard/my-courses",
    label: "My Learning",
    icon: icon(
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </>,
    ),
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: icon(
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
      </>,
    ),
  },
];

export function DashboardShell({
  user,
  children,
}: {
  user: { name: string; email: string; role: string; avatarColor: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <AuthedHeader user={user} isAdmin={user.role === "ADMIN"} />

      <main className="content-max flex-1 py-10 pb-24 md:py-14 md:pb-14">
        {children}
      </main>

      <nav
        className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-around border-t border-hairline bg-canvas px-4 py-2 md:hidden"
        aria-label="Sections"
      >
        {MOBILE_NAV.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-1 rounded-md px-3 py-1 transition duration-150 ease-out ${
                active ? "text-primary" : "text-muted hover:bg-surface-low"
              }`}
            >
              {item.icon}
              <span className="text-[11px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
