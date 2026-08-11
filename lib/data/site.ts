export const siteConfig = {
  name: "Shubham Patel",
  initials: "SP",
  role: "Software Engineer",
  // Range shown as supporting proof, not the headline identity.
  disciplines: ["Backend", "Distributed Systems", "Cloud", "DevOps / SRE"],
  tagline: "Software engineer who builds it — and runs it in production.",
  description:
    "Software engineer building resilient backends and distributed systems — and the cloud infrastructure that keeps them running. M.Tech CSE @ NIT Warangal.",
  location: "India",
  timezoneLabel: "IST · UTC+5:30",
  timezone: "Asia/Kolkata",
  email: "shubham.patel.workx@gmail.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://shubhampatel.dev",
  githubUsername: "Shubham-Patel07",
} as const;

export type NavLink = { href: string; label: string };

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/writing", label: "Writing" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/contributions", label: "Contributions" },
  { href: "/about", label: "About" },
];

export type SocialIcon = "github" | "linkedin" | "mail" | "x";

export type Social = {
  label: string;
  href: string;
  handle: string;
  icon: SocialIcon;
};

export const socials: Social[] = [
  {
    label: "GitHub",
    href: "https://github.com/Shubham-Patel07",
    handle: "Shubham-Patel07",
    icon: "github",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/shubham2107patel",
    handle: "in/shubham2107patel",
    icon: "linkedin",
  },
  {
    label: "Email",
    href: `mailto:${siteConfig.email}`,
    handle: siteConfig.email,
    icon: "mail",
  },
];
