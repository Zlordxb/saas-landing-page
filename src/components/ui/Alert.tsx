import { CircleAlert, CircleCheck, Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/format";

type Tone = "error" | "success" | "info";

const tones: Record<Tone, string> = {
  error: "bg-danger-soft text-danger",
  success: "bg-confirmed text-on-confirmed",
  info: "bg-surface-muted text-ink",
};

const icons = { error: CircleAlert, success: CircleCheck, info: Info };

/** A message about the whole form or page: what happened, then what to do. */
export function Alert({
  tone,
  title,
  children,
  className,
}: {
  tone: Tone;
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  const Icon = icons[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-md p-4 text-small", tones[tone], className)}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        {children ? <div className="mt-0.5">{children}</div> : null}
      </div>
    </div>
  );
}
