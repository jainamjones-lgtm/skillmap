import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/dal";
import { getCourseBySlug, getMyEnrollmentForCourse } from "@/lib/data";
import { EnrollBox } from "@/components/courses/EnrollBox";
import { ReviewForm } from "@/components/courses/ReviewForm";
import { formatDuration, initials, timeAgo } from "@/lib/format";
import { AuthedHeader } from "@/components/ui/AuthedHeader";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  return {
    title: course ? `${course.title}: SkillMap` : "Course not found: SkillMap",
  };
}

const STAR_PATH =
  "M11.48 3.5a.56.56 0 0 1 1.04 0l2.12 4.42a.56.56 0 0 0 .42.31l4.87.71c.46.07.64.64.31.97l-3.53 3.44a.56.56 0 0 0-.16.5l.83 4.85c.08.46-.4.81-.82.6l-4.36-2.3a.56.56 0 0 0-.52 0l-4.36 2.3c-.41.21-.9-.14-.82-.6l.83-4.85a.56.56 0 0 0-.16-.5L3.76 9.91a.56.56 0 0 1 .31-.97l4.87-.71a.56.56 0 0 0 .42-.31l2.12-4.42Z";

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          viewBox="0 0 24 24"
          fill={n <= rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`size-4 ${n <= rating ? "text-demand-medium" : "text-hairline"}`}
          aria-hidden="true"
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
    </span>
  );
}

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 shrink-0 text-primary"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireAuth();
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const enrollment = await getMyEnrollmentForCourse(user.id, course.id);

  const totalMin = course.lessons.reduce((a, l) => a + l.durationMin, 0);
  const duration = course.durationMin || totalMin;
  const lessonCount = course.lessons.length;
  const reviewCount = course._count.reviews;

  const meta = [
    course.level,
    formatDuration(duration),
    `${lessonCount} lesson${lessonCount === 1 ? "" : "s"}`,
    reviewCount > 0
      ? `${reviewCount} review${reviewCount === 1 ? "" : "s"}`
      : "No reviews yet",
  ];

  const included = [
    `${lessonCount} lesson${lessonCount === 1 ? "" : "s"}`,
    `${formatDuration(duration)} of material`,
    `${course.level} level`,
  ];

  return (
    <div>
      <AuthedHeader user={user} />

      <section className="bg-surface border-b border-hairline">
        <div className="content-max py-12 md:py-16">
          <div
            className={
              course.imageUrl
                ? "grid gap-8 md:grid-cols-[1fr_320px] md:items-center"
                : ""
            }
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {course.category && (
                  <span className="bg-canvas border border-hairline px-2 py-1 rounded-md t-micro text-ink">
                    {course.category}
                  </span>
                )}
                {course.skill && course.skill.name !== course.category && (
                  <Link
                    href={`/skill/${course.skill.slug}`}
                    className="bg-primary-tint px-2 py-1 rounded-md t-micro text-primary transition-colors duration-150 hover:bg-surface-variant focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {course.skill.name}
                  </Link>
                )}
              </div>

              <h1 className="t-display mt-5 max-w-3xl text-ink">
                {course.title}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
                {course.headline}
              </p>

              <p className="mt-6 text-sm text-muted">
                {meta.map((m, i) => (
                  <span key={m}>
                    {i > 0 && <span className="px-2 text-hairline">·</span>}
                    {m}
                  </span>
                ))}
              </p>
            </div>

            {course.imageUrl && (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg md:aspect-square">
                <Image
                  src={course.imageUrl}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 320px, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="content-max grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-12">
          <section>
            <h2 className="t-section text-ink">About this course</h2>
            <div className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-body">
              {course.description}
            </div>
          </section>

          <section>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="t-section text-ink">Curriculum</h2>
              <span className="text-xs text-muted tabular-nums">
                {lessonCount} lessons · {formatDuration(totalMin)}
              </span>
            </div>
            <ol className="mt-4 surface-card divide-y divide-hairline">
              {course.lessons.map((l, i) => (
                <li key={l.id} className="flex items-center gap-4 px-5 py-3.5">
                  <span className="w-6 shrink-0 text-xs text-muted tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium text-ink">
                    {l.title}
                  </span>
                  {l.videoUrl && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4 shrink-0 text-primary"
                      aria-label="Includes video"
                    >
                      <path d="M5 3l14 9-14 9V3z" />
                    </svg>
                  )}
                  <span className="shrink-0 text-xs text-muted tabular-nums">
                    {formatDuration(l.durationMin)}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="t-section text-ink">Reviews ({reviewCount})</h2>

            <div className="mt-4">
              {enrollment ? (
                <ReviewForm courseId={course.id} />
              ) : (
                <p className="surface-card p-5 text-sm text-muted">
                  Enroll in the course to leave a review.
                </p>
              )}
            </div>

            <div className="mt-4 space-y-4">
              {course.reviews.length === 0 ? (
                <p className="surface-card p-10 text-center text-muted">
                  No reviews yet. Be the first.
                </p>
              ) : (
                course.reviews.map((r) => (
                  <div key={r.id} className="surface-card p-5">
                    <div className="flex items-center gap-3">
                      <span
                        className="grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-on-primary"
                        style={{ background: r.user.avatarColor }}
                        aria-hidden="true"
                      >
                        {initials(r.user.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="t-label text-ink">{r.user.name}</p>
                        <p className="mt-1 flex items-center gap-2 text-xs text-muted">
                          <StarRow rating={r.rating} />
                          <span>{timeAgo(r.createdAt)}</span>
                        </p>
                      </div>
                    </div>
                    {r.comment && (
                      <p className="mt-3 text-sm leading-relaxed text-body">
                        {r.comment}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <aside>
          <div className="sticky top-24 surface-card p-6">
            <EnrollBox
              courseId={course.id}
              slug={course.slug}
              lessonCount={lessonCount}
              durationMin={duration}
              enrolled={!!enrollment}
              progress={enrollment?.progress ?? null}
              completed={!!enrollment?.completedAt}
            />

            <div className="mt-6 border-t border-hairline pt-6">
              <h3 className="t-label text-ink">What&apos;s included</h3>
              <ul className="mt-3 space-y-2.5 text-sm text-muted">
                {included.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
