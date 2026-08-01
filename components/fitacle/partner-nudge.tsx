"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Users, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const MESSAGES = [
  "You can find a workout partner… or someone to join you for a dog walk 🐕",
  "Fitness is easier when someone joins your journey 💪",
  "Looking for a gym buddy, walking partner, or accountability partner?",
  "Your perfect fitness companion could be one click away 🚀",
  "Don't train alone. Find someone who matches your goals.",
]

const STORAGE_KEY = "fitacle_partner_nudge_v1"
const FIRST_DELAY_MS = 30_000 // wait 30s after load before first nudge
const REPEAT_INTERVAL_MS = 4 * 60_000 // ~4 min between nudges within a session
const AUTO_HIDE_MS = 13_000 // auto-dismiss after 13s if ignored
const DISMISS_SNOOZE_MS = 12 * 60 * 60_000 // 12h after manual dismiss
const CTA_SNOOZE_MS = 24 * 60 * 60_000 // 24h after clicking through
const SESSION_COOLDOWN_MS = 90 * 60_000 // don't reshow if seen within last 90 min

interface NudgeState {
  snoozeUntil?: number
  lastShown?: number
}

function readState(): NudgeState {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as NudgeState
  } catch {
    return {}
  }
}

function writeState(next: NudgeState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* ignore quota / private mode errors */
  }
}

export function PartnerNudge() {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState(MESSAGES[0])
  const [eligible, setEligible] = useState(false) // only logged-out users
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nextTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Only nudge signed-out visitors (they need signup/login for the feature).
  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return
    let active = true
    supabase.auth.getUser().then(({ data }) => {
      if (active) setEligible(!data.user)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!active) return
      const signedOut = !session?.user
      setEligible(signedOut)
      if (!signedOut) setVisible(false) // hide instantly once they sign in
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const clearTimers = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    if (nextTimer.current) clearTimeout(nextTimer.current)
  }, [])

  const scheduleNext = useCallback(
    (delay: number) => {
      if (nextTimer.current) clearTimeout(nextTimer.current)
      nextTimer.current = setTimeout(() => {
        const state = readState()
        const now = Date.now()
        if (state.snoozeUntil && now < state.snoozeUntil) return
        // pick a fresh random message
        setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)])
        setVisible(true)
        writeState({ ...state, lastShown: now })
        // auto-hide, then queue the next appearance
        if (hideTimer.current) clearTimeout(hideTimer.current)
        hideTimer.current = setTimeout(() => {
          setVisible(false)
          scheduleNext(REPEAT_INTERVAL_MS)
        }, AUTO_HIDE_MS)
      }, delay)
    },
    [],
  )

  useEffect(() => {
    if (!eligible) {
      clearTimers()
      setVisible(false)
      return
    }
    const state = readState()
    const now = Date.now()
    if (state.snoozeUntil && now < state.snoozeUntil) return
    if (state.lastShown && now - state.lastShown < SESSION_COOLDOWN_MS) {
      // seen recently — wait out the remaining cooldown before first nudge
      scheduleNext(SESSION_COOLDOWN_MS - (now - state.lastShown) + FIRST_DELAY_MS)
      return
    }
    scheduleNext(FIRST_DELAY_MS)
    return clearTimers
  }, [eligible, scheduleNext, clearTimers])

  const handleDismiss = () => {
    setVisible(false)
    clearTimers()
    writeState({ ...readState(), snoozeUntil: Date.now() + DISMISS_SNOOZE_MS, lastShown: Date.now() })
  }

  const handleCta = () => {
    setVisible(false)
    clearTimers()
    writeState({ ...readState(), snoozeUntil: Date.now() + CTA_SNOOZE_MS, lastShown: Date.now() })
    const target = document.getElementById("members")
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    } else {
      window.location.href = "/#members"
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Find a fitness partner"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: "spring", damping: 22, stiffness: 260 }}
          className="fixed bottom-24 left-4 sm:bottom-6 sm:left-6 z-40 w-[calc(100vw-2rem)] max-w-[320px] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="h-1 bg-emerald-500" />
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 grid place-items-center">
                <Users size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-emerald-600 mb-1">Never Train Alone</p>
                <p className="text-sm text-foreground leading-relaxed text-pretty">{message}</p>
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
              Find my partner
              <ArrowRight size={15} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
