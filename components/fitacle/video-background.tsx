"use client"

import { useEffect, useRef, useState } from "react"

const CLIPS = [
  { name: "strength-pushups", src: "/videos/strength-pushups.mp4", poster: "/videos/strength-pushups-poster.jpg" },
  { name: "battle-ropes", src: "/videos/battle-ropes.mp4", poster: "/videos/battle-ropes-poster.jpg" },
  { name: "boxing-ring", src: "/videos/boxing-ring.mp4", poster: "/videos/boxing-ring-poster.jpg" },
  { name: "runner-sunset", src: "/videos/runner-sunset.mp4", poster: "/videos/runner-sunset-poster.jpg" },
  { name: "stretch-sunset", src: "/videos/stretch-sunset.mp4", poster: "/videos/stretch-sunset-poster.jpg" },
]

export function VideoBackground() {
  const [playClips, setPlayClips] = useState(false)
  const [active, setActive] = useState(0)
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])

  // Desktop (>= 768px) plays the clips; mobile and reduced-motion users get the poster only.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)")
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setPlayClips(desktop.matches && !reduced.matches)
    update()
    desktop.addEventListener("change", update)
    reduced.addEventListener("change", update)
    return () => {
      desktop.removeEventListener("change", update)
      reduced.removeEventListener("change", update)
    }
  }, [])

  useEffect(() => {
    if (!playClips) return
    videoRefs.current.forEach((video, i) => {
      if (!video) return
      if (i === active) {
        video.currentTime = 0
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [active, playClips])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={CLIPS[0].poster || "/placeholder.svg"}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        fetchPriority="high"
      />
      {playClips &&
        CLIPS.map((clip, i) => (
          <video
            key={clip.name}
            ref={(el) => {
              videoRefs.current[i] = el
            }}
            src={clip.src}
            poster={clip.poster}
            muted
            playsInline
            preload={i === 0 ? "auto" : "metadata"}
            onEnded={() => setActive((current) => (current + 1) % CLIPS.length)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              i === active ? "opacity-70" : "opacity-0"
            }`}
          />
        ))}
    </div>
  )
}
