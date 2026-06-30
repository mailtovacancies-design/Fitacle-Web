"use client"

import { useState, useMemo } from "react"
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
  SlidersHorizontal,
  X,
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
  schedule_preference: string | null
  usual_gym_time: string | null
  goal: string | null
  is_trainer: boolean
  is_premium: boolean
  is_featured: boolean
  avatar_initial: string | null
  created_at: string
}

const INITIAL_COUNT = 5
const PAGE_SIZE = 5

// Option lists mirror the profile form so filters match real profile data.
const activityOptions = [
  "Gym Workout",
  "Running",
  "Cycling",
  "Swimming",
  "Yoga",
  "CrossFit",
  "Boxing",
  "Martial Arts",
  "Calisthenics",
  "Hiking",
  "Home Workout",
  "Other",
]
const goalOptions = ["Weight Loss", "Muscle Gain", "Strength", "Endurance", "General Fitness", "Stay Active"]
const experienceLevels = ["Beginner", "Intermediate", "Advanced"]
const workoutTimeOptions = ["Morning", "Afternoon", "Evening", "Flexible"]
const locationOptions = ["Gym", "Home", "Park", "Track", "Pool"]

const ALL = "All"

interface Filters {
  activity: string
  goal: string
  experience: string
  workoutTime: string
  location: string
  gymName: string
  country: string
  city: string
  trainersOnly: boolean
}

const DEFAULT_FILTERS: Filters = {
  activity: ALL,
  goal: ALL,
  experience: ALL,
  workoutTime: ALL,
  location: ALL,
  gymName: "",
  country: ALL,
  city: ALL,
  trainersOnly: false,
}

const fetcher = async (): Promise<Partner[]> => {
  const supabase = createClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from("fitness_partners")
    .select(
      "id, full_name, instagram_id, country, city, gym_name, fitness_focus, experience_level, schedule_preference, usual_gym_time, goal, is_trainer, is_premium, is_featured, avatar_initial, created_at",
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
          {partner.goal && (
            <span className="inline-flex items-center gap-1">
              <Star size={11} />
              {partner.goal}
            </span>
          )}
        </div>
      </div>

      {partner.instagram_id && (
        <a
          href={`https://instagram.com/${partner.instagram_id.replace(/^@/, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 grid place-items-center w-9 h-9 rounded-xl text-white bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)] shadow-sm hover:opacity-90 transition-opacity"
          aria-label={`${partner.full_name} on Instagram`}
        >
          <Instagram size={18} />
        </a>
      )}
    </motion.div>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-muted-foreground mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
      >
        <option value={ALL}>All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
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

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [showFilters, setShowFilters] = useState(false)

  const partners = useMemo(() => data ?? [], [data])

  // Country/City options derived from existing profile data only.
  const countryOptions = useMemo(
    () =>
      Array.from(new Set(partners.map((p) => p.country?.trim()).filter((c): c is string => !!c))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [partners],
  )
  const cityOptions = useMemo(
    () =>
      Array.from(new Set(partners.map((p) => p.city?.trim()).filter((c): c is string => !!c))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [partners],
  )

  const isFilterActive =
    filters.activity !== ALL ||
    filters.goal !== ALL ||
    filters.experience !== ALL ||
    filters.workoutTime !== ALL ||
    filters.location !== ALL ||
    filters.gymName.trim() !== "" ||
    filters.country !== ALL ||
    filters.city !== ALL ||
    filters.trainersOnly

  const matchesFilters = (p: Partner) => {
    if (filters.activity !== ALL && p.fitness_focus !== filters.activity) return false
    if (filters.goal !== ALL && p.goal !== filters.goal) return false
    if (filters.experience !== ALL && p.experience_level !== filters.experience) return false
    if (filters.workoutTime !== ALL && p.schedule_preference !== filters.workoutTime) return false
    if (filters.location !== ALL && p.usual_gym_time !== filters.location) return false
    if (
      filters.location === "Gym" &&
      filters.gymName.trim() &&
      !(p.gym_name ?? "").toLowerCase().includes(filters.gymName.trim().toLowerCase())
    )
      return false
    if (filters.country !== ALL && p.country !== filters.country) return false
    if (filters.city !== ALL && p.city !== filters.city) return false
    if (filters.trainersOnly && !(p.is_trainer || p.is_featured)) return false
    return true
  }

  const filtered = partners.filter(matchesFilters)
  const totalShown = filtered.length

  // Members = non-trainers. Trainers get their own section (no duplication).
  // Pins only apply when no filters are active so filtered results stay accurate.
  const memberPool = filtered.filter((p) => !p.is_trainer && !p.is_featured)
  const members = isFilterActive ? memberPool : pinByName(memberPool, ["Nithin Francis", "Razi Haroon"])

  const trainerPool = filtered.filter((p) => p.is_trainer || p.is_featured)
  const trainers = isFilterActive ? trainerPool : pinByName(trainerPool, ["Jibin jayan"])

  const memberPinnedIds = isFilterActive
    ? new Set<string>()
    : new Set(
        members
          .filter((p) => ["nithin francis", "razi haroon"].includes(p.full_name?.toLowerCase().trim()))
          .map((p) => p.id),
      )
  const trainerPinnedIds = isFilterActive
    ? new Set<string>()
    : new Set(trainers.filter((p) => p.full_name?.toLowerCase().trim() === "jibin jayan").map((p) => p.id))

  const isGymLocation = filters.location === "Gym"
  // Changing filters resets each section's pagination via React keys.
  const filterKey = JSON.stringify(filters)

  return (
    <section id="members" className="relative py-20 px-4 sm:px-6 bg-background">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold mb-4">
            <Users size={14} />
            Accountability Network
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance mb-1">Never Train Alone Again.</h2>
          <p className="text-lg sm:text-xl font-semibold text-emerald-600 mb-3">Find a Training Partner</p>
          <p className="text-muted-foreground max-w-xl mx-auto text-pretty">
            Fitness is not a solo journey. Consistency is built through people. Find accountability partners using real
            profile data like goals, activity, schedule, and location.
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
          <>
            {/* Filters */}
            <div className="mb-10 bg-card border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowFilters((s) => !s)}
                className="w-full flex items-center justify-between gap-3 p-4"
                aria-expanded={showFilters}
              >
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                  <SlidersHorizontal size={16} />
                  Filters
                  {isFilterActive && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600">
                      Active
                    </span>
                  )}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-muted-foreground transition-transform ${showFilters ? "rotate-180" : ""}`}
                />
              </button>

              {showFilters && (
                <div className="px-4 pb-4 border-t border-border pt-4 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <FilterSelect
                      label="Activity"
                      value={filters.activity}
                      options={activityOptions}
                      onChange={(v) => setFilters({ ...filters, activity: v })}
                    />
                    <FilterSelect
                      label="Goal"
                      value={filters.goal}
                      options={goalOptions}
                      onChange={(v) => setFilters({ ...filters, goal: v })}
                    />
                    <FilterSelect
                      label="Experience"
                      value={filters.experience}
                      options={experienceLevels}
                      onChange={(v) => setFilters({ ...filters, experience: v })}
                    />
                    <FilterSelect
                      label="Workout Time"
                      value={filters.workoutTime}
                      options={workoutTimeOptions}
                      onChange={(v) => setFilters({ ...filters, workoutTime: v })}
                    />
                    <FilterSelect
                      label="Preferred Location"
                      value={filters.location}
                      options={locationOptions}
                      onChange={(v) => setFilters({ ...filters, location: v, gymName: v === "Gym" ? filters.gymName : "" })}
                    />
                    {isGymLocation && (
                      <div>
                        <label className="block text-[11px] font-medium text-muted-foreground mb-1">Gym Name</label>
                        <input
                          type="text"
                          value={filters.gymName}
                          onChange={(e) => setFilters({ ...filters, gymName: e.target.value })}
                          placeholder="Search gym"
                          className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                        />
                      </div>
                    )}
                    {countryOptions.length > 0 && (
                      <FilterSelect
                        label="Country"
                        value={filters.country}
                        options={countryOptions}
                        onChange={(v) => setFilters({ ...filters, country: v })}
                      />
                    )}
                    {cityOptions.length > 0 && (
                      <FilterSelect
                        label="City"
                        value={filters.city}
                        options={cityOptions}
                        onChange={(v) => setFilters({ ...filters, city: v })}
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <label className="inline-flex items-center gap-2 text-sm text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.trainersOnly}
                        onChange={(e) => setFilters({ ...filters, trainersOnly: e.target.checked })}
                        className="w-4 h-4 rounded border-border accent-emerald-500"
                      />
                      Certified Trainers Only
                    </label>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{totalShown} match{totalShown === 1 ? "" : "es"}</span>
                      {isFilterActive && (
                        <button
                          onClick={() => setFilters(DEFAULT_FILTERS)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-emerald-600 transition-colors"
                        >
                          <X size={13} />
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-12">
              {!filters.trainersOnly && (
                <MemberSection
                  key={`members-${filterKey}`}
                  title="Members"
                  description="Recent members building consistency together"
                  icon={
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 grid place-items-center">
                      <Users size={20} />
                    </div>
                  }
                  partners={members}
                  accent="emerald"
                  emptyText={isFilterActive ? "No members match these filters." : "No members yet — be the first to join."}
                  pinnedIds={memberPinnedIds}
                  pinnedLabel="Pinned"
                />
              )}

              <MemberSection
                key={`trainers-${filterKey}`}
                title="Trainers"
                description="Verified coaches ready to guide your journey"
                icon={
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 grid place-items-center">
                    <Award size={20} />
                  </div>
                }
                partners={trainers}
                accent="sky"
                emptyText={isFilterActive ? "No trainers match these filters." : "No trainers yet."}
                pinnedIds={trainerPinnedIds}
                pinnedLabel="Featured"
              />
            </div>
          </>
        )}
      </div>
    </section>
  )
}
