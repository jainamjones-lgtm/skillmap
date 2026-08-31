"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createCourse, updateCourse } from "@/lib/courses";

type Skill = { id: string; name: string; category: string };

const LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"];

const PRESETS = [
  { name: "No color", value: "" },
  { name: "Violet", value: "#7c5cff" },
  { name: "Ocean", value: "#22d3ee" },
  { name: "Coral", value: "#ff5f6d" },
  { name: "Sunset", value: "#ffb85c" },
  { name: "Jade", value: "#16a085" },
  { name: "Crimson", value: "#c31432" },
  { name: "Royal", value: "#4a00e0" },
  { name: "Neon", value: "#00cdac" },
];

export function AdminCourseForm({
  skills,
  mode,
  initial,
  courseId,
}: {
  skills: Skill[];
  mode: "create" | "edit";
  initial?: {
    title: string;
    headline: string;
    description: string;
    level: string;
    durationMin: number;
    imageColor: string | null;
    skillId: string | null;
    category: string | null;
  };
  courseId?: string;
}) {
  const action =
    mode === "create"
      ? createCourse
      : updateCourse.bind(null, courseId as string);

  const [state, formAction, pending] = useActionState(action, undefined);
  const errors = state?.fieldErrors ?? {};

  const err = (name: string) => errors[name]?.[0];

  return (
    <form action={formAction} className="surface-card space-y-10 p-6">
      <fieldset>
        <legend className="t-section text-ink">The pitch</legend>
        <p className="mt-1 text-sm text-muted">
          What students see on the card and the course page.
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <label className="field" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              defaultValue={initial?.title}
              className="input"
              placeholder="e.g. Email Marketing & Lifecycle"
              required
            />
            {err("title") && (
              <p className="mt-1.5 text-xs text-error">{err("title")}</p>
            )}
          </div>

          <div>
            <label className="field" htmlFor="headline">
              Headline
            </label>
            <input
              id="headline"
              name="headline"
              defaultValue={initial?.headline}
              className="input"
              placeholder="One-line promise students see on the card"
              required
            />
            {err("headline") && (
              <p className="mt-1.5 text-xs text-error">{err("headline")}</p>
            )}
          </div>

          <div>
            <label className="field" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={initial?.description}
              rows={6}
              className="input min-h-[160px] resize-none py-3"
              placeholder="What will students learn, and why does it matter? Use blank lines for paragraphs."
              required
            />
            {err("description") && (
              <p className="mt-1.5 text-xs text-error">{err("description")}</p>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className="border-t border-hairline pt-8">
        <legend className="t-section text-ink">Placement</legend>
        <p className="mt-1 text-sm text-muted">
          Where this course sits on the skill map.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="field" htmlFor="skillId">
              Skill
            </label>
            <select
              id="skillId"
              name="skillId"
              className="input"
              defaultValue={initial?.skillId ?? ""}
              required
            >
              <option value="" disabled>
                Pick a skill…
              </option>
              {skills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · {s.category}
                </option>
              ))}
            </select>
            {err("skillId") && (
              <p className="mt-1.5 text-xs text-error">{err("skillId")}</p>
            )}
          </div>

          <div>
            <label className="field" htmlFor="category">
              Category
            </label>
            <input
              id="category"
              name="category"
              defaultValue={initial?.category ?? ""}
              className="input"
              placeholder="e.g. Email, Paid Media, Content"
              required
            />
            {err("category") && (
              <p className="mt-1.5 text-xs text-error">{err("category")}</p>
            )}
          </div>

          <div>
            <label className="field" htmlFor="level">
              Level
            </label>
            <select
              id="level"
              name="level"
              className="input"
              defaultValue={initial?.level ?? "Beginner"}
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field" htmlFor="durationMin">
              Duration (min)
            </label>
            <input
              id="durationMin"
              name="durationMin"
              type="number"
              min={0}
              defaultValue={initial?.durationMin ?? 180}
              className="input"
            />
            {err("durationMin") && (
              <p className="mt-1.5 text-xs text-error">{err("durationMin")}</p>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className="border-t border-hairline pt-8">
        <legend className="t-section text-ink">Thumbnail</legend>
        <p className="mt-1 text-sm text-muted">
          Leave on auto for a deterministic gradient per category, or pick a
          colour for a custom thumbnail.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {PRESETS.map((p) => (
            <label key={p.value} className="cursor-pointer">
              <input
                type="radio"
                name="imageColor"
                value={p.value}
                defaultChecked={(initial?.imageColor ?? "") === p.value}
                className="peer sr-only"
              />
              <span
                className="grid size-11 place-items-center rounded-md border border-hairline transition peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary/30 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary"
                style={
                  p.value
                    ? {
                        background: `linear-gradient(135deg, ${p.value}, ${p.value}99)`,
                      }
                    : { background: "var(--color-surface-variant)" }
                }
                title={p.name}
              >
                {p.value ? null : (
                  <span className="text-[10px] uppercase text-muted">auto</span>
                )}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {state?.error && (
        <p className="rounded-lg border border-error/30 bg-error/10 px-4 py-2.5 text-sm text-error">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
        <p className="text-xs text-muted">
          Saved courses are published immediately.
        </p>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/admin" className="btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="btn-primary disabled:opacity-60"
          >
            {pending
              ? mode === "create"
                ? "Creating…"
                : "Saving…"
              : mode === "create"
                ? "Create course"
                : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
