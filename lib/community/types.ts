import { Dumbbell, HelpCircle, MessageSquare, Sparkles, Trophy, type LucideIcon } from "lucide-react"

export type CommunityCategory =
  | "questions"
  | "experiences"
  | "feedback"
  | "feature_requests"
  | "success_stories"

export interface CommunityPost {
  id: string
  user_id: string
  category: CommunityCategory
  title: string
  body: string
  is_pinned: boolean
  comment_count: number
  like_count: number
  author_name: string | null
  author_is_official: boolean
  created_at: string
  updated_at: string
}

export interface CommunityComment {
  id: string
  post_id: string
  user_id: string
  body: string
  is_official_response: boolean
  author_name: string | null
  created_at: string
}

export interface CategoryMeta {
  value: CommunityCategory
  label: string
  short: string
  description: string
  icon: LucideIcon
  /** Tailwind classes for the category's accent treatment */
  badgeClass: string
  iconClass: string
}

export const CATEGORIES: CategoryMeta[] = [
  {
    value: "questions",
    label: "Questions",
    short: "Questions",
    description: "Ask anything about training, nutrition, or the app.",
    icon: HelpCircle,
    badgeClass: "bg-sky-500/10 text-sky-600 border-sky-500/20",
    iconClass: "text-sky-600",
  },
  {
    value: "experiences",
    label: "Experiences",
    short: "Experiences",
    description: "Share how your journey is going, good days and hard ones.",
    icon: Dumbbell,
    badgeClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    iconClass: "text-emerald-600",
  },
  {
    value: "feedback",
    label: "Feedback",
    short: "Feedback",
    description: "Tell us what works and what could be better.",
    icon: MessageSquare,
    badgeClass: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    iconClass: "text-amber-600",
  },
  {
    value: "feature_requests",
    label: "Feature Requests",
    short: "Requests",
    description: "Suggest features you would love to see in Fitacle.",
    icon: Sparkles,
    badgeClass: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    iconClass: "text-violet-600",
  },
  {
    value: "success_stories",
    label: "Success Stories",
    short: "Wins",
    description: "Celebrate milestones and transformations with the community.",
    icon: Trophy,
    badgeClass: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    iconClass: "text-rose-600",
  },
]

export function getCategoryMeta(value: CommunityCategory): CategoryMeta {
  return CATEGORIES.find((c) => c.value === value) ?? CATEGORIES[0]
}

export function displayName(name: string | null | undefined): string {
  const trimmed = (name ?? "").trim()
  return trimmed.length > 0 ? trimmed : "Member"
}

export function initialsFromName(name: string | null | undefined): string {
  const trimmed = displayName(name)
  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "M"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Deterministic avatar color from a name, using the themed accent palette. */
export function avatarColorFromName(name: string | null | undefined): string {
  const palette = [
    "bg-emerald-500/15 text-emerald-700",
    "bg-sky-500/15 text-sky-700",
    "bg-amber-500/15 text-amber-700",
    "bg-rose-500/15 text-rose-700",
    "bg-violet-500/15 text-violet-700",
    "bg-teal-500/15 text-teal-700",
  ]
  const key = displayName(name)
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }
  return palette[hash % palette.length]
}

export function timeAgo(iso: string): string {
  const date = new Date(iso)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks}w ago`
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}
