import Link from "next/link";
import type { ComponentType } from "react";
import { GithubIcon, LinkedinIcon, MailIcon, XIcon } from "@/components/icons";
import { navLinks, siteConfig, socials, type SocialIcon } from "@/lib/data/site";
import { StatusDot } from "@/components/ui/status-dot";

const icons: Record<SocialIcon, ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  mail: MailIcon,
  x: XIcon,
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-border">
      {/* Follows the nav's ladder: the three-column desktop footer starts at lg,
          the same width the desktop nav does. Switching it at md left a
          hamburger header sitting above a desktop footer, with the columns
          clustered left and dead space on the right. */}
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 sm:gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link
            href="/"
            className="font-mono text-sm font-medium text-foreground"
          >
            shubham<span className="text-accent">.patel</span>
            <span className="text-faint">()</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted">{siteConfig.tagline}</p>
          <p className="mt-4 flex items-center gap-2 font-mono text-xs text-faint">
            <StatusDot />
            {siteConfig.location} · {siteConfig.timezoneLabel}
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-mono text-xs uppercase tracking-widest text-faint">
            Navigate
          </h2>
          <ul className="mt-4 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-faint">
            Connect
          </h2>
          <ul className="mt-4 space-y-2">
            {socials.map((social) => {
              const Icon = icons[social.icon];
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={social.icon === "mail" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
                  >
                    <Icon className="size-4 shrink-0" />
                    {social.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="font-mono">
            Built with Next.js · Tailwind · deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
