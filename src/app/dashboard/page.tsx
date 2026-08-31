import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/dal";
import {
  getPopularCourses,
  getProfileData,
  getRecentEnrollments,
  getSkills,
} from "@/lib/data";
import { CourseCard } from "@/components/courses/CourseCard";
import { CoursePlate } from "@/components/courses/CoursePlate";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { DemandSnapshot } from "@/components/dashboard/DemandSnapshot";
import { demandTier } from "@/lib/territories";

export const metadata: Metadata = { title: "Dashboard: SkillMap" };

function ClockIcon({ className = "size-4" }: { className?: string }) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-4"
      aria-hidden="true"
    >
      <path d="M8 5.5v13l10.5-6.5z" />
    </svg>
  );
}

function TrendingIcon() {
  return (
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
      <path d="M22 7l-8.5 8.5-5-5L2 17" />
      <path d="M16 7h6v6" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto size-6 text-primary"
      aria-hidden="true"
    >
      <path d="M6 4h12v17l-6-4.5L6 21z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto size-6 text-success"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5.5" />
    </svg>
  );
}

function CapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto size-6 text-secondary"
      aria-hidden="true"
    >
      <path d="M22 9.5L12 4.5 2 9.5l10 5z" />
      <path d="M6 12v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4" />
    </svg>
  );
}

const pulseClass = (tier: string) => {
  if (tier === "Very high demand") return "bg-primary text-on-primary";
  if (tier === "High demand") return "bg-demand-medium text-ink";
  return "bg-primary-tint text-primary";
};

export default async function DashboardHome() {
  const user = await requireAuth();
  const [recent, popular, skills, profile] = await Promise.all([
    getRecentEnrollments(user.id, 4),
    getPopularCourses(4),
    getSkills(),
    getProfileData(user.id),
  ]);

  const demandRows = skills.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    demandScore: s.demandScore,
  }));

  const scores = skills.map((s) => s.demandScore);
  const min = scores.length ? Math.min(...scores) : 0;
  const max = scores.length ? Math.max(...scores) : 1;
  const pulse = skills.slice(0, 6);

  const enrollmentCount = profile?.stats.enrollments ?? 0;
  const completedCount = profile?.stats.completed ?? 0;
  const activeCount = Math.max(0, enrollmentCount - completedCount);
  const lessonsDone = profile?.stats.lessonsDone ?? 0;
  const overallPct =
    enrollmentCount === 0
      ? 0
      : Math.round((completedCount / enrollmentCount) * 100);

  const [current, ...rest] = recent;
  const currentTint = current?.course.imageColor ?? "#ba0036";
  const currentLessonsLeft = current
    ? Math.max(
        0,
        current.course.lessonCount -
          Math.round((current.course.lessonCount * current.progress) / 100),
      )
    : 0;

  return (
    <div className="space-y-section">
      <header>
        <h1 className="t-display text-ink">
          Good to see you, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-2 text-base text-muted">
          Here&rsquo;s where your learning stands.
        </p>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-section">
          <section>
            <h2 className="t-section text-ink">Continue Learning</h2>

            {!current ? (
              <div className="surface-card mt-6 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted">
                  Nothing in progress yet. Pick a course and your progress will
                  show up right here.
                </p>
                <Link href="/dashboard/browse" className="btn-primary shrink-0">
                  Find your first course
                </Link>
              </div>
            ) : (
              <>
                <article className="surface-card card-hover mt-6 overflow-hidden sm:grid sm:grid-cols-[240px_1fr]">
                  <CoursePlate
                    title={current.course.title}
                    tint={currentTint}
                    imageUrl={current.course.imageUrl}
                    className="min-h-[160px]"
                  />
                  <div className="p-6">
                    <span className="t-micro inline-flex rounded-full bg-primary-tint px-2 py-1 text-primary">
                      In progress
                    </span>
                    <h3 className="t-card mt-3 text-ink">
                      {current.course.title}
                    </h3>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                      <ClockIcon />
                      {currentLessonsLeft} lesson
                      {currentLessonsLeft === 1 ? "" : "s"} left
                    </p>

                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                        <span className="text-muted">Course Progress</span>
                        <span className="text-ink tabular-nums">
                          {current.progress}%
                        </span>
                      </div>
                      <ProgressBar value={current.progress} />
                    </div>

                    <div className="mt-6 flex sm:justify-end">
                      <Link
                        href={`/courses/${current.course.slug}/learn`}
                        className="btn-primary"
                      >
                        Continue
                        <PlayIcon />
                      </Link>
                    </div>
                  </div>
                </article>

                {rest.length > 0 && (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {rest.map((r) => (
                      <Link
                        key={r.id}
                        href={`/courses/${r.course.slug}/learn`}
                        className="surface-card card-hover p-5"
                      >
                        <h3 className="t-card line-clamp-1 text-ink">
                          {r.course.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted tabular-nums">
                          {r.progress}% complete · {r.course.lessonCount} lessons
                        </p>
                        <div className="mt-3">
                          <ProgressBar value={r.progress} />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>

          <section>
            <h2 className="t-section text-ink">Demand Pulse</h2>
            <p className="mt-1 text-sm text-muted">
              Skills worth learning next based on your interests.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {pulse.map((s) => (
                <Link
                  key={s.id}
                  href={`/skill/${s.slug}`}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition duration-150 ease-out hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${pulseClass(
                    demandTier(s.demandScore, min, max),
                  )}`}
                >
                  <TrendingIcon />
                  {s.name}
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="surface-card p-6 lg:sticky lg:top-24">
          <h2 className="t-section text-ink">Your Learning Progress</h2>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-md bg-surface-low p-4 text-center">
              <BookmarkIcon />
              <p className="mt-2 text-3xl font-bold text-ink tabular-nums">
                {activeCount}
              </p>
              <p className="text-xs text-muted">Active courses</p>
            </div>
            <div className="rounded-md bg-surface-low p-4 text-center">
              <CheckCircleIcon />
              <p className="mt-2 text-3xl font-bold text-ink tabular-nums">
                {completedCount}
              </p>
              <p className="text-xs text-muted">Completed</p>
            </div>
            <div className="col-span-2 rounded-md bg-surface-low p-4 text-center">
              <CapIcon />
              <p className="mt-2 text-3xl font-bold text-ink tabular-nums">
                {lessonsDone}
              </p>
              <p className="text-xs text-muted">Lessons done</p>
            </div>
          </div>

          <div className="mt-6 border-t border-hairline pt-6">
            <h3 className="t-label text-ink">Overall Progress</h3>
            <div className="mt-3 mb-2 flex items-center justify-between text-xs font-semibold">
              <span className="text-muted tabular-nums">
                {completedCount}/{enrollmentCount} courses
              </span>
              <span className="text-ink tabular-nums">{overallPct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-variant">
              <div
                className="h-full rounded-full bg-success"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
        </aside>
      </div>

      <section>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="t-section text-ink">Recommended for you</h2>
          <Link
            href="/dashboard/browse"
            className="shrink-0 text-sm font-semibold text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="t-section text-ink">Demand snapshot</h2>
          <Link
            href="/dashboard/skill-map"
            className="shrink-0 text-sm font-semibold text-primary hover:underline"
          >
            Full heatmap
          </Link>
        </div>
        <div className="surface-card overflow-hidden">
          <DemandSnapshot skills={demandRows} />
        </div>
      </section>
    </div>
  );
}
