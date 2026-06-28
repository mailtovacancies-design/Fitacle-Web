"use client"

import Link from "next/link"
import { Home, Users } from "lucide-react"

export function CommunityBottomNav() {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-border pb-safe">
      <div className="grid grid-cols-2">
        <Link
          href="/"
          className="flex flex-col items-center gap-1 py-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home size={20} />
          <span className="text-[11px] font-medium">Home</span>
        </Link>
        <span className="flex flex-col items-center gap-1 py-3 text-emerald-600">
          <Users size={20} />
          <span className="text-[11px] font-semibold">Community</span>
        </span>
      </div>
    </nav>
  )
}
