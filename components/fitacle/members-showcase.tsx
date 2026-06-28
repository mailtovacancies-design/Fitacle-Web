"use client"

import { useState } from "react"
import useSWR from "swr"
import { motion } from "framer-motion"
import {
  Users,
  Crown,
  Award,
  MapPin,
  Dumbbell,
  Instagram,
  Star,
  Loader2,
  ChevronDown,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Partner {
  id: string
  full_name: string
  instagram_id: string | null
  country: string | null
  city: string | null
  gym_name: string | null
  fitness_focus: string | null
  experience_level: string | null
  is_trainer: boolean
  is_premium: boolean
  is_featured: boolean
  avatar_initial: string | null
  created_at: string
}

const INITIAL_COUNT = 5
const PAGE_SIZE = 5

const fetcher = async (): Promise<Partner[]> => {
  const supabase = createClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from("fitness_partners")
    .select(
      "id, full_name, instagram_id, country, city, gym_name, fitness_focus, experience_level, is_trainer, is_premium, is_featured, avatar_initial, created_at",
    )
    .eq("is_visible", true)
    .order("created_at", { ascending: false })
  if (error) throw error
  return (data as Partner[]) ?? []
}

function getInitial(p: Partner) {
  return (p.avatar_initial || p.full_name?.charAt(0) || "F").toUpperCase()
}

// Pin specific people (by name, case-insensitive) to the top, preserving the given order.
function pinByName(list: Partner[], names: string[]) {
  const pinned: Partner[] = []
  for (const name of names) {
    const found = list.find((p) => p.full_name?.toLowerCase().trim() === name.toLowerCase().trim())
    if (found) pinned.push(found)
  }
  const rest = list.filter((p) => !pinned.some((pin) => pin.id === p.id))
  return [...pinned, ...rest]
}

function MemberCard({
  partner,
  accent,
  pinnedLabel,
}: {
  partner: Partner
  accent: "emerald" | "sky"
  pinnedLabel?: string
}) {
  const location = [partner.city, partner.country].filter(Boolean).join(", ")
  const ring =
    accent === "sky"
      ? "ring-sky-500/30 bg-sky-500/10 text-sky-600"
      : "ring-emerald-500/30 bg-emerald-500/10 text-emerald-600"

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
      className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-foreground/20 hover:shadow-md transition-all"
    >
      <div className={`flex-shrink-0 w-12 h-12 rounded-full grid place-items-center font-bold text-lg ring-2 ${ring}`}>
        {getInitial(partner)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-foreground truncate">{partner.full_name}</p>
          {pinnedLabel && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-foreground text-background">
              <Star size={10} /> {pinnedLabel}
            </span>
          )}
          {partner.is_premium && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600">
              <Crown size={10} /> Premium
            </span>
          )}
          {partner.is_trainer && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-sky-500/15 text-sky-600">
              <Award size={10} /> Trainer
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
          {location && (
            <span className="inline-flex items-center gap-1 min-w-0">
              <MapPin size={11} className="flex-shrink-0" />
              <span className="truncate">{location}</span>
            </span>
          )}
          {partner.fitness_focus && (
            <span className="inline-flex items-center gap-1">
              <Dumbbell size={11} />
              {partner.fitness_focus}
            </span>
          )}
          {partner.experience_level && (
            <span className="inline-flex items-center gap-1">
              <Star size={11} />
              {partner.experience_level}
            </span>
          )}
        </div>
      </div>

      {partner.instagram_id && (
        <a
          href={`https://instagram.com/${partner.instagram_id.replace(/^@/, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label={`${partner.full_name} on Instagram`}
        >
          <Instagram size={16} />
        </a>
      )}
    </motion.div>
  )
}

function MemberSection({
  title,
  description,
  icon,
  partners,
  accent,
  emptyText,
  pinnedIds,
  pinnedLabel,
}: {
  title: string
  description: string
  icon: React.ReactNode
  partners: Partner[]
  accent: "emerald" | "sky"
  emptyText: string
  pinnedIds: Set<string>
  pinnedLabel: string
}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
  const visible = partners.slice(0, visibleCount)
  const remaining = partners.length - visibleCount
  const isExpanded = visibleCount > INITIAL_COUNT

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0">{icon}</div>
        <div>
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {partners.length === 0 ? (
        <div className="p-6 text-center text-sm text-muted-foreground bg-accent/50 rounded-2xl border border-border">
          {emptyText}
        </div>
      ) : (
        <>
          <div className="grid gap-3">
            {visible.map((p) => (
              <MemberCard
                key={p.id}
                partner={p}
                accent={accent}
                pinnedLabel={pinnedIds.has(p.id) ? pinnedLabel : undefined}
              />
            ))}
          </div>

          {(remaining > 0 || isExpanded) && (
            <div className="mt-4 flex justify-center gap-3">
              {remaining > 0 && (
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:bg-accent transition-colors"
                >
                  Show More ({Math.min(PAGE_SIZE, remaining)})
                  <ChevronDown size={15} />
                </button>
              )}
              {isExpanded && (
                <button
                  onClick={() => setVisibleCount(INITIAL_COUNT)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
                >
                  Show Less
                  <ChevronDown size={15} className="rotate-180" />
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export function MembersShowcase() {
  const { data, isLoading, error } = useSWR("fitness_partners_showcase", fetcher, {
    revalidateOnFocus: false,
  })

  const partners = data ?? []

  // Members = everyone who is not a trainer. Trainers get their own section (no duplication).
  const memberPool = partners.filter((p) => !p.is_trainer && !p.is_featured)
  const members = pinByName(memberPool, ["Nithin Francis", "Razi Haroon"])

  const trainerPool = partners.filter((p) => p.is_trainer || p.is_featured)
  const trainers = pinByName(trainerPool, ["Jibin jayan"])

  const memberPinnedIds = new Set(
    members.filter((p) => ["nithin francis", "razi haroon"].includes(p.full_name?.toLowerCase().trim())).map((p) => p.id),
  )
  const trainerPinnedIds = new Set(
    trainers.filter((p) => p.full_name?.toLowerCase().trim() === "jibin jayan").map((p) => p.id),
  )

  return (
    <section id="members" className="relative py-20 px-4 sm:px-6 bg-background">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold mb-4">
            <Users size={14} />
            Accountability Network
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance mb-3">
            Never Train Alone Again.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-pretty">
            Fitness is not a solo journey. Consistency is built through people. Find accountability partners based on
            goals, schedule, energy level, training style, and location.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 size={28} className="animate-spin" />
            <p className="text-sm">Loading the community…</p>
          </div>
        ) : error ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            We couldn&apos;t load members right now. Please try again later.
          </div>
        ) : (
          <div className="space-y-12">
            <MemberSection
              title="Members"
              description="Recent members building consistency together"
              icon={
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 grid place-items-center">
                  <Users size={20} />
                </div>
              }
              partners={members}
              accent="emerald"
              emptyText="No members yet — be the first to join."
              pinnedIds={memberPinnedIds}
              pinnedLabel="Pinned"
            />

            <MemberSection
              title="Trainers"
              description="Verified coaches ready to guide your journey"
              icon={
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 grid place-items-center">
                  <Award size={20} />
                </div>
              }
              partners={trainers}
              accent="sky"
              emptyText="No trainers yet."
              pinnedIds={trainerPinnedIds}
              pinnedLabel="Featured"
            />
          </div>
        )}
      </div>
    </section>
  )
}
