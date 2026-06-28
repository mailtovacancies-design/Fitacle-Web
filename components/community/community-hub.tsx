"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Users } from "lucide-react"
import {
  CATEGORIES,
  type CommunityCategory,
  type CommunityPost,
} from "@/lib/community/types"
import {
  useCommunityPosts,
  useCommunityActions,
  useCurrentUser,
} from "@/lib/community/use-community"
import { PostCard, PostCardSkeleton } from "./post-card"
import { PostComposer } from "./post-composer"
import { PostDetail } from "./post-detail"
import { CommunityAuthDialog } from "./community-auth-dialog"

type Filter = CommunityCategory | "all"

export function CommunityHub() {
  const { user } = useCurrentUser()
  const [filter, setFilter] = useState<Filter>("all")
  const { visiblePosts, likedPostIds, isLoading, hasMore, showMore, mutate } = useCommunityPosts(
    filter,
    user?.id ?? null,
  )
  const { createPost, toggleLike } = useCommunityActions()

  const [composerOpen, setComposerOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [activePost, setActivePost] = useState<CommunityPost | null>(null)
  // Action to run after a successful sign-in (e.g. open the composer).
  const [pendingAction, setPendingAction] = useState<"compose" | null>(null)

  const requireAuth = (next: "compose" | null = null) => {
    setPendingAction(next)
    setAuthOpen(true)
  }

  const handleSignedIn = () => {
    if (pendingAction === "compose") setComposerOpen(true)
    setPendingAction(null)
    void mutate()
  }

  const handleCompose = () => {
    if (!user) {
      requireAuth("compose")
      return
    }
    setComposerOpen(true)
  }

  const handleCreatePost = async (input: { category: CommunityCategory; title: string; body: string }) => {
    if (!user) {
      requireAuth("compose")
      return
    }
    await createPost({ userId: user.id, ...input })
    await mutate()
  }

  const handleToggleLike = async (post: CommunityPost) => {
    if (!user) {
      requireAuth()
      return
    }
    const liked = likedPostIds.has(post.id)

    // Optimistic update.
    await mutate(
      (current) => {
        if (!current) return current
        const nextLiked = new Set(current.likedPostIds)
        if (liked) nextLiked.delete(post.id)
        else nextLiked.add(post.id)
        return {
          posts: current.posts.map((p) =>
            p.id === post.id ? { ...p, like_count: Math.max(0, p.like_count + (liked ? -1 : 1)) } : p,
          ),
          likedPostIds: nextLiked,
        }
      },
      { revalidate: false },
    )

    try {
      await toggleLike({ userId: user.id, postId: post.id, liked })
    } finally {
      void mutate()
    }
    // Keep the open detail view in sync.
    setActivePost((prev) =>
      prev && prev.id === post.id
        ? { ...prev, like_count: Math.max(0, prev.like_count + (liked ? -1 : 1)) }
        : prev,
    )
  }

  const activeLiked = activePost ? likedPostIds.has(activePost.id) : false

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6">
      {/* Category filter */}
      <div className="sticky top-[72px] z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="All" icon={Users} />
          {CATEGORIES.map((cat) => (
            <FilterChip
              key={cat.value}
              active={filter === cat.value}
              onClick={() => setFilter(cat.value)}
              label={cat.short}
              icon={cat.icon}
            />
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="mt-5 space-y-3 pb-28 sm:pb-12">
        {isLoading ? (
          <>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </>
        ) : visiblePosts.length === 0 ? (
          <EmptyState onCompose={handleCompose} />
        ) : (
          <>
            {visiblePosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                liked={likedPostIds.has(post.id)}
                onOpen={() => setActivePost(post)}
                onToggleLike={() => handleToggleLike(post)}
              />
            ))}

            {hasMore && (
              <div className="pt-2 flex justify-center">
                <button
                  onClick={showMore}
                  className="px-5 py-2.5 rounded-full border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors"
                >
                  Show more
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating compose button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCompose}
        className="fixed bottom-20 sm:bottom-8 right-5 sm:right-8 z-40 inline-flex items-center gap-2 rounded-full bg-foreground text-background pl-4 pr-5 py-3.5 font-semibold shadow-lg hover:bg-foreground/90 transition-colors"
        aria-label="Create a post"
      >
        <Plus size={18} />
        <span className="hidden sm:inline">New Post</span>
        <span className="sm:hidden">Post</span>
      </motion.button>

      {/* Dialogs */}
      <PostComposer
        open={composerOpen}
        defaultCategory={filter === "all" ? "questions" : filter}
        onClose={() => setComposerOpen(false)}
        onSubmit={handleCreatePost}
      />

      <PostDetail
        post={activePost}
        user={user}
        liked={activeLiked}
        onClose={() => setActivePost(null)}
        onRequireAuth={() => requireAuth()}
        onToggleLike={() => activePost && handleToggleLike(activePost)}
        onCommentAdded={() => void mutate()}
      />

      <CommunityAuthDialog open={authOpen} onClose={() => setAuthOpen(false)} onSignedIn={handleSignedIn} />
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  label,
  icon: Icon,
}: {
  active: boolean
  onClick: () => void
  label: string
  icon: React.ComponentType<{ size?: number }>
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors ${
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-card text-muted-foreground border-border hover:border-foreground/30"
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  )
}

function EmptyState({ onCompose }: { onCompose: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 py-14 px-6 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
        <Users className="text-emerald-600" size={22} />
      </div>
      <h3 className="font-semibold text-foreground">No posts here yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">Start the conversation and the community will join in.</p>
      <button
        onClick={onCompose}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition-colors"
      >
        <Plus size={16} />
        Create the first post
      </button>
    </div>
  )
}
