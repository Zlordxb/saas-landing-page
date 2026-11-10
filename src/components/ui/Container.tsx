import type { ComponentProps } from "react";
import { cn } from "@/lib/format";

/** Centers content with the page gutters: 20px on phones, 32px from tablets up. */
export function Container({
  size = "default",
  className,
  ...props
}: ComponentProps<"div"> & { size?: "default" | "narrow" }) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 md:px-8",
        size === "narrow" ? "max-w-4xl" : "max-w-content",
        className,
      )}
      {...props}
    />
  );
}
