import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseForEdit, getSkillOptions } from "@/lib/data";
import { AdminCourseForm } from "@/components/admin/AdminCourseForm";
import { LessonEditor } from "@/components/admin/LessonEditor";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const course = await getCourseForEdit(id);
  return {
    title: course ? `Edit ${course.title}` : "Edit course: Admin studio",
  };
}

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [course, skills] = await Promise.all([getCourseForEdit(id), getSkillOptions()]);
  if (!course) notFound();

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <Link
            href="/dashboard/admin"
            className="t-micro text-muted transition-colors hover:text-primary"
          >
            ← Back to courses
          </Link>
          <h2 className="t-page mt-3">Edit course</h2>
          <p className="mt-2 max-w-xl truncate text-muted">{course.title}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={`/courses/${course.slug}`} className="btn-secondary btn-sm">
            View course
          </Link>
          <Link
            href={`/courses/${course.slug}/learn`}
            className="btn-secondary btn-sm"
            target="_blank"
          >
            Preview learning
          </Link>
        </div>
      </header>

      <AdminCourseForm
        mode="edit"
        courseId={course.id}
        skills={skills}
        initial={{
          title: course.title,
          headline: course.headline,
          description: course.description,
          level: course.level,
          durationMin: course.durationMin,
          imageColor: course.imageColor,
          skillId: course.skillId,
          category: course.category,
        }}
      />

      <section className="border-t border-hairline pt-8">
        <LessonEditor
          courseId={course.id}
          lessons={course.lessons.map((l) => ({
            id: l.id,
            title: l.title,
            durationMin: l.durationMin,
            content: l.content,
            videoUrl: l.videoUrl,
            order: l.order,
          }))}
        />
      </section>
    </div>
  );
}
