"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ProfileModal } from "@/components/fitacle/profile-modal"

// Snooze the prompt after a manual dismiss so it stays helpful, not annoying.
// This tracks UI state only (never profile data), matching the existing nudge pattern.
const STORAGE_KEY = "fitacle_profile_completion_v1"
const DISMISS_SNOOZE_MS = 24 * 60 * 60_000 // 24h after manual dismiss
const SHOW_DELAY_MS = 6_000 // let the page settle before prompting

function isSnoozed(): boolean {
  if (typeof window === "undefined") return false
  try {
    const until = Number(localStorage.getItem(STORAGE_KEY) || "0")
    return Date.now() < until
  } catch {
    return false
  }
}

function snooze() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now() + DISMISS_SNOOZE_MS))
  } catch {
    /* ignore quota / private mode errors */
  }
}

// A profile only appears in "Find a Workout Partner" when it has the required
// fields AND is visible. Anything short of that counts as incomplete.
function isProfileComplete(profile: {
  full_name?: string | null
  country?: string | null
  city?: string | null
  is_visible?: boolean | null
} | null): boolean {
  if (!profile) return false
  return Boolean(
    profile.full_name?.trim() &&
      profile.country?.trim() &&
      profile.city?.trim() &&
      profile.is_visible,
  )
}

export function ProfileCompletionPrompt() {
  const [visible, setVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [checked, setChecked] = useState(false)

  const checkProfile = useCallback(async () => {
    try {
      const supabase = createClient()
      if (!supabase) return
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Signed-out visitors are handled by the PartnerNudge, not this prompt.
      if (!user) {
        setVisible(false)
        return
      }

      const { data: profile } = await supabase
        .from("fitness_partners")
        .select("full_name, country, city, is_visible")
        .eq("user_id", user.id)
        .maybeSingle()

      const complete = isProfileComplete(profile)
      setChecked(true)
      // Show the prompt to any signed-in user (new or existing) whose profile
      // is incomplete and who hasn't recently dismissed it.
      setVisible(!complete && !isSnoozed())
    } catch {
      // Supabase not configured — stay silent.
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(checkProfile, SHOW_DELAY_MS)
    return () => clearTimeout(timer)
  }, [checkProfile])

  const handleDismiss = () => {
    setVisible(false)
    snooze()
  }

  const handleCta = () => {
    setVisible(false)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    // Re-check after saving: if now complete the prompt won't return.
    setTimeout(checkProfile, 500)
  }

  return (
    <>
      <AnimatePresence>
        {visible && checked && (
          <motion.div
            role="dialog"
            aria-label="Complete your profile to find a fitness partner"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-40 w-[calc(100vw-2rem)] max-w-[340px] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="h-1 bg-emerald-500" />
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 grid place-items-center">
                  <Sparkles size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-emerald-600 mb-1">Complete Your Profile</p>
                  <p className="text-sm text-foreground leading-relaxed text-pretty">
                    Your profile is incomplete, so you won&apos;t appear in Find a Workout Partner yet. Finish it to get
                    matched with training partners near you.
                  </p>
                </div>
                <button
                  onClick={handleDismiss}
                  aria-label="Dismiss"
                  className="flex-shrink-0 -mt-1 -mr-1 p-1.5 rounded-lg text-muted-foreground hover:bg-accent transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <button
                onClick={handleCta}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors"
              >
                Try It Out. Find Your Fitness Partner.
                <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProfileModal open={modalOpen} onClose={handleModalClose} />
    </>
  )
}
