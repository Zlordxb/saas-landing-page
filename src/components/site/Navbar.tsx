"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FocusEvent } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Dropdown } from "@/components/ui/Dropdown";
import { clinicLinks } from "@/content/navigation";
import type { Service } from "@/data/services";
import { cn } from "@/lib/format";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { TreatmentsPanel } from "./TreatmentsPanel";

const navItem =
  "inline-flex h-10 items-center gap-1.5 rounded-full px-4 font-medium text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink aria-expanded:bg-surface-muted aria-expanded:text-ink";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The header: a "Treatments" mega menu, a "The clinic" dropdown, and a full-screen
 * menu on phones. A Client Component because menus have state; the pages stay on the server.
 */
export function Navbar({ services }: { services: Service[] }) {
  const pathname = usePathname();
  const [panelOpen, setPanelOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const lastPointer = useRef("mouse");

  // A new page closes every menu (React's "adjust state when a value changes" pattern).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setPanelOpen(false);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the treatments menu and puts focus back on its button.
  useEffect(() => {
    if (!panelOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setPanelOpen(false);
      triggerRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [panelOpen]);

  // The phone menu covers the page: focus its close button, lock the page's scroll,
  // close on Escape, and give focus back to the menu button afterwards.
  useEffect(() => {
    if (!mobileOpen) return;
    const root = document.documentElement;
    const menuButton = menuButtonRef.current;
    root.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      menuButton?.focus();
    };
  }, [mobileOpen]);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  // Hover intent: open after a short pause and close a little after the pointer leaves,
  // so crossing the menu on the way somewhere else doesn't flash it open.
  function hoverPanel(open: boolean) {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setPanelOpen(open), open ? 90 : 200);
  }

  function onTreatmentsBlur(event: FocusEvent<HTMLLIElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPanelOpen(false);
  }

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-bg/90 backdrop-blur-md transition-[box-shadow,border-color] duration-200",
        scrolled || panelOpen ? "border-line shadow-sm" : "border-transparent",
      )}
    >
      <Container className="flex h-18 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            <li>
              <Link
                href="/"
                aria-current={pathname === "/" ? "page" : undefined}
                className={cn(navItem, "aria-[current=page]:bg-surface-muted aria-[current=page]:text-ink")}
              >
                Home
              </Link>
            </li>
            {/* The panel sits inside this item, so Tab moves from the button straight into it. */}
            <li
              onPointerEnter={(event) => event.pointerType === "mouse" && hoverPanel(true)}
              onPointerLeave={(event) => event.pointerType === "mouse" && hoverPanel(false)}
              onBlur={onTreatmentsBlur}
            >
              <button
                ref={triggerRef}
                type="button"
                aria-expanded={panelOpen}
                aria-controls="treatments-panel"
                onPointerDown={(event) => {
                  lastPointer.current = event.pointerType;
                }}
                onClick={(event) => {
                  // A mouse already opened it by hovering: a click keeps it open.
                  const byMouse = event.detail > 0 && lastPointer.current === "mouse";
                  setPanelOpen((open) => (byMouse ? true : !open));
                }}
                className={navItem}
              >
                Treatments
                <ChevronDown
                  aria-hidden="true"
                  className={cn("size-4 transition-transform duration-200", panelOpen && "rotate-180")}
                  strokeWidth={2}
                />
              </button>

              <AnimatePresence>
                {panelOpen ? (
                  <motion.div
                    id="treatments-panel"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease }}
                    className="absolute inset-x-0 top-full border-b border-line bg-surface shadow-lg"
                  >
                    <TreatmentsPanel services={services} onNavigate={() => setPanelOpen(false)} />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
            <li>
              <Dropdown
                label={
                  <>
                    The clinic
                    <ChevronDown aria-hidden="true" className="size-4" strokeWidth={2} />
                  </>
                }
                buttonClassName={navItem}
                items={clinicLinks.map((link) => ({
                  href: link.href,
                  label: link.label,
                  description: link.description,
                  icon: <link.icon className="size-5" strokeWidth={1.75} />,
                }))}
              />
            </li>
            <li>
              <Link
                href="/services"
                aria-current={pathname === "/services" ? "page" : undefined}
                className={cn(navItem, "aria-[current=page]:bg-surface-muted aria-[current=page]:text-ink")}
              >
                Prices
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/book" size="sm">
            <span className="sm:hidden">Book</span>
            <span className="hidden sm:inline">Book an appointment</span>
          </ButtonLink>
          <button
            ref={menuButtonRef}
            type="button"
            className="grid size-10 place-items-center rounded-full text-ink hover:bg-surface-muted lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu aria-hidden="true" className="size-5" strokeWidth={1.75} />
          </button>
        </div>
      </Container>
    </header>

      {/* Outside the header: its backdrop blur would trap a fixed-position child inside it. */}
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease }}
            className="fixed inset-0 z-50 flex flex-col bg-bg lg:hidden"
          >
            <Container className="flex h-18 shrink-0 items-center justify-between border-b border-line">
              <Logo />
              <button
                ref={closeButtonRef}
                type="button"
                className="grid size-10 place-items-center rounded-full text-ink hover:bg-surface-muted"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </button>
            </Container>
            <motion.nav
              aria-label="Mobile"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.25, ease }}
              className="flex-1 overflow-y-auto"
            >
              <MobileMenu services={services} onNavigate={() => setMobileOpen(false)} />
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
