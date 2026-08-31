import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  email: z.email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Must contain at least one letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

export const LoginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export const CourseSchema = z.object({
  title: z.string().min(3, "Course title must be at least 3 characters").max(120),
  headline: z.string().min(5, "Headline must be at least 5 characters").max(200),
  description: z.string().min(10).max(5000),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "All Levels"]),
  durationMin: z.coerce.number().min(0).max(100000),
  imageColor: z.string().optional(),
  skillId: z.string().min(1, "Pick a skill"),
  category: z.string().min(2).max(60),
});

export const LessonSchema = z.object({
  title: z.string().min(2).max(160),
  durationMin: z.coerce.number().min(0).max(1000).default(0),
  content: z.string().min(1),
  videoUrl: z.string().optional(),
});

export const ReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
});