"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireAuth } from "@/lib/dal";
import { CourseSchema, LessonSchema, ReviewSchema } from "@/lib/definitions";
import { db } from "@/lib/db";

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 80) || "course"
  );
}

async function uniqueSlug(base: string) {
  let slug = slugify(base);
  let i = 2;
  while (await db.course.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${slugify(base)}-${i++}`;
  }
  return slug;
}

type MutState = { error?: string; fieldErrors?: Record<string, string[]> } | undefined;

export async function createCourse(
  prevState: MutState,
  formData: FormData
): Promise<MutState> {
  await requireAdmin();
  const parsed = CourseSchema.safeParse({
    title: formData.get("title"),
    headline: formData.get("headline"),
    description: formData.get("description"),
    level: formData.get("level"),
    durationMin: formData.get("durationMin"),
    imageColor: formData.get("imageColor"),
    skillId: formData.get("skillId"),
    category: formData.get("category"),
  });

  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const slug = await uniqueSlug(parsed.data.title);
  const course = await db.course.create({
    data: {
      title: parsed.data.title,
      slug,
      headline: parsed.data.headline,
      description: parsed.data.description,
      level: parsed.data.level,
      durationMin: parsed.data.durationMin,
      imageColor: parsed.data.imageColor || null,
      skillId: parsed.data.skillId,
      category: parsed.data.category,
      status: "Published",
    },
    select: { id: true, slug: true },
  });

  revalidatePath("/dashboard/browse");
  revalidatePath("/dashboard/skill-map");
  redirect(`/dashboard/admin/courses/${course.id}/edit`);
}

export async function updateCourse(
  courseId: string,
  prevState: MutState,
  formData: FormData
): Promise<MutState> {
  await requireAdmin();
  const parsed = CourseSchema.safeParse({
    title: formData.get("title"),
    headline: formData.get("headline"),
    description: formData.get("description"),
    level: formData.get("level"),
    durationMin: formData.get("durationMin"),
    imageColor: formData.get("imageColor"),
    skillId: formData.get("skillId"),
    category: formData.get("category"),
  });

  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const updated = await db.course.update({
    where: { id: courseId },
    data: {
      title: parsed.data.title,
      headline: parsed.data.headline,
      description: parsed.data.description,
      level: parsed.data.level,
      durationMin: parsed.data.durationMin,
      imageColor: parsed.data.imageColor || null,
      skillId: parsed.data.skillId,
      category: parsed.data.category,
    },
    select: { slug: true },
  });

  revalidatePath("/dashboard/browse");
  revalidatePath("/dashboard/skill-map");
  revalidatePath(`/courses/${updated.slug}`);
  revalidatePath(`/dashboard/admin/courses/${courseId}/edit`);
  redirect(`/dashboard/admin/courses/${courseId}/edit`);
}

export async function deleteCourse(courseId: string) {
  await requireAdmin();
  await db.course.delete({ where: { id: courseId } });
  revalidatePath("/dashboard/browse");
  revalidatePath("/dashboard/skill-map");
  redirect("/dashboard/admin");
}

// ----- Lessons -----

export async function addLesson(courseId: string, formData: FormData) {
  await requireAdmin();
  const parsed = LessonSchema.safeParse({
    title: formData.get("title"),
    durationMin: formData.get("durationMin"),
    content: formData.get("content"),
    videoUrl: formData.get("videoUrl") || undefined,
  });
  if (!parsed.success) return;

  const last = await db.lesson.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  await db.lesson.create({
    data: {
      courseId,
      title: parsed.data.title,
      durationMin: parsed.data.durationMin,
      content: parsed.data.content,
      videoUrl: parsed.data.videoUrl || null,
      order: (last?.order ?? 0) + 1,
    },
  });

  revalidatePath(`/dashboard/admin/courses/${courseId}/edit`);
  redirect(`/dashboard/admin/courses/${courseId}/edit`);
}

export async function updateLesson(lessonId: string, formData: FormData) {
  await requireAdmin();
  const parsed = LessonSchema.safeParse({
    title: formData.get("title"),
    durationMin: formData.get("durationMin"),
    content: formData.get("content"),
    videoUrl: formData.get("videoUrl") || undefined,
  });
  if (!parsed.success) return;

  const lesson = await db.lesson.update({
    where: { id: lessonId },
    data: {
      title: parsed.data.title,
      durationMin: parsed.data.durationMin,
      content: parsed.data.content,
      videoUrl: parsed.data.videoUrl || null,
    },
    select: { courseId: true },
  });

  revalidatePath(`/dashboard/admin/courses/${lesson.courseId}/edit`);
  redirect(`/dashboard/admin/courses/${lesson.courseId}/edit`);
}

export async function deleteLesson(lessonId: string) {
  await requireAdmin();
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    select: { courseId: true },
  });
  if (lesson) {
    await db.lesson.delete({ where: { id: lessonId } });
    revalidatePath(`/dashboard/admin/courses/${lesson.courseId}/edit`);
  }
  redirect(lesson ? `/dashboard/admin/courses/${lesson.courseId}/edit` : "/dashboard/admin");
}

// ----- Enrollment / learning -----

export async function enroll(courseId: string) {
  const user = await requireAuth();
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { slug: true },
  });
  if (!course) redirect("/dashboard/browse");

  await db.enrollment.upsert({
    where: { userId_courseId: { userId: user.id, courseId } },
    update: {},
    create: { userId: user.id, courseId },
  });

  revalidatePath(`/courses/${course.slug}`);
  revalidatePath("/dashboard/my-courses");
  redirect(`/courses/${course.slug}/learn`);
}

export async function toggleLessonComplete(lessonId: string, courseId: string) {
  const user = await requireAuth();
  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId } },
    include: {
      course: { include: { lessons: { select: { id: true } } } },
    },
  });
  if (!enrollment) redirect("/dashboard/my-courses");

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true },
  });
  if (!lesson) return;

  const existing = await db.lessonCompletion.findUnique({
    where: {
      enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId },
    },
  });

  if (existing) {
    await db.lessonCompletion.delete({
      where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
    });
  } else {
    await db.lessonCompletion.create({
      data: { enrollmentId: enrollment.id, lessonId },
    });
  }

  const done = await db.lessonCompletion.count({
    where: { enrollmentId: enrollment.id },
  });
  const total = enrollment.course.lessons.length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  await db.enrollment.update({
    where: { id: enrollment.id },
    data: {
      progress,
      completedAt: progress === 100 ? new Date() : null,
    },
  });

  revalidatePath(`/courses/${enrollment.course.slug}/learn`);
  revalidatePath("/dashboard/my-courses");
  revalidatePath("/dashboard");
}

// ----- Reviews -----

export async function reviewCourse(
  courseId: string,
  prevState: MutState,
  formData: FormData
) {
  const user = await requireAuth();
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { slug: true },
  });
  if (!course) return { error: "Course not found" };

  const parsed = ReviewSchema.safeParse({
    rating: formData.get("rating"),
    comment: formData.get("comment") || undefined,
  });
  if (!parsed.success) return { error: "Invalid review" };

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId } },
    select: { id: true },
  });
  if (!enrollment) return { error: "Enroll in the course before reviewing" };

  await db.review.upsert({
    where: { userId_courseId: { userId: user.id, courseId } },
    update: {
      rating: parsed.data.rating,
      comment: parsed.data.comment ?? null,
    },
    create: {
      userId: user.id,
      courseId,
      rating: parsed.data.rating,
      comment: parsed.data.comment ?? null,
    },
  });

  revalidatePath(`/courses/${course.slug}`);
  redirect(`/courses/${course.slug}`);
}