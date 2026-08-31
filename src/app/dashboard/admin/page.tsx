import type { Metadata } from "next";
import Link from "next/link";
import { getAdminCourses } from "@/lib/data";
import { DeleteCourseButton } from "@/components/admin/DeleteCourseButton";

export const metadata: Metadata = { title: "Admin studio: SkillMap" };

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const courses = await getAdminCourses();

  if (courses.length === 0) {
    return (
      <div className="surface-card p-12 text-center">
        <p className="t-card text-ink">No courses yet</p>
        <p className="mt-2 text-sm text-muted">
          Create your first course, it will publish immediately.
        </p>
      </div>
    );
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline bg-surface text-left">
              <th className="t-micro px-5 py-3 text-muted">Course</th>
              <th className="t-micro hidden px-5 py-3 text-muted md:table-cell">
                Category
              </th>
              <th className="t-micro hidden px-5 py-3 text-muted lg:table-cell">
                Level
              </th>
              <th className="t-micro px-5 py-3 text-center text-muted">Lessons</th>
              <th className="t-micro hidden px-5 py-3 text-center text-muted sm:table-cell">
                Enrolled
              </th>
              <th className="t-micro px-5 py-3 text-muted">Status</th>
              <th className="t-micro px-5 py-3 text-right text-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {courses.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-surface-low">
                <td className="px-5 py-4">
                  <Link
                    href={`/courses/${c.slug}`}
                    className="text-sm font-medium text-ink transition-colors hover:text-primary"
                  >
                    {c.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted">{c.slug}</p>
                </td>
                <td className="hidden px-5 py-4 md:table-cell">
                  {c.category ? (
                    <span className="chip px-3 py-1 text-xs">{c.category}</span>
                  ) : (
                    <span className="text-xs text-muted">Uncategorised</span>
                  )}
                </td>
                <td className="hidden px-5 py-4 text-muted lg:table-cell">
                  {c.level}
                </td>
                <td className="px-5 py-4 text-center tabular-nums text-ink">
                  {c._count.lessons}
                </td>
                <td className="hidden px-5 py-4 text-center tabular-nums text-ink sm:table-cell">
                  {c._count.enrollments}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      c.status === "Published"
                        ? "bg-primary-tint text-primary"
                        : "bg-surface-variant text-muted"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/dashboard/admin/courses/${c.id}/edit`}
                      className="btn-secondary btn-sm"
                    >
                      Edit
                    </Link>
                    <DeleteCourseButton courseId={c.id} title={c.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
