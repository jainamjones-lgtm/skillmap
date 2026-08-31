import type { Metadata } from "next";
import { listCourses, getCategories } from "@/lib/data";
import { CourseCard } from "@/components/courses/CourseCard";
import { BrowseControls } from "@/components/browse/BrowseControls";

export const metadata: Metadata = { title: "Browse courses: SkillMap" };

export const dynamic = "force-dynamic";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; level?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const category = params.category ?? "All";
  const level = params.level ?? "All";
  const sort = params.sort ?? "featured";

  const [courses, categories] = await Promise.all([
    listCourses({ q: q || undefined, category, level, sort }),
    getCategories(),
  ]);

  const active = { q, category, level, sort };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="t-page text-ink">Browse courses</h1>
        <p className="mt-2 text-muted">
          {courses.length} course{courses.length === 1 ? "" : "s"} across{" "}
          {categories.length} categor{categories.length === 1 ? "y" : "ies"}, built
          around the skills the market is hiring for.
        </p>
      </header>

      <BrowseControls categories={categories} active={active} />

      {courses.length === 0 ? (
        <div className="surface-card p-10 text-center text-muted">
          No courses match. Try a different search or clear the filters.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
