import type { Metadata } from "next";
import type { ComponentType } from "react";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/contact/contact-form";
import { GithubIcon, LinkedinIcon, MailIcon, XIcon } from "@/components/icons";
import { socials, siteConfig, type SocialIcon } from "@/lib/data/site";
import { Surface } from "@/components/ui/surface";
import { CardLabel } from "@/components/ui/card-label";
import { StatusDot } from "@/components/ui/status-dot";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Open to opportunities and interesting problems in backend, systems, and cloud engineering.",
};

const socialIcons: Record<SocialIcon, ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  mail: MailIcon,
  x: XIcon,
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        kicker="// contact"
        title="Let's build something"
        description="Open to opportunities and interesting problems in backend, systems, and cloud engineering. I read everything that comes in."
      />

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-6">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.08} className="space-y-4">
            <Surface>
              <CardLabel>elsewhere</CardLabel>
              <div className="mt-5 flex flex-col gap-1">
                {socials.map((social) => {
                  const Icon = socialIcons[social.icon];
                  const external = social.icon !== "mail";
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-2"
                    >
                      {/* See bento.tsx — shrink-0 keeps a long handle from
                          squashing the icon. */}
                      <Icon className="size-4 shrink-0 text-muted transition-colors group-hover:text-accent" />
                      <span className="shrink-0 text-sm text-foreground">
                        {social.label}
                      </span>
                      <span className="ml-auto hidden min-w-0 truncate font-mono text-xs text-faint sm:inline">
                        {social.handle}
                      </span>
                      <ArrowUpRight className="size-3.5 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  );
                })}
              </div>
            </Surface>

            <Surface>
              <CardLabel>good to know</CardLabel>
              <dl className="mt-5 space-y-4">
                <Row label="Timezone">
                  {siteConfig.location} · {siteConfig.timezoneLabel}
                </Row>
                <Row label="Best for">
                  Backend, distributed systems, cloud and SRE roles — plus any
                  problem in that space you want a second opinion on.
                </Row>
                <Row label="Status">
                  <span className="inline-flex items-center gap-2">
                    <StatusDot />
                    Open to opportunities
                  </span>
                </Row>
              </dl>
            </Surface>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="font-mono text-xs text-faint">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-foreground">{children}</dd>
    </div>
  );
}
