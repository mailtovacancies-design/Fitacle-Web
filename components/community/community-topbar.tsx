"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, LogOut, User as UserIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useCurrentUser } from "@/lib/community/use-community"
import { displayName, initialsFromName } from "@/lib/community/types"
import { CommunityAuthDialog } from "./community-auth-dialog"

export function CommunityTopbar() {
  const { user } = useCurrentUser()
  const [authOpen, setAuthOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const name = (user?.user_metadata?.full_name as string | undefined) || user?.email?.split("@")[0]

  const handleSignOut = async () => {
    const supabase = createClient()
    if (!supabase) return
    await supabase.auth.signOut()
    setMenuOpen(false)
    window.location.reload()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-card">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="p-2 -ml-2 rounded-full text-muted-foreground hover:bg-accent transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft size={20} />
          </Link>
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <Image
              src="/images/fitacle-logo.png"
              alt="Fitacle"
              width={32}
              height={32}
              className="rounded-lg object-contain shrink-0"
            />
            <div className="min-w-0">
              <p className="font-bold text-foreground leading-tight truncate">Community</p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Fitacle Hub</p>
            </div>
          </Link>
        </div>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 pl-1.5 pr-3 py-1.5 text-sm font-medium text-emerald-700 hover:border-emerald-500/40 transition-colors"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-semibold">
                {initialsFromName(name)}
              </span>
              <span className="max-w-[100px] truncate">{displayName(name)}</span>
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="p-3 border-b border-border">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button
            onClick={() => setAuthOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-sm font-semibold hover:bg-foreground/90 transition-colors"
          >
            <UserIcon size={15} />
            Sign In
          </button>
        )}
      </div>

      <CommunityAuthDialog open={authOpen} onClose={() => setAuthOpen(false)} onSignedIn={() => window.location.reload()} />
    </header>
  )
}
