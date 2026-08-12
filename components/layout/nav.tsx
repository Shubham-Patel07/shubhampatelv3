"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { navLinks } from "@/lib/data/site";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Magnetic } from "@/components/ui/magnetic";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight text-foreground"
        >
          shubham<span className="text-accent">.patel</span>
          <span className="text-faint">()</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {active && (
                    <span className="absolute inset-0 -z-10 rounded-full bg-surface-2" />
                  )}
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Magnetic className="hidden lg:inline-flex">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground transition-transform"
            >
              Contact
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Magnetic>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl lg:hidden",
          open ? "max-h-96" : "max-h-0 border-t-transparent",
        )}
        style={{ transition: "max-height 300ms ease" }}
      >
        <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm",
                  isActive(pathname, link.href)
                    ? "bg-surface-2 text-foreground"
                    : "text-muted",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/contact"
              className="mt-1 block rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground"
            >
              Contact →
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
