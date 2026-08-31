"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthState } from "@/lib/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(login, undefined);

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="email" className="field">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="input"
        />
        {state?.fieldErrors?.email?.map((e) => (
          <p key={e} className="mt-1.5 text-xs text-error">{e}</p>
        ))}
      </div>

      <div>
        <label htmlFor="password" className="field">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="input"
        />
        {state?.fieldErrors?.password?.map((e) => (
          <p key={e} className="mt-1.5 text-xs text-error">{e}</p>
        ))}
      </div>

      {state?.error && (
        <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-2.5 text-sm text-error">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Log in"}
      </button>

      <p className="text-center text-sm text-muted">
        Need an account?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Sign up as a student
        </Link>
      </p>
    </form>
  );
}
