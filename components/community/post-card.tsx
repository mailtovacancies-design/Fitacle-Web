"use client"

import { motion } from "framer-motion"
import { Heart, MessageCircle, Pin } from "lucide-react"
import { CommunityAvatar } from "./community-avatar"
import { displayName, getCategoryMeta, timeAgo, type CommunityPost } from "@/lib/community/types"

interface PostCardProps {
  post: CommunityPost
  liked: boolean
  onOpen: () => void
  onToggleLike: () => void
}

export function PostCard({ post, liked, onOpen, onToggleLike }: PostCardProps) {
  const category = getCategoryMeta(post.category)
  const CategoryIcon = category.icon
  const official = post.author_is_official

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onOpen}
      className={`group cursor-pointer rounded-2xl border p-4 sm:p-5 transition-colors ${
        official
          ? "border-emerald-500/30 bg-emerald-500/[0.04]"
          : "border-border bg-card hover:border-foreground/20"
      }`}
    >
      <div className="flex items-start gap-3">
        <CommunityAvatar name={post.author_name} isOfficial={official} size="md" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold text-foreground text-sm truncate">
              {displayName(post.author_name)}
            </span>
            {official && (
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 border border-emerald-500/20">
                Official Fitacle
              </span>
            )}
            <span className="text-xs text-muted-foreground">{timeAgo(post.created_at)}</span>
            {post.is_pinned && !official && (
              <Pin size={12} className="text-amber-500" aria-label="Pinned" />
            )}
          </div>

          <div className="mt-1 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${category.badgeClass}`}
            >
              <CategoryIcon size={11} />
              {category.label}
            </span>
          </div>

          <h3 className="mt-2 font-semibold text-foreground text-balance leading-snug">{post.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{post.body}</p>

          <div className="mt-3 flex items-center gap-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onToggleLike()
              }}
              className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
                liked ? "text-rose-600" : "text-muted-foreground hover:text-rose-600"
              }`}
              aria-pressed={liked}
              aria-label={liked ? "Unlike" : "Like"}
            >
              <Heart size={15} className={liked ? "fill-rose-500 text-rose-500" : ""} />
              {post.like_count}
            </button>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <MessageCircle size={15} />
              {post.comment_count}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export function PostCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 rounded bg-muted animate-pulse" />
          <div className="h-3 w-20 rounded bg-muted animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-muted animate-pulse mt-3" />
          <div className="h-3 w-full rounded bg-muted animate-pulse" />
          <div className="h-3 w-5/6 rounded bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  )
}
