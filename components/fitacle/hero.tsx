"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { Instagram, Play, ArrowDown, Sparkles, ChevronRight, Mail, ArrowRight, Heart, Dumbbell, Apple, Leaf, Flame, Timer, Zap, Target, TrendingUp } from "lucide-react"
import Image from "next/image"

// Floating fitness element data - positioned around the headline area
const floatingElements = [
  // Left side of headline
  { icon: Dumbbell, x: "5%", y: "25%", size: 32, delay: 0, duration: 8, rotate: 15 },
  { icon: Apple, x: "8%", y: "45%", size: 28, delay: 0.5, duration: 9, rotate: -12 },
  { icon: Leaf, x: "3%", y: "60%", size: 26, delay: 1, duration: 7, rotate: 18 },
  { icon: Heart, x: "12%", y: "35%", size: 24, delay: 1.5, duration: 10, rotate: -8 },
  { icon: Flame, x: "6%", y: "70%", size: 30, delay: 0.3, duration: 8.5, rotate: 10 },
  // Right side of headline  
  { icon: Zap, x: "92%", y: "28%", size: 30, delay: 0.8, duration: 7.5, rotate: -15 },
  { icon: Target, x: "88%", y: "48%", size: 28, delay: 0.2, duration: 9, rotate: 12 },
  { icon: Timer, x: "94%", y: "62%", size: 26, delay: 1.2, duration: 8, rotate: -18 },
  { icon: TrendingUp, x: "85%", y: "38%", size: 24, delay: 0.7, duration: 10, rotate: 8 },
  { icon: Dumbbell, x: "90%", y: "72%", size: 32, delay: 1.8, duration: 7, rotate: -10 },
  // Top area
  { icon: Apple, x: "25%", y: "12%", size: 24, delay: 0.4, duration: 9.5, rotate: 15 },
  { icon: Leaf, x: "75%", y: "10%", size: 22, delay: 0.9, duration: 8, rotate: -12 },
  // Bottom area
  { icon: Heart, x: "20%", y: "82%", size: 26, delay: 1.3, duration: 8.5, rotate: 10 },
  { icon: Flame, x: "78%", y: "85%", size: 28, delay: 0.6, duration: 9, rotate: -14 },
  // Center-ish floating
  { icon: Zap, x: "18%", y: "52%", size: 22, delay: 2, duration: 7.5, rotate: 8 },
  { icon: Target, x: "82%", y: "55%", size: 22, delay: 1.6, duration: 8, rotate: -8 },
]

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  
  useEffect(() => {
    if (!isInView) return
    
    const duration = 2500
    const steps = 80
    const increment = value / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [value, isInView])
  
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

function MagneticButton({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setPosition({ x: x * 0.15, y: y * 0.15 })
  }
  
  const handleMouseLeave = () => setPosition({ x: 0, y: 0 })
  
  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15 }}
      className={className}
    >
      {children}
    </motion.button>
  )
}

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup")
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const y = useSpring(useTransform(scrollY, [0, 800], [0, 200]), springConfig)
  const opacity = useSpring(useTransform(scrollY, [0, 500], [1, 0]), springConfig)
  const scale = useSpring(useTransform(scrollY, [0, 800], [1, 1.15]), springConfig)

  useEffect(() => {
    setIsLoaded(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      })
    }
    
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Realistic stats for a new startup
  const stats = [
    { value: 847, suffix: "+", label: "Beta Users" },
    { value: 12, suffix: "K+", label: "Workouts Tracked" },
    { value: 94, suffix: "%", label: "Satisfaction" },
  ]

  return (
    <>
      <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background with Jaw-Dropping Effects */}
        <motion.div 
          style={{ y, scale }}
          className="absolute inset-0"
        >
          {/* Base gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-200" />
          
          {/* Smooth gradient animations - GPU optimized */}
          <motion.div
            animate={{
              opacity: [0.15, 0.3, 0.15]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 via-transparent to-transparent will-change-opacity"
          />
          
          {/* Subtle radial gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_40%,_rgba(16,185,129,0.12)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_60%,_rgba(16,185,129,0.08)_0%,_transparent_50%)]" />
          
          {/* Premium layered overlays for light theme */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/60 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          
          
          
          {/* Grain texture overlay */}
          <div 
            className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
            }}
          />
          
          {/* Floating Fitness Elements - Dumbbells, Food, Health Icons */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {floatingElements.map((element, i) => (
              <motion.div
                key={`floating-${i}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: [0.4, 0.7, 0.4],
                  scale: [1, 1.1, 1],
                  y: [0, -25, 0],
                  x: [0, i % 2 === 0 ? 12 : -12, 0],
                  rotate: [0, element.rotate, 0]
                }}
                transition={{
                  duration: element.duration,
                  repeat: Infinity,
                  delay: element.delay,
                  ease: "easeInOut"
                }}
                className="absolute will-change-transform"
                style={{
                  left: element.x,
                  top: element.y,
                  transform: "translateZ(0)" // Force GPU acceleration
                }}
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 15px 3px rgba(16, 185, 129, 0.1)",
                      "0 0 30px 8px rgba(16, 185, 129, 0.25)",
                      "0 0 15px 3px rgba(16, 185, 129, 0.1)"
                    ]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: element.delay * 0.5,
                    ease: "easeInOut"
                  }}
                  className="p-3 sm:p-4 rounded-2xl bg-white/80 border border-emerald-500/20 shadow-lg backdrop-blur-md"
                >
                  <element.icon 
                    size={element.size} 
                    className="text-emerald-600"
                    strokeWidth={1.8}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Simple ambient gradients - no heavy animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/3 -right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent blur-3xl" />
          <div className="absolute -bottom-1/3 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent blur-3xl" />
        </div>

        {/* Main Content */}
        <motion.div 
          style={{ opacity }}
          className="relative z-10 mx-auto max-w-6xl px-6 py-32 text-center"
        >
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={isLoaded ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10"
          >
            <span className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-foreground/5 backdrop-blur-2xl border border-foreground/10 text-sm font-medium text-foreground shadow-lg hover:bg-foreground/10 transition-all duration-500 cursor-default">
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles size={16} className="text-foreground" />
              </motion.span>
              AI-Powered Fitness Revolution
              <ChevronRight size={14} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.div>

          {/* Main Heading */}
          <div className="mb-10 perspective-1000">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold tracking-tight leading-[0.9]">
              <div className="overflow-hidden">
                <motion.span 
                  className="block text-foreground"
                  initial={{ opacity: 0, y: 100, rotateX: -45 }}
                  animate={isLoaded ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                  transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  Become The
                </motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.span 
                  className="block text-foreground"
                  initial={{ opacity: 0, y: 100, rotateX: -45 }}
                  animate={isLoaded ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                  transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  Version You
                </motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.span 
                  className="block text-muted-foreground/70"
                  initial={{ opacity: 0, y: 100, rotateX: -45 }}
                  animate={isLoaded ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                  transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  Respect
                </motion.span>
              </div>
            </h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-14"
          >
            Real fitness. Intelligent transformation. Sustainable habits.
            <br className="hidden sm:block" />
            Your premium AI fitness companion for lasting change.
          </motion.p>

          {/* Auth Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
          >
            {/* Google Sign Up */}
            <MagneticButton 
              onClick={() => { setAuthMode("signup"); setShowAuthModal(true) }}
              className="group relative flex items-center gap-3 px-8 py-4 bg-foreground text-background rounded-full font-semibold text-base overflow-hidden shadow-2xl shadow-foreground/15 hover:shadow-3xl hover:shadow-foreground/25 transition-all duration-500"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
              />
            </MagneticButton>

            {/* Email Sign Up */}
            <MagneticButton 
              onClick={() => { setAuthMode("signup"); setShowAuthModal(true) }}
              className="group flex items-center gap-3 px-8 py-4 bg-background/80 backdrop-blur-2xl text-foreground border border-border rounded-full font-semibold text-base hover:bg-background hover:border-foreground/20 hover:shadow-xl transition-all duration-500"
            >
              <Mail size={18} />
              Sign up with Email
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
          </motion.div>

          {/* Sign In Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.25 }}
            className="text-sm text-muted-foreground mb-16"
          >
            Already have an account?{" "}
            <button 
              onClick={() => { setAuthMode("signin"); setShowAuthModal(true) }}
              className="text-foreground font-medium hover:underline underline-offset-4 transition-all"
            >
              Sign in
            </button>
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-center gap-10 md:gap-16 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={isLoaded ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ 
                  duration: 0.8, 
                  delay: 1.5 + index * 0.15,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center cursor-default"
              >
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-muted-foreground tracking-wide uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Instagram Highlight Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.8 }}
            className="relative"
          >
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(0,0,0,0)",
                  "0 0 0 8px rgba(0,0,0,0.03)",
                  "0 0 0 0 rgba(0,0,0,0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block rounded-2xl"
            >
              <motion.a
                href="https://instagram.com/fitacle_official"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex items-center gap-4 px-8 py-5 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl border border-foreground/10 hover:border-foreground/20 transition-all duration-500 overflow-hidden"
              >
                {/* Instagram gradient background on hover */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                />
                
                {/* Animated pulse ring */}
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full blur-sm"
                  />
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <Instagram size={22} className="text-white" />
                  </div>
                </div>
                
                <div className="text-left relative z-10">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    Join our community
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Heart size={12} className="text-pink-500 fill-pink-500" />
                    </motion.span>
                  </p>
                  <p className="text-lg font-semibold text-foreground group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-orange-600 group-hover:bg-clip-text transition-all duration-300">
                    @fitacle_official
                  </p>
                </div>
                
                <motion.div
                  className="ml-auto"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                </motion.div>
              </motion.a>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={isLoaded ? { opacity: 1 } : {}}
              transition={{ delay: 2.2 }}
              className="mt-4 text-sm text-muted-foreground"
            >
              Daily tips, workout inspiration & community updates
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-xs text-muted-foreground uppercase tracking-[0.3em] font-medium">Explore</span>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <ArrowDown size={20} className="text-muted-foreground" />
            <motion.div
              className="absolute inset-0 bg-foreground/20 rounded-full blur-md"
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-card rounded-3xl border border-border shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                {/* Logo with animated effects */}
                <div className="flex justify-center mb-8">
                  <motion.div 
                    className="relative"
                    animate={{ 
                      boxShadow: [
                        "0 0 0 0 rgba(16, 185, 129, 0)",
                        "0 0 0 8px rgba(16, 185, 129, 0.1)",
                        "0 0 0 0 rgba(16, 185, 129, 0)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Image
                      src="/images/fitacle-logo.png"
                      alt="FITACLE"
                      width={56}
                      height={56}
                      className="rounded-2xl shadow-xl"
                    />
                  </motion.div>
                </div>

                <h2 className="text-2xl font-bold text-center text-foreground mb-2">
                  {authMode === "signup" ? "Create your account" : "Welcome back"}
                </h2>
                <p className="text-center text-muted-foreground mb-8">
                  {authMode === "signup" 
                    ? "Start your fitness journey today" 
                    : "Sign in to continue your journey"
                  }
                </p>

                {/* Google Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-foreground text-background rounded-xl font-semibold mb-4 shadow-lg hover:shadow-xl transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </motion.button>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Email Form */}
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  {authMode === "signup" && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-4 bg-foreground text-background rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all mt-2"
                  >
                    {authMode === "signup" ? "Create Account" : "Sign In"}
                  </motion.button>
                </form>

                {/* Toggle Auth Mode */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                  {authMode === "signup" ? (
                    <>
                      Already have an account?{" "}
                      <button 
                        onClick={() => setAuthMode("signin")}
                        className="text-foreground font-medium hover:underline"
                      >
                        Sign in
                      </button>
                    </>
                  ) : (
                    <>
                      Don&apos;t have an account?{" "}
                      <button 
                        onClick={() => setAuthMode("signup")}
                        className="text-foreground font-medium hover:underline"
                      >
                        Sign up
                      </button>
                    </>
                  )}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
