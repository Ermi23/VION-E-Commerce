"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "./Icons";

interface NavLink {
  href: string;
  label: string;
}

/** Hamburger menu for phones. Closes on navigation and on Escape. */
export default function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="-mr-2 flex size-11 items-center justify-center rounded-full transition active:scale-90"
      >
        {open ? <CloseIcon width={24} height={24} /> : <MenuIcon width={24} height={24} />}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="absolute inset-x-0 top-16 z-40 h-dvh animate-fade bg-ink/30 backdrop-blur-[2px]"
          />
          <nav
            id="mobile-menu"
            aria-label="Main"
            className="absolute inset-x-0 top-16 z-50 animate-drop border-b border-line bg-paper shadow-lg"
          >
            <ul className="container-page py-3">
              {links.map((link, i) => (
                <li key={link.href} className="stagger" style={{ "--i": i } as React.CSSProperties}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-13 items-center justify-between border-b border-line/70 font-display text-xl font-semibold last:border-0"
                  >
                    {link.label}
                    <span aria-hidden className="text-muted">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
