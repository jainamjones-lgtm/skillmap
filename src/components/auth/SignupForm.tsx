"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type AuthState } from "@/lib/auth";

export function SignupForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signup, undefined);

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="name" className="field">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Ada Lovelace"
          className="input"
        />
        {state?.fieldErrors?.name?.map((e) => (
          <p key={e} className="mt-1.5 text-xs text-error">{e}</p>
        ))}
      </div>

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
          autoComplete="new-password"
          required
          placeholder="8+ characters, letters & numbers"
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
        {pending ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
