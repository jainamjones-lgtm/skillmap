import Link from "next/link";
import { formatDuration } from "@/lib/format";
import type { CourseCard } from "@/lib/data";
import { CoursePlate, tintFor } from "@/components/courses/CoursePlate";

export function CourseCard({ course }: { course: CourseCard }) {
  const tint =
    course.imageColor ??
    tintFor(course.category ?? course.skillName ?? course.title);
  const label = course.category ?? course.skillName ?? course.level;

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group surface-card overflow-hidden card-hover flex flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <CoursePlate
        title={course.title}
        tint={tint}
        imageUrl={course.imageUrl}
        className="w-full aspect-[1.5/1]"
      >
        <span className="absolute top-3 left-3 bg-canvas/90 backdrop-blur-sm px-2 py-1 rounded-md t-micro text-ink">
          {label}
        </span>
      </CoursePlate>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="t-card text-ink line-clamp-2 transition-colors duration-150 group-hover:text-primary">
          {course.title}
        </h3>
        <p className="mt-1 text-sm text-muted line-clamp-2">{course.headline}</p>

        <div className="mt-auto pt-4 border-t border-hairline flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1.5">
            {course.reviewCount > 0 && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 text-demand-medium"
                aria-hidden="true"
              >
                <path d="M11.48 3.5a.56.56 0 0 1 1.04 0l2.12 4.42a.56.56 0 0 0 .42.31l4.87.71c.46.07.64.64.31.97l-3.53 3.44a.56.56 0 0 0-.16.5l.83 4.85c.08.46-.4.81-.82.6l-4.36-2.3a.56.56 0 0 0-.52 0l-4.36 2.3c-.41.21-.9-.14-.82-.6l.83-4.85a.56.56 0 0 0-.16-.5L3.76 9.91a.56.56 0 0 1 .31-.97l4.87-.71a.56.56 0 0 0 .42-.31l2.12-4.42Z" />
              </svg>
            )}
            {course.reviewCount > 0
              ? `${course.reviewCount} review${course.reviewCount > 1 ? "s" : ""}`
              : "New"}
          </span>
          <span className="flex items-center gap-1.5">
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
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            {formatDuration(course.durationMin)}
          </span>
        </div>
      </div>
    </Link>
  );
}
