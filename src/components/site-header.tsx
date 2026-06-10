"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/projects", label: "Projects" },
  { href: "/#skills", label: "Skills" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-dim/60 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(3,181,211,0.1)]">
      <div className="max-w-container mx-auto px-6 md:px-16 flex justify-between items-center h-20">
        <Link
          href="/"
          className="flex items-center"
        >
          <img 
            src="/assets/logo.svg" 
            alt="Abdullah Othman"
            className="h-10 md:h-12 w-auto object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href.split("#")[0]) &&
                  item.href !== "/#skills";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "text-base text-secondary border-b-2 border-secondary pb-1"
                    : "text-base text-on-surface-variant hover:text-secondary transition-colors"
                }
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold glow-button transition-transform active:scale-95"
          >
            Hire Me
          </Link>
        </nav>

        <button
          aria-label="Toggle menu"
          className="md:hidden text-on-surface flex items-center justify-center w-11 h-11 -mr-2"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="material-symbols-outlined">
            {open ? "close" : "menu"}
          </span>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-surface-dim/95 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-base text-on-surface-variant hover:text-secondary transition-colors py-2.5"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="bg-primary text-on-primary text-center px-6 py-3 rounded-lg font-bold mt-3"
            >
              Hire Me
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
