"use client";

import { useActionState } from "react";
import { updateProfile } from "@/lib/auth";

export function NameForm({ defaultName }: { defaultName: string }) {
  const [state, formAction, pending] = useActionState(updateProfile, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="field" htmlFor="profile-name">
          Display name
        </label>
        <input
          id="profile-name"
          name="name"
          defaultValue={defaultName}
          className="input"
          maxLength={60}
          minLength={2}
          required
        />
        {state?.error && (
          <p className="mt-2 text-sm text-error">{state.error}</p>
        )}
        {state && !state.error && (
          <p className="mt-2 text-sm text-success">Saved</p>
        )}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="btn-primary disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
