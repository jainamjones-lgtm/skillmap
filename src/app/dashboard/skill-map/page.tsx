import type { Metadata } from "next";
import { getSkills } from "@/lib/data";
import { SkillMapStage } from "@/components/skillmap/SkillMapStage";

export const metadata: Metadata = { title: "Skill map: SkillMap" };

export default async function SkillMapPage() {
  const skills = await getSkills();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="t-page text-ink">The skill map</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Every skill is a circle, sized and coloured by how much the market is
          hiring for it, grouped into territories. Pick one to see its demand
          score and the courses behind it.
        </p>
      </header>

      <SkillMapStage
        skills={skills}
        panel={
          <div className="flex flex-1 flex-col items-center justify-center gap-2.5 p-8 text-center">
            <span
              aria-hidden="true"
              className="grid size-11 place-items-center rounded-full bg-surface-low text-muted"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                <path d="M3 17l5-8 4 5 4-7 5 6" />
                <path d="M20 20H4" />
              </svg>
            </span>
            <p className="t-card text-ink">Pick a skill to open it</p>
            <p className="text-sm leading-relaxed text-muted">
              Each circle is a skill, sized and coloured by how much the market
              is hiring for it. Open one to see its demand score and every
              course that teaches it, or tap a territory&rsquo;s{" "}
              <strong className="font-semibold text-ink">+N more</strong> to
              list the rest.
            </p>
          </div>
        }
      />

      <p className="max-w-2xl text-sm leading-relaxed text-muted">
        Demand scores are curated from hiring research and job-market signals,
        stored in the database, and editable by admins. A live job-market data
        source can replace them later without touching the UI. Today the map
        covers {skills.length} skills across{" "}
        {new Set(skills.map((s) => s.category)).size} categories.
      </p>
    </div>
  );
}
