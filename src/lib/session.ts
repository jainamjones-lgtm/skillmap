import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET ?? "dev-secret-change-me";
const encodedKey = new TextEncoder().encode(secretKey);

const SESSION_COOKIE = "session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

type SessionPayload = {
  userId: string;
  role: string;
  expiresAt: Date;
};

async function encrypt(payload: SessionPayload) {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(Math.floor(payload.expiresAt.getTime() / 1000))
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return {
      userId: payload.sub as string,
      role: payload.role as string,
      expiresAt: new Date((payload.exp as number) * 1000),
    };
  } catch {
    return null;
  }
}

export async function createSession(userId: string, role: string) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  const session = await encrypt({ userId, role, expiresAt });
  (await cookies()).set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSessionCookie() {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}