"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { OpenStatus } from "./OpenStatus";

/**
 * On phones, once the hero's booking buttons have scrolled away, a slim bar keeps
 * "Book" one tap away. Hidden on the booking pages themselves and near the footer.
 */
export function MobileBookBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 480;
      setVisible(window.scrollY > 640 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/book")) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-30 flex items-center justify-between gap-3 rounded-full border border-line bg-surface/95 py-2 pr-2 pl-5 shadow-lg backdrop-blur md:hidden"
        >
          <OpenStatus className="min-w-0 truncate text-small text-ink-muted" />
          <ButtonLink href="/book" size="sm" className="shrink-0">
            Book
          </ButtonLink>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
