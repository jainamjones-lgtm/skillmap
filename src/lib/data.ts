import "server-only";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/dal";

export type CourseCard = {
  id: string;
  title: string;
  slug: string;
  headline: string;
  level: string;
  durationMin: number;
  category: string | null;
  imageColor: string | null;
  imageUrl: string | null;
  popularity: number;
  skillName: string | null;
  reviewCount: number;
};

const courseCardSelect = {
  id: true,
  title: true,
  slug: true,
  headline: true,
  level: true,
  durationMin: true,
  category: true,
  imageColor: true,
  imageUrl: true,
  skill: { select: { name: true } },
  _count: { select: { reviews: true, enrollments: true } },
} as const;

type CourseRow = {
  id: string;
  title: string;
  slug: string;
  headline: string;
  level: string;
  durationMin: number;
  category: string | null;
  imageColor: string | null;
  imageUrl: string | null;
  skill: { name: string } | null;
  _count: { reviews: number; enrollments: number };
};

function toCourseCard(c: CourseRow): CourseCard {
  return {
    id: c.id,
    title: c.title,
    slug: c.slug,
    headline: c.headline,
    level: c.level,
    durationMin: c.durationMin,
    category: c.category,
    imageColor: c.imageColor,
    imageUrl: c.imageUrl,
    skillName: c.skill?.name ?? null,
    popularity: c._count.enrollments,
    reviewCount: c._count.reviews,
  };
}

export async function listCourses(filters?: {
  q?: string;
  category?: string;
  level?: string;
  sort?: string;
}) {
  const courses = await db.course.findMany({
    where: {
      status: "Published",
      ...(filters?.q
        ? {
            OR: [
              { title: { contains: filters.q } },
              { headline: { contains: filters.q } },
              { category: { contains: filters.q } },
            ],
          }
        : {}),
      ...(filters?.category && filters.category !== "All"
        ? { category: filters.category }
        : {}),
      ...(filters?.level && filters.level !== "All"
        ? { level: filters.level }
        : {}),
    },
    select: courseCardSelect,
    orderBy: {
      createdAt: filters?.sort === "newest" ? "desc" : undefined,
    },
    take: 100,
  });

  const cards = courses.map(toCourseCard);

  if (filters?.sort === "popular") {
    cards.sort((a, b) => b.popularity - a.popularity);
  } else if (filters?.sort === "rated") {
    // Approximate by reviews count; refine later with avg rating
    cards.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  return cards;
}

export async function getCourseBySlug(slug: string) {
  const course = await db.course.findUnique({
    where: { slug },
    include: {
      skill: true,
      lessons: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          durationMin: true,
          order: true,
          content: true,
          videoUrl: true,
        },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, avatarColor: true } } },
        take: 20,
      },
      _count: { select: { enrollments: true, reviews: true } },
    },
  });

  if (!course) return null;

  const agg = await db.review.aggregate({
    where: { courseId: course.id },
    _avg: { rating: true },
  });

  return {
    ...course,
    avgRating: agg._avg.rating ?? 0,
  };
}

export async function getSkills() {
  const skills = await db.skill.findMany({
    orderBy: { demandScore: "desc" },
    include: {
      // A skill is taught both by the courses filed under it and by courses
      // that cover it as a secondary skill; the map counts both.
      _count: { select: { courses: true, coveringCourses: true } },
    },
  });
  return skills.map((s) => ({
    ...s,
    _count: { courses: s._count.courses + s._count.coveringCourses },
  }));
}

export async function getSkillBySlug(slug: string) {
  const skill = await db.skill.findUnique({
    where: { slug },
    include: {
      _count: { select: { courses: true, coveringCourses: true } },
    },
  });
  if (!skill) return null;
  return {
    ...skill,
    _count: { courses: skill._count.courses + skill._count.coveringCourses },
  };
}

export async function getCoursesBySkill(skillId: string) {
  const courses = await db.course.findMany({
    where: {
      status: "Published",
      // filed under this skill, or covering it as a secondary skill
      OR: [{ skillId }, { coveredSkills: { some: { id: skillId } } }],
    },
    select: { ...courseCardSelect, skillId: true },
    orderBy: { title: "asc" },
    take: 50,
  });
  // The course filed under the skill leads; the rest cover it secondarily.
  const dedicated = courses.filter((c) => c.skillId === skillId);
  const covering = courses.filter((c) => c.skillId !== skillId);
  return [...dedicated, ...covering].map(toCourseCard);
}

export async function getMyEnrollments() {
  const user = await requireAuth();
  const enrollments = await db.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          skill: { select: { name: true, color: true } },
          lessons: { select: { id: true } },
          _count: { select: { lessons: true } },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  return enrollments.map((e) => ({
    id: e.id,
    progress: e.progress,
    completedAt: e.completedAt,
    enrolledAt: e.enrolledAt,
    course: {
      id: e.course.id,
      title: e.course.title,
      slug: e.course.slug,
      headline: e.course.headline,
      imageColor: e.course.imageColor,
      imageUrl: e.course.imageUrl,
      level: e.course.level,
      skillName: e.course.skill?.name ?? null,
      lessonCount: e.course._count.lessons,
    },
  }));
}

export async function getRecentEnrollments(userId: string, take: number) {
  const rows = await db.enrollment.findMany({
    where: { userId, progress: { gt: 0, lt: 100 } },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          imageColor: true,
          imageUrl: true,
          lessons: { select: { id: true } },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
    take,
  });
  return rows.map((r) => ({
    id: r.id,
    progress: r.progress,
    course: {
      id: r.course.id,
      title: r.course.title,
      slug: r.course.slug,
      imageColor: r.course.imageColor,
      imageUrl: r.course.imageUrl,
      lessonCount: r.course.lessons.length,
    },
  }));
}

export async function getCategories() {
  const rows = await db.course.findMany({
    where: { status: "Published", category: { not: null } },
    select: { category: true },
    distinct: ["category"],
  });
  return rows.map((r) => r.category as string).slice(0, 12);
}

export async function getPlatformStats() {
  const [skills, courses, lessons] = await Promise.all([
    db.skill.count(),
    db.course.count({ where: { status: "Published" } }),
    db.lesson.count(),
  ]);
  return { skills, courses, lessons };
}

export async function getSkillOptions() {
  return db.skill.findMany({
    select: { id: true, name: true, category: true },
    orderBy: { demandScore: "desc" },
  });
}

export async function getPopularCourses(take: number) {
  const courses = await db.course.findMany({
    where: { status: "Published" },
    select: courseCardSelect,
    take: 60,
  });
  return courses
    .map(toCourseCard)
    .sort((a, b) => b.popularity - a.popularity || b.reviewCount - a.reviewCount)
    .slice(0, take);
}

export async function getMyEnrollmentForCourse(userId: string, courseId: string) {
  return db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: { id: true, progress: true, completedAt: true },
  });
}

export async function getCourseForLearning(userId: string, slug: string) {
  const course = await db.course.findUnique({
    where: { slug },
    include: {
      lessons: { orderBy: { order: "asc" } },
    },
  });
  if (!course) return null;

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: course.id } },
    include: {
      completions: { select: { lessonId: true } },
    },
  });
  if (!enrollment) return null;

  const done = new Set(enrollment.completions.map((c) => c.lessonId));
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    headline: course.headline,
    imageColor: course.imageColor,
    skillId: course.skillId,
    progress: enrollment.progress,
    lessons: course.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      durationMin: l.durationMin,
      order: l.order,
      content: l.content,
      videoUrl: l.videoUrl,
      done: done.has(l.id),
    })),
  };
}

export async function getAdminCourses() {
  return db.course.findMany({
    include: {
      _count: { select: { lessons: true, enrollments: true } },
      skill: { select: { name: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getCourseForEdit(id: string) {
  return db.course.findUnique({
    where: { id },
    include: { lessons: { orderBy: { order: "asc" } }, skill: true },
  });
}

export async function getProfileData(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { course: { select: { title: true, slug: true } } },
        take: 20,
      },
    },
  });
  if (!user) return null;

  const [enrollments, completed, lessonsDone] = await Promise.all([
    db.enrollment.count({ where: { userId } }),
    db.enrollment.count({ where: { userId, completedAt: { not: null } } }),
    db.lessonCompletion.count({
      where: { enrollment: { userId } },
    }),
  ]);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarColor: user.avatarColor,
    createdAt: user.createdAt,
    stats: { enrollments, completed, lessonsDone },
    reviews: user.reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      courseTitle: r.course.title,
      courseSlug: r.course.slug,
    })),
  };
}