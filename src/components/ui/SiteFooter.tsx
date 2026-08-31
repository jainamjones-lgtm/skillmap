import Link from "next/link";
import { Logo } from "@/components/Logo";

const GROUPS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Learn",
    links: [
      { label: "Skill map", href: "/dashboard/skill-map" },
      { label: "Browse courses", href: "/dashboard/browse" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    heading: "Your learning",
    links: [
      { label: "My courses", href: "/dashboard/my-courses" },
      { label: "Profile", href: "/dashboard/profile" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Create account", href: "/signup" },
      { label: "Log in", href: "/login" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="content-max grid gap-10 py-section md:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Logo href="/" />
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            A demand-driven learning platform. Read the market, pick a skill,
            and learn it end to end.
          </p>
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} SkillMap Learning Marketplace
          </p>
        </div>

        {GROUPS.map((group) => (
          <nav key={group.heading} aria-label={group.heading}>
            <h3 className="t-micro text-muted">{group.heading}</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {group.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted transition duration-150 ease-out hover:text-primary hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  );
}
