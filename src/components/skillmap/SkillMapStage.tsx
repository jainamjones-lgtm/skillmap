"use client";

import Link from "next/link";
import { useState } from "react";
import { SkillTerritoryMap } from "@/components/skillmap/SkillTerritoryMap";
import { tierOf, type MapSkill, type TerritoryLayout } from "@/lib/territories";

const FILL: Record<"high" | "medium" | "low", string> = {
  high: "bg-demand-high",
  medium: "bg-demand-medium",
  low: "bg-demand-low",
};

/**
 * Full-bleed map beside a narrow detail panel.
 *
 * Every map surface shares this frame, so the canvas never changes size when
 * you move between them. The stage also owns the "+N more" territory listing,
 * which keeps that affordance working on every page that shows a map rather
 * than only where a page remembered to wire up a handler.
 */
export function SkillMapStage({
  skills,
  activeSlug,
  panel,
}: {
  skills: MapSkill[];
  /** highlight the skill this page is about */
  activeSlug?: string;
  /** shown whenever no territory is open */
  panel: React.ReactNode;
}) {
  const [territory, setTerritory] = useState<TerritoryLayout | null>(null);

  const scores = skills.map((s) => s.demandScore);
  const min = scores.length ? Math.min(...scores) : 0;
  const max = scores.length ? Math.max(...scores) : 0;

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 border-y border-hairline lg:grid lg:grid-cols-[1fr_320px]">
      <div className="h-[520px] overflow-hidden md:h-[640px] lg:h-[calc(100vh-72px)] lg:max-h-[860px] lg:min-h-[640px]">
        <SkillTerritoryMap
          skills={skills}
          activeSlug={activeSlug}
          variant="full"
          onSelectTerritory={setTerritory}
        />
      </div>

      <aside className="flex flex-col overflow-y-auto border-t border-hairline bg-canvas lg:border-t-0 lg:border-l">
        {territory ? (
          <>
            <div className="flex items-start justify-between gap-3 border-b border-hairline p-5">
              <div className="min-w-0">
                <span className="t-micro text-muted">Territory</span>
                <h2 className="t-section mt-1.5 text-ink">{territory.name}</h2>
                <p className="mt-1.5 text-sm text-muted">
                  {territory.skills.length} skills · peak demand{" "}
                  <span className="tabular-nums">{territory.peak}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTerritory(null)}
                aria-label="Close territory list"
                className="-mr-1 grid size-8 shrink-0 place-items-center rounded-full text-muted transition hover:bg-surface-low hover:text-ink"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  className="size-4"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <ul className="flex-1 divide-y divide-hairline">
              {territory.skills
                .slice()
                .sort((a, b) => b.demandScore - a.demandScore)
                .map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/skill/${s.slug}`}
                      aria-current={s.slug === activeSlug ? "page" : undefined}
                      className={`group flex items-center justify-between gap-3 px-5 py-2.5 transition hover:bg-surface-low ${
                        s.slug === activeSlug ? "bg-primary-tint" : ""
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span
                          aria-hidden="true"
                          className={`size-2.5 shrink-0 rounded-full ${
                            FILL[tierOf(s.demandScore, min, max)]
                          }`}
                        />
                        <span className="truncate text-sm font-medium text-ink group-hover:text-primary">
                          {s.name}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs tabular-nums text-muted">
                        {s.demandScore}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </>
        ) : (
          panel
        )}
      </aside>
    </div>
  );
}
