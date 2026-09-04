"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { X, Download, Wifi, Zap } from "lucide-react"
import { usePWA } from "./pwa-context"

const SNOOZE_KEY = "fitacle_pwa_snooze_until"
const SHOW_DELAY_MS = 5000
const SNOOZE_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

export function InstallPopup() {
  const { installable, isStandalone, isIOS, promptInstall } = usePWA()
  const [open, setOpen] = useState(false)
  const scheduledRef = useRef(false)

  useEffect(() => {
    if (isStandalone || !installable || scheduledRef.current) return

    let snoozed = false
    try {
      const until = Number(localStorage.getItem(SNOOZE_KEY) || 0)
      snoozed = Date.now() < until
    } catch {
      /* ignore */
    }
    if (snoozed) return

    scheduledRef.current = true
    const t = setTimeout(() => setOpen(true), SHOW_DELAY_MS)
    return () => clearTimeout(t)
  }, [installable, isStandalone])

  // Auto-hide once the app is installed.
  useEffect(() => {
    if (isStandalone) setOpen(false)
  }, [isStandalone])

  const snoozeAndClose = () => {
    try {
      localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_MS))
    } catch {
      /* ignore */
    }
    setOpen(false)
  }

  const handleInstall = async () => {
    await promptInstall()
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={snoozeAndClose}
            className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            role="dialog"
            aria-label="Install the Fitacle app"
            className="fixed z-[151] left-1/2 -translate-x-1/2 bottom-3 w-[calc(100vw-1.5rem)] max-w-sm sm:bottom-6"
          >
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-2xl">
              <button
                onClick={snoozeAndClose}
                aria-label="Dismiss"
                className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3.5">
                <div className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-2xl bg-white shadow-md shadow-emerald-500/20">
                  <Image src="/icons/icon-512.png" alt="Fitacle" width={40} height={40} className="h-10 w-10 object-contain" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-foreground">Install the Fitacle app</h3>
                  <p className="text-[13px] leading-snug text-muted-foreground">
                    Add Fitacle to your home screen for a faster, full-screen experience.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-[12px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Zap size={13} className="text-emerald-600" /> Instant launch
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Wifi size={13} className="text-emerald-600" /> Works offline
                </span>
              </div>

              <div className="mt-5 flex items-center gap-2.5">
                <button
                  onClick={snoozeAndClose}
                  className="flex-1 rounded-full px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
                >
                  Later
                </button>
                <button
                  onClick={handleInstall}
                  className="flex-[1.4] inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/25 transition-colors hover:bg-emerald-500 active:scale-[0.98]"
                >
                  <Download size={16} />
                  {isIOS ? "How to install" : "Install app"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
