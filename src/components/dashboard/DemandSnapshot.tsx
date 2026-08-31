"use client";

import Link from "next/link";
import { useState } from "react";
import { demandTier } from "@/lib/territories";

type SkillRow = {
  id: string;
  slug: string;
  name: string;
  demandScore: number;
};

const PAGE_SIZE = 10;

const tierClass = (tier: string) => {
  if (tier === "Very high demand") {
    return { text: "text-demand-high", bar: "bg-demand-high" };
  }
  if (tier === "High demand") {
    return { text: "text-demand-medium", bar: "bg-demand-medium" };
  }
  return { text: "text-demand-low", bar: "bg-demand-low" };
};

function Chevron({ direction }: { direction: "left" | "right" }) {
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
      {direction === "left" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  );
}

export function DemandSnapshot({ skills }: { skills: SkillRow[] }) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(skills.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const rows = skills.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);

  const scores = skills.map((s) => s.demandScore);
  const min = scores.length ? Math.min(...scores) : 0;
  const max = scores.length ? Math.max(...scores) : 1;

  const start = current * PAGE_SIZE + 1;
  const end = Math.min(skills.length, start + PAGE_SIZE - 1);

  return (
    <>
      <ol className="divide-y divide-hairline">
        {rows.map((s, i) => {
          const tier = demandTier(s.demandScore, min, max);
          const style = tierClass(tier);
          const pct =
            max === min
              ? 100
              : Math.round(((s.demandScore - min) / (max - min)) * 100);
          return (
            <li key={s.id}>
              <Link
                href={`/skill/${s.slug}`}
                className="group grid grid-cols-[32px_1fr_auto] items-center gap-4 px-5 py-3 transition duration-150 ease-out hover:bg-surface-low"
              >
                <span className="text-xs text-muted tabular-nums">
                  {String(current * PAGE_SIZE + i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink group-hover:text-primary">
                    {s.name}
                  </p>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-surface-variant">
                    <div
                      className={`h-full rounded-full ${style.bar}`}
                      style={{ width: `${Math.max(6, pct)}%` }}
                    />
                  </div>
                </div>
                <span
                  className={`w-[104px] shrink-0 text-right text-xs ${style.text}`}
                >
                  {tier}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline px-5 py-3">
        <span className="text-xs text-muted tabular-nums">
          {start}–{end} of {skills.length} skills
        </span>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={current === 0}
            className="btn-secondary btn-sm disabled:pointer-events-none disabled:opacity-40"
          >
            <Chevron direction="left" />
            Prev
          </button>
          <span className="text-xs text-muted tabular-nums">
            {current + 1} / {pages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
            disabled={current === pages - 1}
            className="btn-secondary btn-sm disabled:pointer-events-none disabled:opacity-40"
          >
            Next
            <Chevron direction="right" />
          </button>
        </div>
      </div>
    </>
  );
}
