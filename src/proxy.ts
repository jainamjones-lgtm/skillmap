import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET ?? "dev-secret-change-me";
const encodedKey = new TextEncoder().encode(secretKey);

const PUBLIC_PATHS = ["/", "/login", "/signup"];

async function readSession(req: NextRequest) {
  const cookie = req.cookies.get("session")?.value;
  if (!cookie) return null;
  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });
    return { userId: (payload.sub as string) ?? null };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = await readSession(request);

  const isPublic = PUBLIC_PATHS.includes(path);
  const isStatic = path.startsWith("/_next") || path.startsWith("/favicon");

  if (isStatic) return NextResponse.next();

  if (!session?.userId && !isPublic && !path.startsWith("/api/")) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (session?.userId && isPublic && path !== "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (session?.userId && path === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|ico|webp)$).*)"],
};