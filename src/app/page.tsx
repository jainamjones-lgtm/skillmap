import Image from "next/image";
import Link from "next/link";
import { PublicNav } from "@/components/ui/PublicNav";
import { CategoryShowcase } from "@/components/courses/CategoryShowcase";
import { Footer } from "@/components/ui/SiteFooter";
import { SkillTerritoryMap } from "@/components/skillmap/SkillTerritoryMap";
import { getPlatformStats, getSkills, listCourses } from "@/lib/data";
import { demandTier, territoryOf } from "@/lib/territories";

const NAV_LINKS = [
  { label: "Skill map", href: "/dashboard/skill-map" },
  { label: "Browse courses", href: "/dashboard/browse" },
];

const STEPS = [
  {
    no: "01",
    title: "Read the demand",
    body: "Each territory on the map shades by how much the market is hiring for those skills right now. No guesswork, no rankings games.",
  },
  {
    no: "02",
    title: "Pick a skill",
    body: "Open a territory to see the individual skills inside, their demand score, and the courses attached to each one.",
  },
  {
    no: "03",
    title: "Learn it end to end",
    body: "Enroll, work through video lessons at your own pace, and watch your progress move. Finish, and the map reflects it back.",
  },
];

/** How the three demand-signal colors are staged across pulse pills and chips. */
type Tier = "high" | "medium" | "low";

function tierOf(score: number, min: number, max: number): Tier {
  const label = demandTier(score, min, max);
  if (label === "Very high demand" || label === "High demand") return "high";
  if (label === "Moderate demand") return "medium";
  return "low";
}

const TREND_TEXT: Record<Tier, string> = {
  high: "text-demand-high",
  medium: "text-demand-medium",
  low: "text-muted",
};

function TrendIcon({ tier, className }: { tier: Tier; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {tier === "low" ? (
        <path d="M4 12h13m-3-4 4 4-4 4" />
      ) : (
        <path d="M4 17 10 11l4 4 6-6m0 0h-5m5 0v5" />
      )}
    </svg>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

export default async function LandingPage() {
  const [skills, stats, allCourses] = await Promise.all([
    getSkills(),
    getPlatformStats(),
    listCourses(),
  ]);

  // Raw course categories are fragmented ("Analytics" vs "Analytics & Data"),
  // so group them into the same territories the map uses.
  const byTrack = new Map<string, typeof allCourses>();
  for (const c of allCourses) {
    const key = territoryOf(c.category ?? "Other");
    byTrack.set(key, [...(byTrack.get(key) ?? []), c]);
  }
  const groups = [...byTrack.entries()]
    .map(([name, courses]) => ({ name, courses: courses.slice(0, 4) }))
    .filter((g) => g.courses.length === 4)
    .sort((a, b) => a.name.localeCompare(b.name));

  const ranked = skills.slice().sort((a, b) => b.demandScore - a.demandScore);
  const min = ranked.length ? ranked[ranked.length - 1].demandScore : 0;
  const max = ranked.length ? ranked[0].demandScore : 0;
  const rail = ranked.slice(0, 8);

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNav links={NAV_LINKS} />

      <main className="flex-1">
        {/*
          Hero: the photograph runs to both viewport edges. A mask on the image
          fades it down toward the left, under the copy, so it dissolves rather
          than ending on a cut, while never dropping to fully transparent.
          Layers use positive z-index because `-z-10` compiles to nothing here.
        */}
        <section className="relative flex min-h-[560px] w-full items-start overflow-hidden lg:min-h-[620px] lg:items-center">
          {/* Full bleed on both sides: the photo reaches each viewport edge. */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-professional.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="hero-photo object-cover object-[68%_50%] lg:object-[72%_45%]"
            />
          </div>

          <div className="content-max relative z-20 w-full pt-12 pb-[210px] lg:py-24">
            <div className="max-w-xl xl:max-w-2xl">
              <h1 className="text-[38px] leading-[1.05] font-bold tracking-tight text-ink sm:text-[48px] lg:text-[56px] xl:text-[64px]">
                Master the skills the{" "}
                <span className="text-primary">market</span> is hiring for.
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted sm:text-xl lg:text-[22px]">
                We score every marketing skill by real hiring demand, so you
                always know exactly what to learn next.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/dashboard/skill-map"
                  className="btn-hero bg-primary text-on-primary shadow-lift hover:-translate-y-0.5 hover:bg-primary-hover"
                >
                  Explore the Skill Map
                </Link>
                <Link
                  href="/dashboard/browse"
                  className="btn-hero border border-hairline bg-canvas text-ink hover:bg-surface-low"
                >
                  Browse courses
                </Link>
              </div>

              <div className="mt-12">
                <p className="text-2xl font-bold tabular-nums text-ink">
                  {stats.skills}
                </p>
                <p className="t-micro mt-1 text-muted">
                  Skills scored by demand
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Course browser — judge the catalogue before signing up. */}
        <section className="content-max py-section">
          <div className="max-w-xl">
            <h2 className="t-section text-ink">Start with a track</h2>
            <p className="mt-2 text-base leading-relaxed text-muted">
              Every course is built from short video lessons and tied to a skill
              the market is actively hiring for.
            </p>
          </div>
          <div className="mt-8">
            <CategoryShowcase groups={groups} />
          </div>
        </section>

        {/* Skills the market wants most */}
        <section className="border-t border-hairline">
          <div className="content-max py-section">
            <h2 className="t-section text-ink">Skills the market wants most</h2>
            <div className="mt-6 flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {rail.map((s) => {
                const tier = tierOf(s.demandScore, min, max);
                return (
                  <Link
                    key={s.id}
                    href={`/skill/${s.slug}`}
                    className="chip shrink-0 hover:bg-surface-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {s.name}
                    <span className="inline-flex items-center gap-1 rounded-full bg-canvas px-2 py-0.5">
                      <span
                        className={`text-xs tabular-nums ${TREND_TEXT[tier]}`}
                      >
                        {s.demandScore}
                      </span>
                      <TrendIcon
                        tier={tier}
                        className={`size-3.5 ${TREND_TEXT[tier]}`}
                      />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* The skill map */}
        <section className="content-max py-section">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="t-section text-ink">
                Demand across the field, mapped.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                Territories are shaded by peak demand. Hover one to see the
                skills inside and where to learn them.
              </p>
            </div>
            <Link
              href="/dashboard/skill-map"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary transition duration-150 ease-out hover:text-primary-hover"
            >
              Open the full map
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-8">
            <SkillTerritoryMap skills={skills} />
          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-hairline bg-surface">
          <div className="content-max py-section">
            <h2 className="t-section text-ink">
              From map to mastery in three steps.
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.no} className="surface-card card-hover p-6">
                  <p className="t-micro text-primary">{s.no}</p>
                  <h3 className="t-card mt-3 text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="content-max py-section">
          <div className="flex flex-col items-center gap-6 rounded-xl border border-hairline bg-surface px-6 py-section text-center">
            <h2 className="t-display max-w-2xl text-ink">
              Your next skill is already in the market.
            </h2>
            <Link href="/signup" className="btn-primary">
              Start Learning Now
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
