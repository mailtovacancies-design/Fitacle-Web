"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Short, muted, commercially-licensed fitness clips bundled in /public/videos.
// Covered categories: running, strength, workout, mobility, healthy lifestyle.
const CLIPS = [
  "/videos/running-bridge.mp4",
  "/videos/strength-pushups.mp4",
  "/videos/boxing-ring.mp4",
  "/videos/runner-sunset.mp4",
  "/videos/stretch-sunset.mp4",
]
const POSTER = "/videos/poster.jpg"
const CLIP_DURATION_MS = 6500

export function VideoBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  // Play clips on all screen sizes, as long as motion is allowed; otherwise show the poster.
  const [playClips, setPlayClips] = useState(false)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setPlayClips(!reduceMotion.matches)
    update()
    reduceMotion.addEventListener("change", update)
    return () => {
      reduceMotion.removeEventListener("change", update)
    }
  }, [])

  // Pause the rotation when the hero scrolls out of view to save battery/CPU.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.01,
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!playClips || !inView) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % CLIPS.length)
    }, CLIP_DURATION_MS)
    return () => clearInterval(timer)
  }, [playClips, inView])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
    >
      {/* Video / poster layer kept at low opacity so it reads as a subtle backdrop. */}
      <div className="absolute inset-0 opacity-55">
        {playClips ? (
          <AnimatePresence mode="sync">
            <motion.video
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="absolute inset-0 h-full w-full object-cover"
              src={CLIPS[index]}
              poster={POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </AnimatePresence>
        ) : (
          // Mobile / reduced-motion: static poster only, no playback.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={POSTER || "/placeholder.svg"} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
      </div>

      {/* Light veils tuned for the hero's light theme so all existing text stays readable. */}
      <div className="absolute inset-0 bg-background/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-background/35 to-background/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
    </div>
  )
}
