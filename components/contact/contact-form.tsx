"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { siteConfig } from "@/lib/data/site";

/**
 * Composes a `mailto:` link rather than posting anywhere.
 *
 * There is no mail backend configured for this site, and a form that appears to
 * send but silently drops the message is worse than no form. This hands the
 * draft to the visitor's own mail client, where they can see it actually sent.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const body = message + (name ? `\n\n— ${name}` : "");
  const href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    subject || "Hello",
  )}&body=${encodeURIComponent(body)}`;

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked by permissions — the address is visible
      // on the button itself, so there's nothing to recover from.
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name">
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Lovelace"
            className={inputClass}
          />
        </Field>
        <Field label="Subject" htmlFor="subject">
          <input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Backend role / question / idea"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Message" htmlFor="message">
          <textarea
            id="message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What are you building, and where do I fit?"
            className={`${inputClass} resize-y`}
          />
        </Field>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={href}
          className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Open in mail app
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>

        <button
          type="button"
          onClick={copyEmail}
          className="inline-flex max-w-full items-center gap-2 rounded-full border border-border px-4 py-2.5 font-mono text-xs text-muted transition-colors hover:border-border-strong hover:text-foreground"
        >
          {copied ? (
            <Check className="size-3.5 shrink-0 text-accent" />
          ) : (
            <Copy className="size-3.5 shrink-0" />
          )}
          <span className="truncate">
            {copied ? "copied" : siteConfig.email}
          </span>
        </button>
      </div>

      <p className="mt-4 font-mono text-xs text-faint">
        This opens your own mail client — nothing is sent through this site.
      </p>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-faint focus:border-accent/50";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block font-mono text-xs text-faint"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
