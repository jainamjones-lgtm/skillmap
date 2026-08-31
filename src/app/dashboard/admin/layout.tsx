import Link from "next/link";
import { requireAdmin } from "@/lib/dal";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-6">
        <div>
          <p className="t-micro text-primary">Course operations</p>
          <h1 className="t-page mt-2">Admin studio</h1>
          <p className="mt-2 text-muted">
            Create, edit and delete courses. Lessons are edited per course.
          </p>
        </div>
        <Link href="/dashboard/admin/courses/new" className="btn-primary btn-sm">
          New course
        </Link>
      </header>

      {children}
    </div>
  );
}
