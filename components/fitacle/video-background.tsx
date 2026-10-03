"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const CLIPS = [
  { name: "battle-ropes", src: "/videos/battle-ropes.mp4", poster: "/videos/battle-ropes-poster.jpg" },
  { name: "workout-duo", src: "/videos/workout-duo.mp4", poster: "/videos/workout-duo-poster.jpg" },
  { name: "barbell-swing", src: "/videos/barbell-swing.mp4", poster: "/videos/barbell-swing-poster.jpg" },
  { name: "healthy-meal", src: "/videos/healthy-meal.mp4", poster: "/videos/healthy-meal-poster.jpg" },
  { name: "wall-ball", src: "/videos/wall-ball.mp4", poster: "/videos/wall-ball-poster.jpg" },
  { name: "deck-stretch", src: "/videos/deck-stretch.mp4", poster: "/videos/deck-stretch-poster.jpg" },
]

export function VideoBackground() {
  const [allowMotion, setAllowMotion] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [active, setActive] = useState(0)
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])

  // Respect reduced-motion; otherwise play on every device. Desktop keeps all clips
  // mounted for crossfades, small screens mount only the active clip to save data.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)")
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => {
      setIsDesktop(desktop.matches)
      setAllowMotion(!reduced.matches)
    }
    update()
    desktop.addEventListener("change", update)
    reduced.addEventListener("change", update)
    return () => {
      desktop.removeEventListener("change", update)
      reduced.removeEventListener("change", update)
    }
  }, [])

  const playActive = useCallback(() => {
    const video = videoRefs.current[active]
    if (!video) return
    // The poster stays visible underneath if the browser blocks autoplay (e.g. Low Power Mode).
    video.play().catch(() => {})
  }, [active])

  useEffect(() => {
    if (!allowMotion) return
    videoRefs.current.forEach((video, i) => {
      if (!video) return
      if (i === active) {
        video.currentTime = 0
      } else {
        video.pause()
      }
    })
    playActive()
  }, [active, allowMotion, isDesktop, playActive])

  // Retry playback when autoplay was blocked: first touch/click, and when the tab becomes visible again.
  useEffect(() => {
    if (!allowMotion) return
    const retry = () => playActive()
    const onVisibility = () => {
      if (document.visibilityState === "visible") playActive()
    }
    window.addEventListener("touchstart", retry, { passive: true, once: true })
    window.addEventListener("click", retry, { once: true })
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      window.removeEventListener("touchstart", retry)
      window.removeEventListener("click", retry)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [allowMotion, playActive])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={CLIPS[0].poster || "/placeholder.svg"}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        fetchPriority="high"
      />
      {allowMotion &&
        CLIPS.map((clip, i) => {
          if (!isDesktop && i !== active) return null
          return (
            <video
              key={clip.name}
              ref={(el) => {
                videoRefs.current[i] = el
              }}
              src={clip.src}
              poster={clip.poster}
              muted
              autoPlay
              playsInline
              disablePictureInPicture
              disableRemotePlayback
              preload={i === active ? "auto" : "metadata"}
              onCanPlay={i === active ? playActive : undefined}
              onEnded={() => setActive((current) => (current + 1) % CLIPS.length)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                i === active ? "opacity-70" : "opacity-0"
              }`}
            />
          )
        })}
    </div>
  )
}
