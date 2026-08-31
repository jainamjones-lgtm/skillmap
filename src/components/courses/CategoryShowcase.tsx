"use client";

import { useState } from "react";
import Link from "next/link";
import { CourseCard } from "@/components/courses/CourseCard";
import type { CourseCard as CourseCardType } from "@/lib/data";

/**
 * Tabbed course browser for the landing page: pick a track, see real courses.
 * Every competitor landing page leads with something like this, and it lets a
 * visitor judge the catalogue before signing up.
 */
export function CategoryShowcase({
  groups,
}: {
  groups: { name: string; courses: CourseCardType[] }[];
}) {
  const [active, setActive] = useState(groups[0]?.name ?? "");
  const shown = groups.find((g) => g.name === active) ?? groups[0];

  if (!shown) return null;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Course tracks"
        className="hide-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:flex-wrap md:px-0"
      >
        {groups.map((g) => {
          const isActive = g.name === active;
          return (
            <button
              key={g.name}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(g.name)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition duration-150 ease-out ${
                isActive
                  ? "border-primary bg-primary text-on-primary"
                  : "border-hairline bg-canvas text-muted hover:border-primary hover:text-primary"
              }`}
            >
              {g.name}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {shown.courses.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>

      <p className="mt-8">
        <Link
          href="/dashboard/browse"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition duration-150 ease-out hover:text-primary-hover"
        >
          Browse the full catalogue
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
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </Link>
      </p>
    </div>
  );
}
