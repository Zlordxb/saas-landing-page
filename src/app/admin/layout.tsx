import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

/** The dashboard has its own simple shell: no public navbar or footer. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-bg">{children}</div>;
}
