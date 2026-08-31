"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import * as bcrypt from "bcryptjs";
import { LoginSchema, SignupSchema } from "@/lib/definitions";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/dal";
import { createSession, deleteSession } from "@/lib/session";

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 10;
const attempts = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (attempts.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX) return true;
  hits.push(now);
  attempts.set(key, hits);
  return false;
}

export type AuthState =
  | { error?: string; fieldErrors?: Record<string, string[]> }
  | undefined;

export async function signup(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? "").toLowerCase().trim(),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = SignupSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await db.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });
  if (existing) {
    return { fieldErrors: { email: ["An account with this email already exists"] } };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await db.user.create({
    data: {
      name: parsed.data.name.trim(),
      email: parsed.data.email,
      passwordHash,
    },
    select: { id: true, role: true },
  });

  await createSession(user.id, user.role);
  redirect("/dashboard");
}

export async function login(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const raw = {
    email: String(formData.get("email") ?? "").toLowerCase().trim(),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) return { fieldErrors: { email: ["Invalid input"] } };

  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(`${ip}:${parsed.data.email}`)) {
    return { error: "Too many attempts. Please wait a few minutes." };
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return { error: "Invalid email or password" };

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) return { error: "Invalid email or password" };

  await createSession(user.id, user.role);
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}

export async function updateProfile(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const user = await requireAuth();
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2) {
    return { error: "Name must be at least 2 characters" };
  }
  if (name.length > 60) {
    return { error: "Name must be at most 60 characters" };
  }
  await db.user.update({ where: { id: user.id }, data: { name } });
  revalidatePath("/dashboard/profile");
  return {};
}