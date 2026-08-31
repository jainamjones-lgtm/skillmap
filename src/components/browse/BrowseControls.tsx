"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];
const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most popular" },
  { value: "rated", label: "Top rated" },
];

export function BrowseControls({
  categories,
  active,
}: {
  categories: string[];
  active: { q: string; category: string; level: string; sort: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) inputRef.current.value = active.q;
  }, [active.q]);

  const build = (patch: Partial<typeof active>) => {
    const params = new URLSearchParams(searchParams.toString());
    const next = { ...active, ...patch };
    for (const k of ["q", "category", "level", "sort"] as const) {
      const v = next[k];
      if (v && v !== "All" && v !== "featured") params.set(k, v);
      else params.delete(k);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const selectClass =
    "h-full w-full appearance-none bg-transparent pl-3 pr-7 text-sm text-ink outline-none sm:pl-5 sm:pr-9 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary";

  return (
    <div className="space-y-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (debounce.current) clearTimeout(debounce.current);
          build({ q: inputRef.current?.value ?? "" });
        }}
        className="flex h-14 items-stretch rounded-full border border-hairline bg-canvas"
      >
        <input
          ref={inputRef}
          name="q"
          defaultValue={active.q}
          placeholder="Search courses, skills, topics…"
          aria-label="Search courses"
          className="min-w-0 flex-1 bg-transparent px-4 text-sm sm:px-6 text-ink outline-none placeholder:text-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
          onChange={(e) => {
            const v = e.target.value;
            if (debounce.current) clearTimeout(debounce.current);
            debounce.current = setTimeout(() => build({ q: v }), 300);
          }}
        />

        <div className="relative flex shrink-0 items-center border-l border-hairline">
          <select
            aria-label="Category"
            className={selectClass}
            value={active.category}
            onChange={(e) => build({ category: e.target.value })}
          >
            <option value="All">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Chevron />
        </div>

        <div className="relative flex shrink-0 items-center border-l border-hairline">
          <select
            aria-label="Level"
            className={selectClass}
            value={active.level}
            onChange={(e) => build({ level: e.target.value })}
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l === "All" ? "All levels" : l}
              </option>
            ))}
          </select>
          <Chevron />
        </div>

        <div className="flex shrink-0 items-center border-l border-hairline px-2">
          <button
            type="submit"
            aria-label="Search"
            className="grid size-10 place-items-center rounded-full bg-primary text-on-primary transition-colors duration-150 hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.6-3.6" />
            </svg>
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-3">
        {SORTS.map((s) => {
          const isActive = active.sort === s.value;
          return (
            <button
              key={s.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => build({ sort: s.value })}
              className={`chip focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                isActive
                  ? "bg-primary text-on-primary border-primary"
                  : "hover:bg-surface-high"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none absolute right-3 size-4 text-muted"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
