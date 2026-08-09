"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { MapPin, Users, CalendarClock, Target, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/fitacle/navbar"
import { MembersShowcase } from "@/components/fitacle/members-showcase"
import { Footer } from "@/components/fitacle/footer"
import { ProfileModal } from "@/components/fitacle/profile-modal"
import { ProfileCompletionPrompt } from "@/components/fitacle/profile-completion-prompt"
import { PARTNER_VARIANTS, type PartnerVariant } from "@/lib/partner-pages"

// Icons paired to highlight slots by index: goals, location, schedule, accountability.
const HIGHLIGHT_ICONS = [Target, MapPin, CalendarClock, Users] as const

// Sanitize a free-text location from the URL so we can safely reflect search
// intent like "?in=Doha" in the copy WITHOUT creating separate location pages.
// Canonical stays the clean path, so this never produces duplicate content.
function readLocation(raw: string | null): string {
  if (!raw) return ""
  const cleaned = raw
    .replace(/[^\p{L}\s,'-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40)
  if (!cleaned) return ""
  return cleaned
    .split(" ")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ")
}

export function FindPartnerLanding({ variant }: { variant: PartnerVariant }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [profileOpen, setProfileOpen] = useState(false)

  const location = useMemo(
    () => readLocation(searchParams.get("in") || searchParams.get("location") || searchParams.get("city")),
    [searchParams],
  )

  const heading = location ? `Find a ${variant.nounTitle} in ${location}` : variant.h1
  const intro = location
    ? `Looking for a ${variant.noun} in ${location}? ${variant.intro}`
    : variant.intro

  // Cross-links to the other partner pages for internal linking / discovery.
  const relatedLinks = PARTNER_VARIANTS.filter((v) => v.slug !== variant.slug)

  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar onSignIn={() => router.push("/")} />

      {/* Intro / hero */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-28 sm:pt-32 pb-6 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-emerald-600">
          <Users size={14} /> {variant.badge}
        </p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-foreground text-balance">
          {heading}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">{intro}</p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setProfileOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
          >
            Try It Out. Find Your {variant.ctaNoun}.
            <ArrowRight size={15} />
          </button>
          <a
            href="#partner-directory"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Browse partners near you
          </a>
        </div>
      </section>

      {/* Value highlights */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-8" aria-labelledby="how-heading">
        <h2 id="how-heading" className="sr-only">
          {`How Fitacle helps you find a ${variant.noun}`}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {variant.highlights.map((h, i) => {
            const Icon = HIGHLIGHT_ICONS[i] ?? Users
            return (
              <div key={h.title} className="rounded-2xl border border-border bg-card p-5 text-left">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <Icon size={20} />
                </span>
                <h3 className="mt-3 text-base font-semibold text-foreground">{h.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed text-pretty">{h.body}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Live partner directory (existing functionality, unchanged) */}
      <section id="partner-directory" aria-label="Partner directory">
        <MembersShowcase />
      </section>

      {/* About / supporting content */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-balance">{variant.about.heading}</h2>
        <div className="mt-4 space-y-4">
          {variant.about.paragraphs.map((p, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed text-pretty">
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl sm:text-3xl font-bold text-foreground text-balance">
          Frequently asked questions
        </h2>
        <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
          {variant.faqs.map((faq) => (
            <details key={faq.question} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-foreground">
                {faq.question}
                <ArrowRight
                  size={16}
                  className="flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-90"
                />
              </summary>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed text-pretty">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Internal links to related partner pages */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-16" aria-labelledby="related-heading">
        <h2 id="related-heading" className="text-xl font-bold text-foreground">
          Explore more ways to find a partner
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {relatedLinks.map((v) => (
            <Link
              key={v.slug}
              href={`/${v.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Find a {v.nounTitle}
            </Link>
          ))}
        </div>
      </section>

      <Footer />

      {/* Reuse the existing profile system for the CTA — no new profile flow. */}
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      {/* Prompt signed-in users with incomplete profiles to become discoverable. */}
      <ProfileCompletionPrompt />
    </main>
  )
}
