"use client";

import { useActionState, useState } from "react";
import { reviewCourse } from "@/lib/courses";

const STAR_PATH =
  "M11.48 3.5a.56.56 0 0 1 1.04 0l2.12 4.42a.56.56 0 0 0 .42.31l4.87.71c.46.07.64.64.31.97l-3.53 3.44a.56.56 0 0 0-.16.5l.83 4.85c.08.46-.4.81-.82.6l-4.36-2.3a.56.56 0 0 0-.52 0l-4.36 2.3c-.41.21-.9-.14-.82-.6l.83-4.85a.56.56 0 0 0-.16-.5L3.76 9.91a.56.56 0 0 1 .31-.97l4.87-.71a.56.56 0 0 0 .42-.31l2.12-4.42Z";

export function ReviewForm({ courseId }: { courseId: string }) {
  const [state, formAction, pending] = useActionState(
    reviewCourse.bind(null, courseId),
    undefined
  );
  const [rating, setRating] = useState(5);

  return (
    <form action={formAction} className="surface-card p-6 space-y-5">
      <h3 className="t-label text-ink">Leave a review</h3>

      <fieldset>
        <legend className="field">Rating</legend>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => {
            const filled = n <= rating;
            return (
              <label
                key={n}
                className="cursor-pointer rounded-md p-0.5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary"
              >
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  checked={rating === n}
                  onChange={() => setRating(n)}
                  className="sr-only"
                />
                <svg
                  viewBox="0 0 24 24"
                  fill={filled ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`size-6 ${filled ? "text-demand-medium" : "text-hairline"}`}
                  aria-hidden="true"
                >
                  <path d={STAR_PATH} />
                </svg>
                <span className="sr-only">
                  {n} star{n === 1 ? "" : "s"}
                </span>
              </label>
            );
          })}
          <span className="ml-2 text-sm text-muted tabular-nums">{rating}/5</span>
        </div>
      </fieldset>

      <div>
        <label className="field" htmlFor="comment">
          Comment (optional)
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          className="input h-auto resize-none py-3"
          placeholder="What made this course valuable (or not)?"
        />
      </div>

      {state?.error && <p className="text-sm text-error">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
        {pending ? "Posting…" : "Post review"}
      </button>
    </form>
  );
}
