"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/format";

export type DropdownItem = {
  label: string;
  description?: string;
  icon?: ReactNode;
  /** A link item (a page, an anchor, a data: file). */
  href?: string;
  /** Opens in a new tab. */
  external?: boolean;
  /** Saves the linked file under this name instead of opening it. */
  download?: string;
  /** A button item. */
  onSelect?: () => void;
  /** Choice menus only: the selected option. */
  checked?: boolean;
};

type DropdownProps = {
  /** What the button shows. */
  label: ReactNode;
  /** The button's accessible name, when the label alone isn't clear. */
  ariaLabel?: string;
  items: DropdownItem[];
  align?: "start" | "end";
  buttonClassName?: string;
  menuClassName?: string;
  /** "menu" for links and actions; "choice" to pick one option, like a sort order. */
  kind?: "menu" | "choice";
};

const itemsIn = (menu: HTMLElement | null) =>
  Array.from(menu?.querySelectorAll<HTMLElement>('[role^="menuitem"]') ?? []);

/**
 * A menu button, built to the WAI-ARIA "menu button" pattern:
 * Enter, Space or Arrow Down opens it, arrow keys move between items,
 * Escape closes it and gives focus back to the button, a click outside closes it.
 */
export function Dropdown({
  label,
  ariaLabel,
  items,
  align = "start",
  buttonClassName,
  menuClassName,
  kind = "menu",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const focusOnOpen = useRef<"first" | "last">("first");

  // When the menu opens, move focus into it: the checked option, or the first (or last) item.
  useEffect(() => {
    if (!open) return;
    const elements = itemsIn(menuRef.current);
    const checked = elements.findIndex(
      (element) => element.getAttribute("aria-checked") === "true",
    );
    const index = focusOnOpen.current === "last" ? elements.length - 1 : checked >= 0 ? checked : 0;
    elements[index]?.focus();
  }, [open]);

  // A click anywhere outside closes the menu.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function close(returnFocus: boolean) {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }

  function onButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    focusOnOpen.current = event.key === "ArrowUp" ? "last" : "first";
    setOpen(true);
  }

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const elements = itemsIn(menuRef.current);
    const current = elements.indexOf(document.activeElement as HTMLElement);
    const last = elements.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: current >= last ? 0 : current + 1,
      ArrowUp: current <= 0 ? last : current - 1,
      Home: 0,
      End: last,
    };
    if (event.key in moves) {
      event.preventDefault();
      elements[moves[event.key]]?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  const itemRole = kind === "choice" ? "menuitemradio" : "menuitem";
  const itemClass =
    "flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left text-ink outline-none transition-colors duration-100 hover:bg-surface-muted focus-visible:bg-primary-soft focus-visible:text-on-primary-soft";

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        id={`${id}-button`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-menu` : undefined}
        aria-label={ariaLabel}
        onClick={() => {
          focusOnOpen.current = "first";
          setOpen((value) => !value);
        }}
        onKeyDown={onButtonKeyDown}
        className={buttonClassName}
      >
        {label}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={menuRef}
            id={`${id}-menu`}
            role="menu"
            aria-labelledby={`${id}-button`}
            onKeyDown={onMenuKeyDown}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute top-full z-50 mt-2 min-w-60 rounded-lg border border-line bg-surface p-1.5 shadow-lg",
              align === "end" ? "right-0 origin-top-right" : "left-0 origin-top-left",
              menuClassName,
            )}
          >
            {items.map((item) => {
              const content = (
                <>
                  {kind === "choice" ? (
                    <Check
                      aria-hidden="true"
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        item.checked ? "opacity-100" : "opacity-0",
                      )}
                      strokeWidth={2}
                    />
                  ) : item.icon ? (
                    <span className="mt-0.5 shrink-0 text-primary">{item.icon}</span>
                  ) : null}
                  <span className="flex min-w-0 flex-col">
                    <span className="font-medium">{item.label}</span>
                    {item.description ? (
                      <span className="text-small text-ink-muted">{item.description}</span>
                    ) : null}
                  </span>
                </>
              );

              if (item.href && !item.external && !item.download) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    role={itemRole}
                    tabIndex={-1}
                    className={itemClass}
                    onClick={() => close(false)}
                  >
                    {content}
                  </Link>
                );
              }
              if (item.href) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    role={itemRole}
                    tabIndex={-1}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    download={item.download}
                    className={itemClass}
                    onClick={() => close(!item.external)}
                  >
                    {content}
                  </a>
                );
              }
              return (
                <button
                  key={item.label}
                  type="button"
                  role={itemRole}
                  tabIndex={-1}
                  aria-checked={kind === "choice" ? Boolean(item.checked) : undefined}
                  className={itemClass}
                  onClick={() => {
                    item.onSelect?.();
                    close(true);
                  }}
                >
                  {content}
                </button>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
