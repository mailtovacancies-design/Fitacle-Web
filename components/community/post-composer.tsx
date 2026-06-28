"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2 } from "lucide-react"
import { CATEGORIES, type CommunityCategory } from "@/lib/community/types"

interface PostComposerProps {
  open: boolean
  defaultCategory?: CommunityCategory
  onClose: () => void
  onSubmit: (input: { category: CommunityCategory; title: string; body: string }) => Promise<void>
}

const TITLE_MAX = 120
const BODY_MAX = 2000

export function PostComposer({ open, defaultCategory = "questions", onClose, onSubmit }: PostComposerProps) {
  const [category, setCategory] = useState<CommunityCategory>(defaultCategory)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    if (submitting) return
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (title.trim().length < 4) {
      setError("Please add a title of at least 4 characters.")
      return
    }
    if (body.trim().length < 10) {
      setError("Please add a bit more detail (at least 10 characters).")
      return
    }
    setSubmitting(true)
    try {
      await onSubmit({ category, title, body })
      setTitle("")
      setBody("")
      setCategory(defaultCategory)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish your post. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Create a post"
        >
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={handleClose} />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg bg-card border border-border rounded-t-3xl sm:rounded-3xl shadow-xl overflow-hidden max-h-[92dvh] flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <h2 className="text-lg font-bold text-foreground">Share with the community</h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-full text-muted-foreground hover:bg-accent transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const active = category === cat.value
                    const Icon = cat.icon
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          active
                            ? "bg-foreground text-background border-foreground"
                            : "bg-card text-muted-foreground border-border hover:border-foreground/30"
                        }`}
                      >
                        <Icon size={13} />
                        {cat.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="post-title" className="block text-sm font-medium text-foreground mb-2">
                  Title
                </label>
                <input
                  id="post-title"
                  type="text"
                  value={title}
                  maxLength={TITLE_MAX}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition"
                />
                <p className="text-[11px] text-muted-foreground mt-1 text-right">
                  {title.length}/{TITLE_MAX}
                </p>
              </div>

              <div>
                <label htmlFor="post-body" className="block text-sm font-medium text-foreground mb-2">
                  Details
                </label>
                <textarea
                  id="post-body"
                  value={body}
                  maxLength={BODY_MAX}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  placeholder="Share the full story, your question, or your idea..."
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition resize-none leading-relaxed"
                />
                <p className="text-[11px] text-muted-foreground mt-1 text-right">
                  {body.length}/{BODY_MAX}
                </p>
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
            </form>

            <div className="p-5 border-t border-border shrink-0 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-60"
              >
                {submitting && <Loader2 size={15} className="animate-spin" />}
                Publish
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
