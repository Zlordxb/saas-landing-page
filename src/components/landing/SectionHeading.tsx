import type { ReactNode } from "react";

export function SectionHeading({
  id,
  title,
  lead,
}: {
  id?: string;
  title: string;
  lead?: ReactNode;
}) {
  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <h2 id={id} className="font-display text-h2-sm md:text-h2">
        {title}
      </h2>
      {lead ? <p className="text-lead text-ink-muted">{lead}</p> : null}
    </div>
  );
}
