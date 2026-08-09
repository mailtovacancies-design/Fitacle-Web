"use client"

import { useRouter } from "next/navigation"
import { MapPin, Users, CalendarClock, Target } from "lucide-react"
import { Navbar } from "@/components/fitacle/navbar"
import { MembersShowcase } from "@/components/fitacle/members-showcase"
import { Footer } from "@/components/fitacle/footer"

const HIGHLIGHTS = [
  {
    icon: Target,
    title: "Matched by goals",
    body: "Connect with partners chasing the same outcome — strength, fat loss, endurance, or general health.",
  },
  {
    icon: MapPin,
    title: "Near your location",
    body: "Find a gym buddy in your city and at your usual gym so training together is actually convenient.",
  },
  {
    icon: CalendarClock,
    title: "On your schedule",
    body: "Filter by training times and schedule preference to meet someone who shows up when you do.",
  },
  {
    icon: Users,
    title: "Real accountability",
    body: "Turn one-off workouts into a consistent habit with a partner who keeps you showing up.",
  },
]

export function FindPartnerLanding() {
  const router = useRouter()

  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar onSignIn={() => router.push("/")} />

      {/* Intro / hero */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-28 sm:pt-32 pb-6 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-emerald-600">
          <Users size={14} /> Find Your Fitness Partner
        </p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-foreground text-balance">
          Find a Fitness Partner Near You
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
          Never train alone. Fitacle matches you with a workout partner, gym buddy, or accountability partner based on
          your goals, activity, schedule, and location — so every session has someone in your corner.
        </p>
      </section>

      {/* Value highlights */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-5 text-left">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Icon size={20} />
              </span>
              <h2 className="mt-3 text-base font-semibold text-foreground">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed text-pretty">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live partner directory (existing functionality, unchanged) */}
      <MembersShowcase />

      <Footer />
    </main>
  )
}
