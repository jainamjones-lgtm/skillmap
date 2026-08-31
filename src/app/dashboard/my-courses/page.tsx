import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/dal";
import { getMyEnrollments } from "@/lib/data";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { timeAgo } from "@/lib/format";
import { CoursePlate } from "@/components/courses/CoursePlate";

export const metadata: Metadata = { title: "My courses: SkillMap" };

export const dynamic = "force-dynamic";

export default async function MyCoursesPage() {
  await requireAuth();
  const enrollments = await getMyEnrollments();

  const inProgress = enrollments.filter((e) => !e.completedAt);
  const completed = enrollments.filter((e) => e.completedAt);

  function Row({ e }: { e: (typeof enrollments)[number] }) {
    const tint = e.course.imageColor ?? "#ba0036";
    const isDone = Boolean(e.completedAt);
    return (
      <article className="surface-card card-hover overflow-hidden sm:grid sm:grid-cols-[180px_1fr]">
        <CoursePlate
          title={e.course.title}
          tint={tint}
          imageUrl={e.course.imageUrl}
          className="hidden min-h-[120px] sm:block"
        />
        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={`/courses/${e.course.slug}/learn`}
                className="t-card block truncate text-ink transition duration-150 ease-out hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {e.course.title}
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                {e.course.skillName && <span>{e.course.skillName}</span>}
                <span aria-hidden>·</span>
                <span>{e.course.level}</span>
                <span aria-hidden>·</span>
                <span>{e.course.lessonCount} lessons</span>
                <span aria-hidden>·</span>
                <span>
                  {e.completedAt
                    ? `Completed ${timeAgo(e.completedAt)}`
                    : `Enrolled ${timeAgo(e.enrolledAt)}`}
                </span>
              </div>
            </div>
            <span
              className={`t-micro shrink-0 rounded-full px-2 py-1 ${
                isDone
                  ? "bg-surface-variant text-success"
                  : "bg-primary-tint text-primary"
              }`}
            >
              {isDone ? "Completed" : "In progress"}
            </span>
          </div>

          <div className="mt-5 space-y-3">
            <ProgressBar value={e.progress} />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-muted tabular-nums">
                {e.progress}% complete
              </span>
              <Link
                href={`/courses/${e.course.slug}/learn`}
                className={isDone ? "btn-secondary btn-sm" : "btn-primary btn-sm"}
              >
                {isDone ? "Review" : "Continue"}
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="space-y-12">
      <header>
        <h1 className="t-page text-ink">My courses</h1>
        <p className="mt-2 text-base text-muted">
          {enrollments.length === 0
            ? "Your learning plan lives here."
            : `${inProgress.length} in progress · ${completed.length} completed`}
        </p>
      </header>

      {enrollments.length === 0 ? (
        <div className="surface-card px-6 py-16 text-center">
          <p className="t-section text-ink">Nothing here yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Enroll in a course from the catalog or the skill heatmap to start
            building your learning plan.
          </p>
          <Link href="/dashboard/browse" className="btn-primary mt-7">
            Browse catalog
          </Link>
        </div>
      ) : (
        <>
          {inProgress.length > 0 && (
            <section>
              <h2 className="t-section mb-6 text-ink">In progress</h2>
              <div className="space-y-4">
                {inProgress.map((e) => (
                  <Row key={e.id} e={e} />
                ))}
              </div>
            </section>
          )}

          {completed.length > 0 && (
            <section>
              <h2 className="t-section mb-6 text-ink">Completed</h2>
              <div className="space-y-4">
                {completed.map((e) => (
                  <Row key={e.id} e={e} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
