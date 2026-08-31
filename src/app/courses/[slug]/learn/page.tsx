import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/dal";
import { getCourseForLearning } from "@/lib/data";
import { toggleLessonComplete } from "@/lib/courses";
import { MarkCompleteButton } from "@/components/courses/MarkCompleteButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatDuration } from "@/lib/format";
import { AuthedHeader } from "@/components/ui/AuthedHeader";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const user = await requireAuth();
  const data = await getCourseForLearning(user.id, slug);
  return { title: data ? `${data.title}: Learning` : "Learning: SkillMap" };
}

function embedId(videoUrl: string | null) {
  if (!videoUrl) return null;
  const m = videoUrl.match(/[?&]v=([\w-]{6,})/);
  return m ? m[1] : null;
}

export default async function LearnPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { slug } = await params;
  const user = await requireAuth();
  const data = await getCourseForLearning(user.id, slug);
  if (!data) redirect(`/courses/${slug}`);

  const wanted = (await searchParams).lesson;
  const idx = data.lessons.findIndex((l) => l.id === wanted);
  const current = data.lessons[idx >= 0 ? idx : 0];
  const prev = data.lessons[idx - 1];
  const next = data.lessons[idx + 1];
  const videoId = embedId(current.videoUrl);
  const doneCount = data.lessons.filter((l) => l.done).length;

  return (
    <div>
      <AuthedHeader user={user} />

      <div className="sticky top-[72px] z-20 bg-canvas border-b border-hairline">
        <div className="content-max flex h-14 items-center gap-4">
          <Link
            href={`/courses/${slug}`}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-150 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
            <span className="hidden sm:inline">Back to course</span>
          </Link>
          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
            {data.title}
          </span>
          <div className="flex shrink-0 items-center gap-3">
            <div className="w-24 sm:w-40">
              <ProgressBar value={data.progress} />
            </div>
            <span className="text-xs text-muted tabular-nums">
              {data.progress}%
            </span>
          </div>
        </div>
      </div>

      <div className="content-max grid items-start gap-8 py-8 lg:grid-cols-[1fr_340px]">
        <main className="min-w-0 space-y-6">
          {videoId ? (
            <div className="aspect-video rounded-lg overflow-hidden border border-hairline bg-surface-dim">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={current.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center bg-surface-dim rounded-lg border border-hairline">
              <div className="text-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto size-8 text-muted"
                  aria-hidden="true"
                >
                  <path d="M5 3l14 9-14 9V3z" />
                </svg>
                <p className="mt-3 text-sm text-muted">Text lesson (no video)</p>
              </div>
            </div>
          )}

          <div>
            <p className="t-micro text-primary">
              Lesson {current.order} of {data.lessons.length} ·{" "}
              {formatDuration(current.durationMin)}
            </p>
            <h1 className="t-page mt-2 text-ink">{current.title}</h1>
            <div className="mt-4 whitespace-pre-line text-body leading-relaxed">
              {current.content}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-6">
            <div className="flex gap-2">
              {prev ? (
                <Link
                  href={`/courses/${slug}/learn?lesson=${prev.id}`}
                  className="btn-secondary btn-sm"
                >
                  Previous
                </Link>
              ) : (
                <span className="btn-secondary btn-sm pointer-events-none opacity-40">
                  Previous
                </span>
              )}
              {next ? (
                <Link
                  href={`/courses/${slug}/learn?lesson=${next.id}`}
                  className="btn-secondary btn-sm"
                >
                  Next
                </Link>
              ) : (
                <Link href={`/courses/${slug}`} className="btn-secondary btn-sm">
                  Back to course
                </Link>
              )}
            </div>
            <form action={toggleLessonComplete.bind(null, current.id, data.id)}>
              <MarkCompleteButton done={current.done} />
            </form>
          </div>
        </main>

        <aside className="surface-card overflow-hidden lg:sticky lg:top-[152px]">
          <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
            <span className="t-label text-ink">Lessons</span>
            <span className="text-xs text-muted tabular-nums">
              {doneCount}/{data.lessons.length} done
            </span>
          </div>
          <ol className="max-h-[60vh] overflow-y-auto">
            {data.lessons.map((l) => {
              const isCurrent = l.id === current.id;
              return (
                <li key={l.id}>
                  <Link
                    href={`/courses/${slug}/learn?lesson=${l.id}`}
                    aria-current={isCurrent ? "true" : undefined}
                    className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary ${
                      isCurrent
                        ? "bg-primary-tint text-primary font-semibold"
                        : "text-body hover:bg-surface-low"
                    }`}
                  >
                    <span className="w-5 shrink-0 text-center text-xs tabular-nums">
                      {l.done ? (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="size-4 text-success"
                          aria-label="Completed"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      ) : (
                        l.order
                      )}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{l.title}</span>
                    <span className="shrink-0 text-xs text-muted tabular-nums">
                      {formatDuration(l.durationMin)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </aside>
      </div>
    </div>
  );
}
