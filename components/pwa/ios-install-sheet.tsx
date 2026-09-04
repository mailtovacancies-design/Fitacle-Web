"use client"

import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { X, Share, Plus, MoreVertical } from "lucide-react"

export function IosInstallSheet({
  open,
  isIOS,
  onClose,
}: {
  open: boolean
  isIOS: boolean
  onClose: () => void
}) {
  const steps = isIOS
    ? [
        { icon: <Share size={18} />, text: "Tap the Share button in Safari's toolbar." },
        { icon: <Plus size={18} />, text: 'Choose "Add to Home Screen".' },
        { icon: <Image src="/icons/icon-192.png" alt="" width={18} height={18} className="h-4.5 w-4.5 rounded" />, text: 'Tap "Add" — Fitacle appears on your home screen.' },
      ]
    : [
        { icon: <MoreVertical size={18} />, text: "Open your browser menu (⋮ in the toolbar)." },
        { icon: <Plus size={18} />, text: 'Choose "Install app" or "Add to Home screen".' },
        { icon: <Image src="/icons/icon-192.png" alt="" width={18} height={18} className="h-4.5 w-4.5 rounded" />, text: "Confirm — Fitacle installs like a native app." },
      ]

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[160] bg-black/50 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            role="dialog"
            aria-label="How to install Fitacle"
            className="fixed inset-x-0 bottom-0 z-[161] mx-auto w-full max-w-md rounded-t-3xl border border-border bg-card p-5 pb-8 shadow-2xl"
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" />
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-white shadow-md shadow-emerald-500/20">
                <Image src="/icons/icon-512.png" alt="Fitacle" width={34} height={34} className="h-8.5 w-8.5 object-contain" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Add Fitacle to your device</h3>
                <p className="text-[13px] text-muted-foreground">Install in a few taps — no app store needed.</p>
              </div>
            </div>

            <ol className="mt-5 space-y-3">
              {steps.map((step, i) => (
                <li key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-3">
                  <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-emerald-500/10 text-emerald-600">
                    {step.icon}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-foreground">
                    <span className="text-xs font-bold text-emerald-600">{i + 1}.</span>
                    {step.text}
                  </span>
                </li>
              ))}
            </ol>

            <button
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 active:scale-[0.98]"
            >
              Got it
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
