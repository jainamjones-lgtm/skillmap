"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { enroll } from "@/lib/courses";
import { formatDuration } from "@/lib/format";
import { ProgressBar } from "@/components/ui/ProgressBar";

function EnrollButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
      {pending ? "Enrolling…" : "Enroll now"}
    </button>
  );
}

export function EnrollBox({
  courseId,
  slug,
  lessonCount,
  durationMin,
  enrolled,
  progress,
  completed,
}: {
  courseId: string;
  slug: string;
  lessonCount: number;
  durationMin: number;
  enrolled: boolean;
  progress: number | null;
  completed: boolean;
}) {
  if (enrolled) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">{completed ? "Completed" : "In progress"}</span>
          <span className="font-medium tabular-nums text-ink">{progress ?? 0}%</span>
        </div>
        <ProgressBar value={progress ?? 0} />
        <Link href={`/courses/${slug}/learn`} className="btn-primary w-full">
          {completed ? "Review" : "Continue learning"}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-muted">
        {lessonCount} lesson{lessonCount === 1 ? "" : "s"} · {formatDuration(durationMin)}
      </p>
      <form action={enroll.bind(null, courseId)}>
        <EnrollButton />
      </form>
      <p className="text-center text-xs text-muted">
        Instant access · learn at your own pace
      </p>
    </div>
  );
}
