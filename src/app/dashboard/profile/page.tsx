import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/dal";
import { getProfileData } from "@/lib/data";
import { initials, timeAgo } from "@/lib/format";
import { NameForm } from "@/components/profile/NameForm";

export const metadata: Metadata = { title: "Profile: SkillMap" };

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireAuth();
  const profile = await getProfileData(user.id);
  if (!profile) return null;

  const stats = [
    { label: "Enrollments", value: profile.stats.enrollments },
    { label: "Completed", value: profile.stats.completed },
    { label: "Lessons done", value: profile.stats.lessonsDone },
  ];

  return (
    <div className="space-y-12">
      <header>
        <h1 className="t-page text-ink">Your profile</h1>
        <p className="mt-2 text-base text-muted">
          Your account details, learning totals and reviews.
        </p>
      </header>

      <section className="surface-card p-6">
        <div className="flex flex-wrap items-center gap-4">
          <span
            className="grid size-16 shrink-0 place-items-center rounded-full text-xl font-bold text-on-primary"
            style={{ background: profile.avatarColor }}
          >
            {initials(profile.name)}
          </span>
          <div className="min-w-0">
            <p className="t-card text-ink">{profile.name}</p>
            <p className="mt-0.5 text-sm text-muted">
              {profile.email} ·{" "}
              <span className="capitalize">{profile.role.toLowerCase()}</span>
              {" · "}
              Member since {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-hairline pt-6 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-md bg-surface-low p-4 text-center"
            >
              <p className="text-3xl font-bold text-ink tabular-nums">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-card p-6">
        <h2 className="t-section text-ink">Display name</h2>
        <p className="mt-1 text-sm text-muted">
          Update how your name appears across courses and reviews.
        </p>
        <div className="mt-6 max-w-sm">
          <NameForm defaultName={profile.name} />
        </div>
      </section>

      <section className="surface-card p-6">
        <h2 className="t-section text-ink">
          Your reviews ({profile.reviews.length})
        </h2>
        <p className="mt-1 text-sm text-muted">
          Reviews appear on the course page you wrote them for.
        </p>

        {profile.reviews.length === 0 ? (
          <p className="mt-6 rounded-md bg-surface-low px-6 py-10 text-center text-sm text-muted">
            No reviews yet. Finish a course and share your take.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {profile.reviews.map((r) => (
              <div
                key={r.id}
                className="rounded-md border border-hairline p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link
                    href={`/courses/${r.courseSlug}`}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {r.courseTitle}
                  </Link>
                  <span className="text-xs text-muted">
                    <span
                      className="text-demand-medium"
                      aria-label={`${r.rating} out of 5`}
                    >
                      {"★".repeat(r.rating)}
                    </span>
                    <span className="text-hairline" aria-hidden>
                      {"★".repeat(5 - r.rating)}
                    </span>
                    {" · "}
                    {timeAgo(r.createdAt)}
                  </span>
                </div>
                {r.comment && (
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {r.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
