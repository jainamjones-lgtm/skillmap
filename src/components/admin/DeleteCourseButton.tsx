"use client";

import { deleteCourse } from "@/lib/courses";

export function DeleteCourseButton({
  courseId,
  title,
}: {
  courseId: string;
  title: string;
}) {
  return (
    <form
      action={deleteCourse.bind(null, courseId)}
      onSubmit={(e) => {
        if (!confirm(`Delete "${title}" and all its lessons?`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold text-error transition-colors hover:bg-error/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="size-4"
        >
          <path d="M4 7h16" />
          <path d="M9 7V4h6v3" />
          <path d="M6 7l1 13h10l1-13" />
          <path d="M10 11v6M14 11v6" />
        </svg>
        Delete
      </button>
    </form>
  );
}
