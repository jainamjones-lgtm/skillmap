import type { Metadata } from "next";
import Link from "next/link";
import { getSkillOptions } from "@/lib/data";
import { AdminCourseForm } from "@/components/admin/AdminCourseForm";

export const metadata: Metadata = { title: "New course: Admin studio" };

export default async function NewCoursePage() {
  const skills = await getSkillOptions();

  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/dashboard/admin"
          className="t-micro text-muted transition-colors hover:text-primary"
        >
          ← Back to courses
        </Link>
        <h2 className="t-page mt-3">New course</h2>
        <p className="mt-2 text-muted">
          Fill in the details, then add lessons on the next screen.
        </p>
      </header>

      <AdminCourseForm mode="create" skills={skills} />
    </div>
  );
}
