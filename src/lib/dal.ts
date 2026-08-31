import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { decrypt, getSessionCookie } from "@/lib/session";
import { db } from "@/lib/db";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STUDENT";
  avatarColor: string;
};

const verifySession = cache(async () => {
  const cookie = await getSessionCookie();
  const session = await decrypt(cookie);
  if (!session?.userId) redirect("/login");
  return session;
});

export async function requireAuth(): Promise<SessionUser> {
  const session = await verifySession();
  if (!session?.userId) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarColor: true,
    },
  });

  if (!user) redirect("/login");
  return user;
}

export const requireAdmin = cache(async () => {
  const user = await requireAuth();
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
});