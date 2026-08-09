"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight, ArrowLeft, Sparkles, Activity, CalendarCheck, Users, MessageSquare, Check } from "lucide-react"

// First-time website tour. Completion/skip is tracked in localStorage so it only
// shows once per visitor. This is UI state only — no profile data is stored here.
const STORAGE_KEY = "fitacle_tour_v1"
const START_DELAY_MS = 2500

type Step = {
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  description: string
  target?: string // element id to scroll into view for context
}

const STEPS: Step[] = [
  {
    icon: Sparkles,
    title: "Welcome to Fitacle",
    description:
      "Fitacle is your AI fitness platform for lasting change. Here's a quick 30-second tour of what you can do.",
  },
  {
    icon: Activity,
    title: "Body Intelligence",
    description:
      "Analyze your body metrics and get intelligent insights that adapt to your habits and lifestyle.",
    target: "analyzer",
  },
  {
    icon: CalendarCheck,
    title: "Your AI Daily Plan",
    description:
      "Get a personalized daily plan built around your goals, schedule, and progress — one step at a time.",
    target: "plan",
  },
  {
    icon: Users,
    title: "Find a Workout Partner",
    description:
      "Never train alone. Match with workout partners, gym buddies, and accountability partners near you by goals, activity, schedule, and location.",
    target: "members",
  },
  {
    icon: MessageSquare,
    title: "Join the Community",
    description:
      "Ask questions, share wins, and grow with real people — with official answers from the Fitacle team.",
  },
]

function isTourDone(): boolean {
  if (typeof window === "undefined") return true
  try {
    return localStorage.getItem(STORAGE_KEY) === "done"
  } catch {
    return true
  }
}

function markTourDone() {
  try {
    localStorage.setItem(STORAGE_KEY, "done")
  } catch {
    /* ignore quota / private mode errors */
  }
}

export function GuideTour() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (isTourDone()) return
    const timer = setTimeout(() => setOpen(true), START_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  const finish = useCallback(() => {
    markTourDone()
    setOpen(false)
  }, [])

  // Navigate steps without moving the page. The tour is a centered modal only —
  // it must never scroll the page or disturb existing navigation/animations.
  const goTo = useCallback((next: number) => {
    setStep(Math.max(0, Math.min(STEPS.length - 1, next)))
  }, [])

  const isLast = step === STEPS.length - 1
  const current = STEPS[step]
  const Icon = current.icon

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Fitacle feature tour"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm"
          onClick={finish}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="h-1 bg-emerald-500" />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 grid place-items-center">
                  <Icon size={22} />
                </div>
                <button
                  onClick={finish}
                  aria-label="Skip tour"
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 mb-1">
                Step {step + 1} of {STEPS.length}
              </p>
              <h2 className="text-xl font-bold text-foreground text-balance mb-2">{current.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{current.description}</p>

              {/* Progress dots */}
              <div className="mt-5 flex items-center gap-1.5">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to step ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === step ? "w-6 bg-emerald-500" : "w-1.5 bg-border hover:bg-muted-foreground/40"
                    }`}
                  />
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                {step > 0 ? (
                  <button
                    onClick={() => goTo(step - 1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-accent transition-colors"
                  >
                    <ArrowLeft size={15} />
                    Back
                  </button>
                ) : (
                  <button
                    onClick={finish}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Skip tour
                  </button>
                )}

                {isLast ? (
                  <button
                    onClick={finish}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors"
                  >
                    Get Started
                    <Check size={15} />
                  </button>
                ) : (
                  <button
                    onClick={() => goTo(step + 1)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors"
                  >
                    Next
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
