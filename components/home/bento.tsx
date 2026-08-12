import type { ComponentType } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { BentoCard } from "@/components/ui/bento-card";
import { Counter } from "@/components/ui/counter";
import { Globe } from "@/components/ui/globe";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/icons";
import { stackGroups } from "@/lib/data/stack";
import { stats } from "@/lib/data/stats";
import { socials, type SocialIcon } from "@/lib/data/site";

const socialIcons: Record<SocialIcon, ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  mail: Mail,
  x: XIcon,
};

function CardLabel({ children }: { children: string }) {
  return (
    <span className="font-mono text-xs uppercase tracking-widest text-faint">
      {"//"} {children}
    </span>
  );
}

export function Bento() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading index="02" title="Engineer's dashboard" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        {/* Stack */}
        <Reveal className="md:col-span-4">
          <BentoCard className="h-full">
            <CardLabel>stack</CardLabel>
            <div className="mt-5 space-y-3">
              {stackGroups.map((group) => (
                <div
                  key={group.label}
                  className="grid grid-cols-1 gap-2 border-t border-border pt-3 first:border-t-0 first:pt-0 sm:grid-cols-[8rem_1fr] sm:gap-3"
                >
                  <span className="pt-0.5 font-mono text-xs text-faint">
                    {group.label}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-md border border-border px-2 py-0.5 font-mono text-xs text-muted transition-colors hover:border-border-strong hover:text-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>
        </Reveal>

        {/* Globe — bottom-anchored half globe */}
        <Reveal className="md:col-span-2" delay={0.05}>
          <BentoCard className="relative flex h-full min-h-[22rem] flex-col overflow-hidden">
            <div className="relative z-10">
              <CardLabel>location</CardLabel>
              <p className="mt-4 font-display text-lg font-semibold">
                Based in India
              </p>
              <p className="font-mono text-xs text-faint">
                working across timezones · drag to spin
              </p>
            </div>

            {/* soft glow under the globe */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-10 left-1/2 h-40 w-[110%] -translate-x-1/2 rounded-[100%] opacity-70 blur-2xl"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%)",
              }}
            />
            {/* Sized/offset so the north pole clears the copy above and India
                stays well inside the bottom crop. */}
            <div className="absolute bottom-0 left-1/2 aspect-square w-[92%] -translate-x-1/2 translate-y-[26%]">
              <Globe />
            </div>
          </BentoCard>
        </Reveal>

        {/* Stats */}
        <Reveal className="md:col-span-2" delay={0.1}>
          <BentoCard className="h-full">
            <CardLabel>by the numbers</CardLabel>
            <div className="mt-5 grid grid-cols-2 gap-5">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-3xl font-semibold tracking-tight">
                    <Counter
                      value={stat.value}
                      decimals={stat.decimals}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </BentoCard>
        </Reveal>

        {/* Now */}
        <Reveal className="md:col-span-2" delay={0.15}>
          <BentoCard className="flex h-full flex-col">
            <CardLabel>currently</CardLabel>
            <div className="mt-5 flex-1">
              <p className="flex items-center gap-2 font-mono text-xs text-accent">
                <span className="size-1.5 animate-pulse-glow rounded-full bg-accent" />
                M.Tech CSE · in progress
              </p>
              <p className="mt-2 font-display text-xl font-semibold">
                NIT Warangal
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Deepening system design, distributed systems and developer
                tooling — while building infra & backend side projects.
              </p>
            </div>
            <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 font-mono text-xs text-accent">
              open to opportunities
            </span>
          </BentoCard>
        </Reveal>

        {/* Connect */}
        <Reveal className="md:col-span-2" delay={0.2}>
          <BentoCard className="flex h-full flex-col">
            <CardLabel>connect</CardLabel>
            <div className="mt-5 flex flex-1 flex-col justify-center gap-1">
              {socials.map((social) => {
                const Icon = socialIcons[social.icon];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.icon === "mail" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-2"
                  >
                    <Icon className="size-4 text-muted transition-colors group-hover:text-accent" />
                    <span className="text-sm text-foreground">{social.label}</span>
                    <span className="ml-auto hidden font-mono text-xs text-faint sm:inline">
                      {social.handle}
                    </span>
                    <ArrowUpRight className="size-3.5 text-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                );
              })}
            </div>
          </BentoCard>
        </Reveal>
      </div>
    </section>
  );
}
