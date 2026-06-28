"use client"

import useSWR from "swr"
import { useCallback, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import type { CommunityCategory, CommunityComment, CommunityPost } from "./types"

const PAGE_SIZE = 5

/** Tracks the current Supabase auth user on the client. */
export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) {
      setLoading(false)
      return
    }
    let active = true
    supabase.auth.getUser().then(({ data }) => {
      if (active) {
        setUser(data.user ?? null)
        setLoading(false)
      }
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
}

interface PostsResult {
  posts: CommunityPost[]
  likedPostIds: Set<string>
}

async function fetchPosts(category: CommunityCategory | "all", userId: string | null): Promise<PostsResult> {
  const supabase = createClient()
  if (!supabase) return { posts: [], likedPostIds: new Set() }

  let query = supabase
    .from("community_posts")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })

  if (category !== "all") {
    query = query.eq("category", category)
  }

  const { data, error } = await query
  if (error) throw error
  const posts = (data ?? []) as CommunityPost[]

  let likedPostIds = new Set<string>()
  if (userId && posts.length > 0) {
    const { data: likes } = await supabase
      .from("community_likes")
      .select("post_id")
      .eq("user_id", userId)
      .in(
        "post_id",
        posts.map((p) => p.id),
      )
    likedPostIds = new Set((likes ?? []).map((l: { post_id: string }) => l.post_id))
  }

  return { posts, likedPostIds }
}

export function useCommunityPosts(category: CommunityCategory | "all", userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<PostsResult>(
    ["community-posts", category, userId],
    () => fetchPosts(category, userId),
    { revalidateOnFocus: false },
  )

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // Reset pagination whenever the filter changes.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [category])

  const posts = data?.posts ?? []
  const visiblePosts = posts.slice(0, visibleCount)
  const hasMore = posts.length > visibleCount

  return {
    posts,
    visiblePosts,
    likedPostIds: data?.likedPostIds ?? new Set<string>(),
    isLoading,
    error,
    hasMore,
    showMore: () => setVisibleCount((c) => c + PAGE_SIZE),
    mutate,
  }
}

async function fetchComments(postId: string): Promise<CommunityComment[]> {
  const supabase = createClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from("community_comments")
    .select("*")
    .eq("post_id", postId)
    .order("is_official_response", { ascending: false })
    .order("created_at", { ascending: true })
  if (error) throw error
  return (data ?? []) as CommunityComment[]
}

export function usePostComments(postId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<CommunityComment[]>(
    postId ? ["community-comments", postId] : null,
    () => fetchComments(postId as string),
    { revalidateOnFocus: false },
  )
  return { comments: data ?? [], isLoading, error, mutate }
}

/** Mutation helpers that operate with the browser client (RLS scoped to auth.uid()). */
export function useCommunityActions() {
  const createPost = useCallback(
    async (input: { userId: string; category: CommunityCategory; title: string; body: string }) => {
      const supabase = createClient()
      if (!supabase) throw new Error("Supabase is not configured.")
      const { error } = await supabase.from("community_posts").insert({
        user_id: input.userId,
        category: input.category,
        title: input.title.trim(),
        body: input.body.trim(),
      })
      if (error) throw error
    },
    [],
  )

  const addComment = useCallback(async (input: { userId: string; postId: string; body: string }) => {
    const supabase = createClient()
    if (!supabase) throw new Error("Supabase is not configured.")
    const { error } = await supabase.from("community_comments").insert({
      user_id: input.userId,
      post_id: input.postId,
      body: input.body.trim(),
    })
    if (error) throw error
  }, [])

  const toggleLike = useCallback(async (input: { userId: string; postId: string; liked: boolean }) => {
    const supabase = createClient()
    if (!supabase) throw new Error("Supabase is not configured.")
    if (input.liked) {
      const { error } = await supabase
        .from("community_likes")
        .delete()
        .eq("post_id", input.postId)
        .eq("user_id", input.userId)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from("community_likes")
        .insert({ post_id: input.postId, user_id: input.userId })
      if (error) throw error
    }
  }, [])

  return { createPost, addComment, toggleLike }
}
