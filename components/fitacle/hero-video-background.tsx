"use client"

import { useEffect, useRef, useState } from "react"

// Subtle, motivational fitness video behind the hero content.
// Muted + looped + playsInline, very low opacity with a dark tint so
// existing hero text stays highly readable. Honors prefers-reduced-motion
// by showing only the static poster frame (no playback).
export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (reducedMotion) {
      video.pause()
    } else {
      // Slow the playback for calm, non-distracting movement.
      video.playbackRate = 0.6
      video.play().catch(() => {})
    }
  }, [reducedMotion])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {reducedMotion ? (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.14]"
          style={{ backgroundImage: "url('/videos/hero-fitness-poster.jpg')" }}
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover opacity-[0.14]"
          src="/videos/hero-fitness.mp4"
          poster="/videos/hero-fitness-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
      )}
      {/* Dark tint keeps hero copy high-contrast over the footage. */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/35 via-neutral-950/15 to-neutral-950/40" />
    </div>
  )
}
