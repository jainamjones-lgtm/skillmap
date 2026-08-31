"use client";

import { useState } from "react";
import { addLesson, updateLesson, deleteLesson } from "@/lib/courses";
import { formatDuration } from "@/lib/format";

type Lesson = {
  id: string;
  title: string;
  durationMin: number;
  content: string;
  videoUrl: string | null;
  order: number;
};

function LessonFields({
  idPrefix,
  defaultValues,
}: {
  idPrefix: string;
  defaultValues?: {
    title: string;
    durationMin: string;
    content: string;
    videoUrl: string;
  };
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
        <div>
          <label className="field" htmlFor={`${idPrefix}-title`}>
            Title
          </label>
          <input
            id={`${idPrefix}-title`}
            name="title"
            defaultValue={defaultValues?.title}
            className="input"
            placeholder="e.g. The retention math"
            required
          />
        </div>
        <div>
          <label className="field" htmlFor={`${idPrefix}-durationMin`}>
            Minutes
          </label>
          <input
            id={`${idPrefix}-durationMin`}
            name="durationMin"
            type="number"
            min={0}
            max={1000}
            defaultValue={defaultValues?.durationMin ?? "12"}
            className="input"
            required
          />
        </div>
      </div>

      <div>
        <label className="field" htmlFor={`${idPrefix}-videoUrl`}>
          YouTube URL (optional)
        </label>
        <input
          id={`${idPrefix}-videoUrl`}
          name="videoUrl"
          defaultValue={defaultValues?.videoUrl}
          className="input"
          placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
        />
        <p className="mt-1.5 text-xs text-muted">
          Only public, embeddable videos are shown. Leave empty for a text lesson.
        </p>
      </div>

      <div>
        <label className="field" htmlFor={`${idPrefix}-content`}>
          Content
        </label>
        <textarea
          id={`${idPrefix}-content`}
          name="content"
          rows={6}
          defaultValue={defaultValues?.content}
          className="input min-h-[160px] resize-none py-3"
          placeholder="Lesson body, paragraphs separated by blank lines."
          required
        />
      </div>
    </>
  );
}

export function LessonEditor({
  courseId,
  lessons,
}: {
  courseId: string;
  lessons: Lesson[];
}) {
  const [mode, setMode] = useState<null | string | "__new__">(null);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="t-section text-ink">Lessons</h2>
          <p className="mt-1 text-sm text-muted">
            {lessons.length} in this course, shown in learning order.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMode(mode === "__new__" ? null : "__new__")}
          className={
            mode === "__new__" ? "btn-secondary btn-sm" : "btn-primary btn-sm"
          }
        >
          {mode === "__new__" ? "Cancel" : "Add lesson"}
        </button>
      </div>

      {/* Add-lesson form */}
      {mode === "__new__" && (
        <form
          action={addLesson.bind(null, courseId)}
          className="surface-card space-y-4 border-dashed p-6"
        >
          <p className="t-micro text-primary">New lesson · added at the end</p>
          <LessonFields idPrefix="new-lesson" />
          <div className="flex items-center gap-3 border-t border-hairline pt-4">
            <button type="submit" className="btn-primary btn-sm">
              Add lesson
            </button>
            <button
              type="button"
              onClick={() => setMode(null)}
              className="btn-secondary btn-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {lessons.length === 0 ? (
        <p className="surface-card p-8 text-center text-sm text-muted">
          No lessons yet, add the first one.
        </p>
      ) : (
        <ol className="surface-card divide-y divide-hairline overflow-hidden">
          {lessons.map((l, i) =>
            mode === l.id ? (
              <li key={l.id} className="space-y-4 bg-surface-low p-6">
                <div className="flex items-center justify-between">
                  <p className="t-micro text-primary">Editing lesson {i + 1}</p>
                  <button
                    type="button"
                    className="text-xs font-semibold text-muted transition-colors hover:text-ink"
                    onClick={() => setMode(null)}
                  >
                    Close
                  </button>
                </div>
                <form
                  action={updateLesson.bind(null, l.id)}
                  className="space-y-4"
                >
                  <LessonFields
                    idPrefix={`lesson-${l.id}`}
                    defaultValues={{
                      title: l.title,
                      durationMin: String(l.durationMin),
                      content: l.content,
                      videoUrl: l.videoUrl ?? "",
                    }}
                  />
                  <div className="flex items-center gap-3 border-t border-hairline pt-4">
                    <button type="submit" className="btn-primary btn-sm">
                      Save lesson
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode(null)}
                      className="btn-secondary btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </li>
            ) : (
              <li
                key={l.id}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-low"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary-tint text-xs font-semibold tabular-nums text-primary">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {l.title}
                  </p>
                  <p className="text-xs text-muted">
                    {formatDuration(l.durationMin)}
                    {l.videoUrl ? " · video" : " · text"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMode(l.id)}
                  className="btn-secondary btn-sm"
                >
                  Edit
                </button>
                <form action={deleteLesson.bind(null, l.id)}>
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center rounded-md px-3 text-sm font-semibold text-error transition-colors hover:bg-error/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Delete
                  </button>
                </form>
              </li>
            )
          )}
        </ol>
      )}
    </div>
  );
}
