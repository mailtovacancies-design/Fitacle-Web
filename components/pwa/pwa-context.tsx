"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { StartupSplash } from "./startup-splash"
import { InstallPopup } from "./install-popup"
import { IosInstallSheet } from "./ios-install-sheet"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

type PWAContextValue = {
  /** Native install prompt is available (Android / desktop Chromium). */
  canInstall: boolean
  /** Device is iOS/iPadOS Safari, which needs manual Add to Home Screen. */
  isIOS: boolean
  /** App is already running installed (standalone display mode). */
  isStandalone: boolean
  /** Whether the "Download App" affordance should be offered at all. */
  installable: boolean
  /** Trigger the native prompt, or open iOS/manual instructions as a fallback. */
  promptInstall: () => Promise<void>
  /** Open the manual install instructions sheet. */
  openInstallHelp: () => void
}

const PWAContext = createContext<PWAContextValue | null>(null)

export function usePWA(): PWAContextValue {
  const ctx = useContext(PWAContext)
  if (ctx) return ctx
  // Safe no-op default (e.g. if consumed before mount).
  return {
    canInstall: false,
    isIOS: false,
    isStandalone: false,
    installable: false,
    promptInstall: async () => {},
    openInstallHelp: () => {},
  }
}

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null)
  const [canInstall, setCanInstall] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showIosSheet, setShowIosSheet] = useState(false)
  const [forcePreview, setForcePreview] = useState(false)

  // Detect platform + standalone, capture install prompt, register SW.
  useEffect(() => {
    const ua = window.navigator.userAgent || ""
    const iOS =
      /iphone|ipad|ipod/i.test(ua) ||
      // iPadOS 13+ reports as Mac but has touch points
      (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)
    setIsIOS(iOS)

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    setIsStandalone(standalone)

    // Allow visual verification in the browser preview via ?pwa=demo
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.get("pwa") === "demo") setForcePreview(true)
    } catch {
      /* ignore */
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      deferredPrompt.current = e as BeforeInstallPromptEvent
      setCanInstall(true)
    }
    const onInstalled = () => {
      deferredPrompt.current = null
      setCanInstall(false)
      setIsStandalone(true)
      try {
        localStorage.setItem("fitacle_pwa_installed", "1")
      } catch {
        /* ignore */
      }
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall)
    window.addEventListener("appinstalled", onInstalled)

    // Register the service worker (production only, to avoid dev HMR caching).
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {
          /* registration is best-effort */
        })
      })
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall)
      window.removeEventListener("appinstalled", onInstalled)
    }
  }, [])

  const openInstallHelp = useCallback(() => setShowIosSheet(true), [])

  const promptInstall = useCallback(async () => {
    const dp = deferredPrompt.current
    if (dp) {
      await dp.prompt()
      const choice = await dp.userChoice
      if (choice.outcome === "accepted") {
        deferredPrompt.current = null
        setCanInstall(false)
      }
      return
    }
    // No native prompt (iOS Safari, or unsupported) → show manual instructions.
    setShowIosSheet(true)
  }, [])

  const installable = !isStandalone && (canInstall || isIOS || forcePreview)

  const value: PWAContextValue = {
    canInstall: canInstall || forcePreview,
    isIOS,
    isStandalone,
    installable,
    promptInstall,
    openInstallHelp,
  }

  return (
    <PWAContext.Provider value={value}>
      {children}
      <StartupSplash isStandalone={isStandalone} forcePreview={forcePreview} />
      <InstallPopup />
      <IosInstallSheet open={showIosSheet} isIOS={isIOS} onClose={() => setShowIosSheet(false)} />
    </PWAContext.Provider>
  )
}
