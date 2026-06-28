"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Heart, Send, Loader2, Pin } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { CommunityAvatar } from "./community-avatar"
import { usePostComments, useCommunityActions } from "@/lib/community/use-community"
import { displayName, getCategoryMeta, timeAgo, type CommunityPost } from "@/lib/community/types"

interface PostDetailProps {
  post: CommunityPost | null
  user: User | null
  liked: boolean
  onClose: () => void
  onRequireAuth: () => void
  onToggleLike: () => void
  onCommentAdded: () => void
}

export function PostDetail({
  post,
  user,
  liked,
  onClose,
  onRequireAuth,
  onToggleLike,
  onCommentAdded,
}: PostDetailProps) {
  const { comments, isLoading, mutate } = usePostComments(post?.id ?? null)
  const { addComment } = useCommunityActions()
  const [draft, setDraft] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!post) return
    if (!user) {
      onRequireAuth()
      return
    }
    if (draft.trim().length < 2) return
    setSubmitting(true)
    setError(null)
    try {
      await addComment({ userId: user.id, postId: post.id, body: draft })
      setDraft("")
      await mutate()
      onCommentAdded()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post your comment.")
    } finally {
      setSubmitting(false)
    }
  }

  const category = post ? getCategoryMeta(post.category) : null
  const CategoryIcon = category?.icon

  return (
    <AnimatePresence>
      {post && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[95] flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={post.title}
        >
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl bg-card border border-border rounded-t-3xl sm:rounded-3xl shadow-xl overflow-hidden max-h-[92dvh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 p-5 border-b border-border shrink-0">
              <div className="flex items-start gap-3 min-w-0">
                <CommunityAvatar name={post.author_name} isOfficial={post.author_is_official} size="md" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="font-semibold text-foreground text-sm truncate">
                      {displayName(post.author_name)}
                    </span>
                    {post.author_is_official && (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 border border-emerald-500/20">
                        Official Fitacle
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{timeAgo(post.created_at)}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-muted-foreground hover:bg-accent transition-colors shrink-0"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-5">
                {category && CategoryIcon && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${category.badgeClass}`}
                  >
                    <CategoryIcon size={11} />
                    {category.label}
                  </span>
                )}
                <h2 className="mt-3 text-xl font-bold text-foreground text-balance leading-snug">{post.title}</h2>
                <p className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{post.body}</p>

                <div className="mt-4 flex items-center gap-4 border-y border-border py-3">
                  <button
                    type="button"
                    onClick={() => (user ? onToggleLike() : onRequireAuth())}
                    className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
                      liked ? "text-rose-600" : "text-muted-foreground hover:text-rose-600"
                    }`}
                    aria-pressed={liked}
                  >
                    <Heart size={17} className={liked ? "fill-rose-500 text-rose-500" : ""} />
                    {post.like_count} {post.like_count === 1 ? "like" : "likes"}
                  </button>
                  <span className="text-sm text-muted-foreground">
                    {post.comment_count} {post.comment_count === 1 ? "reply" : "replies"}
                  </span>
                </div>

                {/* Comments */}
                <div className="mt-4 space-y-3">
                  {isLoading ? (
                    <>
                      {[0, 1].map((i) => (
                        <div key={i} className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                            <div className="h-3 w-full rounded bg-muted animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </>
                  ) : comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      No replies yet. Be the first to respond.
                    </p>
                  ) : (
                    comments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`flex gap-3 rounded-2xl p-3 ${
                          comment.is_official_response
                            ? "border border-emerald-500/30 bg-emerald-500/[0.05]"
                            : ""
                        }`}
                      >
                        <CommunityAvatar
                          name={comment.author_name}
                          isOfficial={comment.is_official_response}
                          size="sm"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span className="font-semibold text-foreground text-sm">
                              {displayName(comment.author_name)}
                            </span>
                            {comment.is_official_response && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 border border-emerald-500/20">
                                <Pin size={9} />
                                Official Fitacle Response
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">{timeAgo(comment.created_at)}</span>
                          </div>
                          <p className="mt-1 text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                            {comment.body}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Composer */}
            <div className="border-t border-border p-4 shrink-0">
              {error && (
                <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 mb-2">
                  {error}
                </p>
              )}
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onFocus={() => {
                    if (!user) onRequireAuth()
                  }}
                  placeholder={user ? "Write a reply..." : "Sign in to reply"}
                  className="flex-1 px-4 py-2.5 rounded-full bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition text-sm"
                />
                <button
                  type="submit"
                  disabled={submitting || draft.trim().length < 2}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50 shrink-0"
                  aria-label="Send reply"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
