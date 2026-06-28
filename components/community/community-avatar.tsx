"use client"

import { BadgeCheck } from "lucide-react"
import { avatarColorFromName, initialsFromName } from "@/lib/community/types"

interface CommunityAvatarProps {
  name: string | null | undefined
  isOfficial?: boolean
  size?: "sm" | "md" | "lg"
}

const SIZES = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
}

export function CommunityAvatar({ name, isOfficial = false, size = "md" }: CommunityAvatarProps) {
  return (
    <div className="relative shrink-0">
      <div
        className={`${SIZES[size]} ${
          isOfficial ? "bg-emerald-500 text-white" : avatarColorFromName(name)
        } rounded-full flex items-center justify-center font-semibold`}
        aria-hidden="true"
      >
        {initialsFromName(name)}
      </div>
      {isOfficial && (
        <span className="absolute -bottom-0.5 -right-0.5 bg-card rounded-full">
          <BadgeCheck size={size === "sm" ? 13 : 15} className="text-emerald-600 fill-emerald-500/20" />
        </span>
      )}
    </div>
  )
}
