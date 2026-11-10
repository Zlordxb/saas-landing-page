import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/site/Logo";
import { Alert } from "@/components/ui/Alert";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Owner login" };

export default function LoginPage() {
  const configured = isSupabaseConfigured();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-8 px-5 py-12">
      <Logo />
      <div className="rounded-xl border border-line bg-surface p-6 shadow-sm sm:p-8">
        <h1 className="font-display text-h3 font-medium">Owner login</h1>
        <p className="mt-1 mb-6 text-small text-ink-muted">
          For clinic staff only. Patients don’t need an account to book.
        </p>
        {configured ? (
          <LoginForm />
        ) : (
          <Alert tone="info" title="Supabase isn’t connected yet">
            Add your keys to <code>.env.local</code> and create the owner user. The README walks
            you through it.
          </Alert>
        )}
      </div>
      <Link href="/" className="rounded-sm text-small font-semibold text-link hover:underline">
        Back to the website
      </Link>
    </main>
  );
}
