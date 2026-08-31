import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/dal";
import { getSkillBySlug, getSkills, getCoursesBySkill } from "@/lib/data";
import { AuthedHeader } from "@/components/ui/AuthedHeader";
import { Footer } from "@/components/ui/SiteFooter";
import { SkillMapStage } from "@/components/skillmap/SkillMapStage";
import { CourseCard } from "@/components/courses/CourseCard";
import { buildTerritories, demandTier } from "@/lib/territories";

export const dynamic = "force-dynamic";

/** Badge tint follows the map's three demand signals. */
const BADGE: Record<"high" | "medium" | "low", string> = {
  high: "bg-demand-high text-white",
  medium: "bg-demand-medium text-ink",
  low: "bg-surface-variant text-muted",
};

function tierOf(score: number, min: number, max: number) {
  const label = demandTier(score, min, max);
  if (label === "Very high demand" || label === "High demand") return "high";
  if (label === "Moderate demand") return "medium";
  return "low";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const skill = await getSkillBySlug(slug);
  return {
    title: skill ? `${skill.name}: SkillMap` : "Skill not found: SkillMap",
  };
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [user, skill, skills] = await Promise.all([
    requireAuth(),
    getSkillBySlug(slug),
    getSkills(),
  ]);

  if (!skill) notFound();

  const courses = await getCoursesBySkill(skill.id);

  const scores = skills.map((s) => s.demandScore);
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const label = demandTier(skill.demandScore, min, max);
  const tier = tierOf(skill.demandScore, min, max);
  const rank = scores.filter((s) => s > skill.demandScore).length + 1;
  const territory = buildTerritories(skills).find(
    (t) =>
      t.name === skill.category || t.skills.some((s) => s.slug === skill.slug),
  );
  const learners = courses.reduce((acc, c) => acc + c.popularity, 0);

  return (
    <div className="flex min-h-screen flex-col">
      <AuthedHeader user={user} isAdmin={user.role === "ADMIN"} />

      <main className="flex-1">
        <div className="content-max pt-8 pb-6">
          <Link
            href="/dashboard/skill-map"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition duration-150 ease-out hover:text-ink"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
              aria-hidden="true"
            >
              <path d="M19 12H5m6 6-6-6 6-6" />
            </svg>
            Skill map
          </Link>
        </div>

        {/* Same stage as the browse map, so the canvas never changes size. */}
        <SkillMapStage
          skills={skills}
          activeSlug={skill.slug}
          panel={
            <>
              <div className="border-b border-hairline p-5">
                <span
                  className={`t-micro inline-block rounded-full px-2.5 py-1 ${BADGE[tier]}`}
                >
                  {label}
                </span>
                <h1 className="t-section mt-2.5 text-ink">{skill.name}</h1>
              </div>

              <div className="flex flex-col gap-6 p-5">
                <div className="rounded-lg bg-surface-low p-4">
                  <div className="flex items-end justify-between gap-3">
                    <span className="t-micro text-muted">Demand score</span>
                    <span className="flex items-baseline gap-1">
                      <span className="text-4xl leading-none font-bold tabular-nums text-primary">
                        {skill.demandScore}
                      </span>
                      <span className="text-sm text-muted">/100</span>
                    </span>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-variant">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${skill.demandScore}%` }}
                    />
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-muted">
                    Ranks {rank} of {skills.length} mapped skills by demand
                    {territory ? ` in the ${territory.name} territory` : ""}.
                  </p>
                </div>

                <div>
                  <h2 className="t-card text-ink">About this skill</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {skill.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="surface-card p-4 text-center">
                    <p className="text-2xl font-bold tabular-nums text-ink">
                      {skill._count.courses}
                    </p>
                    <p className="t-micro mt-1 text-muted">Courses</p>
                  </div>
                  <div className="surface-card p-4 text-center">
                    <p className="text-2xl font-bold tabular-nums text-ink">
                      {learners}
                    </p>
                    <p className="t-micro mt-1 text-muted">Learners</p>
                  </div>
                </div>

                <a href="#courses" className="btn-primary btn-sm w-full">
                  See the courses
                </a>
              </div>
            </>
          }
        />

        <div className="content-max py-12 md:py-14">
          <section id="courses" className="scroll-mt-24">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="t-section text-ink">Courses for {skill.name}</h2>
                <p className="mt-1 text-sm text-muted">
                  {courses.length > 1
                    ? "The dedicated course first, then others that cover it."
                    : courses.length === 1
                      ? "Pick a path and start learning."
                      : "A course path is in production for this skill."}
                </p>
              </div>
              <Link
                href="/dashboard/browse"
                className="shrink-0 text-sm font-semibold text-primary transition duration-150 ease-out hover:text-primary-hover"
              >
                Browse all
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
