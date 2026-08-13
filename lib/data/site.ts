const name = "Shubham Patel";

// One plain string — no lead/accent split. The hero's shimmer sits on the role
// now, not on half of this sentence, so nothing needs to wrap part of it.
const tagline = "I turn code into reliable systems.";

export const siteConfig = {
  name,
  initials: "SP",
  role: "Software Engineer",
  // Range shown as supporting proof, not the headline identity.
  disciplines: ["Backend", "Distributed Systems", "Cloud", "DevOps / SRE"],
  // Footer and the About header use this bare. Both deliberately omit the name:
  // they already sit under the `shubham.patel()` wordmark or on his own page.
  tagline,
  // Hero subhead and the global meta/OpenGraph description. Opens with the
  // tagline rather than restating it, so the promise the headline no longer
  // carries lands immediately under it. Kept near ~160 chars so search results
  // don't truncate it, and the M.Tech clause earns its place there.
  description: `${tagline} Backend, distributed systems, and the cloud infrastructure underneath them. I design for how things fail. M.Tech CSE @ NIT Warangal.`,
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
