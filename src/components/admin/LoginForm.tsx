"use client";

import { useActionState } from "react";
import { signIn, type SignInState } from "@/actions/admin";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

const inputClass =
  "h-12 w-full rounded-md border border-line-strong bg-surface px-4 text-body outline-none transition-[border-color,box-shadow] duration-150 hover:border-ink-muted focus:border-primary focus:ring-3 focus:ring-primary-soft";

const initialState: SignInState = { error: null };

/** useActionState runs the Server Action and gives us its result and a pending flag. */
export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-label font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-label font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>
      {state.error ? <Alert tone="error" title={state.error} /> : null}
      <Button type="submit" disabled={isPending} aria-busy={isPending || undefined}>
        {isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
