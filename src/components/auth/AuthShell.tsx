import { Logo } from "@/components/Logo";

const PULSES: {
  skill: string;
  score: number;
  tone: "high" | "medium";
  position: string;
}[] = [
  {
    skill: "Marketing Analytics",
    score: 92,
    tone: "high",
    position: "-rotate-2 self-start",
  },
  {
    skill: "Content Strategy",
    score: 89,
    tone: "medium",
    position: "rotate-1 self-end",
  },
  {
    skill: "Paid Media",
    score: 84,
    tone: "high",
    position: "-rotate-1 self-start ml-10",
  },
];

function TrendingUpIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`size-4 ${className}`}
    >
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-canvas lg:grid-cols-2">
      {/* Form column */}
      <div className="flex flex-col justify-center py-16">
        <div className="mx-auto w-full max-w-[420px] px-6">
          <Logo href="/" />

          <p className="t-micro mt-10 text-primary">{eyebrow}</p>
          <h1 className="t-page mt-2">{title}</h1>
          <p className="mt-2 text-muted">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>

      {/* Brand column */}
      <div className="hidden border-l border-hairline bg-surface lg:flex lg:flex-col lg:justify-center lg:px-16">
        <div className="max-w-md">
          <p className="t-micro text-primary">Market-driven learning</p>
          <p className="t-section mt-3 text-ink">
            SkillMap reads live demand for marketing skills, then turns it into
            courses worth your evenings.
          </p>
        </div>

        <div className="mt-12 flex max-w-md flex-col gap-4">
          {PULSES.map((p) => (
            <div
              key={p.skill}
              className={`flex items-center gap-3 rounded-full border border-hairline bg-canvas px-4 py-2 shadow-lift ${p.position}`}
            >
              <span
                className={`size-2 shrink-0 rounded-full ${
                  p.tone === "high" ? "bg-demand-high" : "bg-demand-medium"
                }`}
              />
              <span className="t-label text-ink">{p.skill}</span>
              <span className="text-xs tabular-nums text-muted">{p.score}</span>
              <TrendingUpIcon
                className={
                  p.tone === "high" ? "text-demand-high" : "text-demand-medium"
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
