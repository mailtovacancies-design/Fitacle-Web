"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"

const SESSION_KEY = "fitacle_splash_shown"

export function StartupSplash({
  isStandalone,
  forcePreview,
}: {
  isStandalone: boolean
  forcePreview: boolean
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only show when launched as the installed app (or explicit preview).
    if (!isStandalone && !forcePreview) return
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return
      sessionStorage.setItem(SESSION_KEY, "1")
    } catch {
      /* ignore */
    }
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 1900)
    return () => clearTimeout(t)
  }, [isStandalone, forcePreview])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="fitacle-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0a0a0a]"
          aria-hidden
        >
          {/* soft brand glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.6, scale: 1.1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl"
          />
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="relative flex flex-col items-center"
          >
            <div className="relative h-24 w-24 rounded-[26px] bg-white shadow-2xl shadow-emerald-500/25 grid place-items-center overflow-hidden">
              <Image
                src="/icons/icon-512.png"
                alt="Fitacle"
                width={64}
                height={64}
                priority
                className="h-16 w-16 object-contain"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="mt-5 text-center"
            >
              <p className="text-2xl font-bold tracking-tight text-white">Fitacle</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-emerald-400">Transform Beyond Limits</p>
            </motion.div>
          </motion.div>

          {/* loading shimmer bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-16 h-1 w-40 overflow-hidden rounded-full bg-white/10"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/2 rounded-full bg-emerald-500"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
