"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { Instagram, Play, ArrowDown, Sparkles, ChevronRight, Mail, ArrowRight, Heart, Dumbbell, Apple, Leaf, Flame, Timer, Zap, Target, TrendingUp, Footprints, Bike, Salad, Droplets, Activity, Trophy, Loader2, Check, AlertCircle, X } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useStats } from "@/lib/use-stats"
import { isProfileComplete } from "@/lib/profile-completion"
import { HeroVideoBackground } from "@/components/fitacle/hero-video-background"

// Floating fitness element data - positioned around the main headline on mobile
const floatingElements = [
  // Left side around "You Were Never Meant to Stay The Same"
  { icon: Dumbbell, x: "4%", y: "18%", mobileX: "3%", mobileY: "22%", size: 22, mobileSize: 18, delay: 0, duration: 6 },
  { icon: Footprints, x: "6%", y: "35%", mobileX: "5%", mobileY: "35%", size: 20, mobileSize: 16, delay: 2, duration: 7 },
  { icon: Heart, x: "3%", y: "52%", mobileX: "8%", mobileY: "48%", size: 18, mobileSize: 16, delay: 4, duration: 5.5 },
  { icon: Activity, x: "7%", y: "68%", mobileX: "4%", mobileY: "58%", size: 20, mobileSize: 16, delay: 1, duration: 6.5 },
  // Right side around headline
  { icon: Apple, x: "94%", y: "20%", mobileX: "92%", mobileY: "20%", size: 20, mobileSize: 16, delay: 1.5, duration: 6 },
  { icon: Salad, x: "91%", y: "38%", mobileX: "94%", mobileY: "33%", size: 18, mobileSize: 16, delay: 3.5, duration: 7 },
  { icon: Droplets, x: "95%", y: "55%", mobileX: "90%", mobileY: "45%", size: 18, mobileSize: 14, delay: 0.5, duration: 5.5 },
  { icon: Flame, x: "92%", y: "72%", mobileX: "93%", mobileY: "56%", size: 22, mobileSize: 18, delay: 2.5, duration: 6.5 },
  // Top scattered around headline
  { icon: Bike, x: "18%", y: "6%", mobileX: "15%", mobileY: "15%", size: 18, mobileSize: 14, delay: 3, duration: 6 },
  { icon: Trophy, x: "82%", y: "8%", mobileX: "85%", mobileY: "12%", size: 18, mobileSize: 14, delay: 1.2, duration: 5.5 },
  { icon: Target, x: "16%", y: "88%", mobileX: "12%", mobileY: "65%", size: 20, mobileSize: 16, delay: 2.8, duration: 7 },
  { icon: TrendingUp, x: "84%", y: "86%", mobileX: "88%", mobileY: "68%", size: 20, mobileSize: 16, delay: 0.8, duration: 6 },
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

interface HeroProps {
  showAuthModal?: boolean
  setShowAuthModal?: (show: boolean) => void
}

export function Hero({ showAuthModal: externalShowAuthModal, setShowAuthModal: externalSetShowAuthModal }: HeroProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [internalShowAuthModal, setInternalShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup" | "reset">("signup")
  
  // Use external state if provided, otherwise use internal state
  const showAuthModal = externalShowAuthModal !== undefined ? externalShowAuthModal : internalShowAuthModal
  const setShowAuthModal = externalSetShowAuthModal || setInternalShowAuthModal
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authSuccess, setAuthSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" })
  const [supabaseClient, setSupabaseClient] = useState<ReturnType<typeof createClient> | null>(null)
  const [userAuthProvider, setUserAuthProvider] = useState<"google" | "email" | null>(null)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  
  // Initialize supabase client on mount and check user auth provider
  useEffect(() => {
    const client = createClient()
    setSupabaseClient(client)
    
    // Check if user is already signed in and get their auth provider
    const checkUserProvider = async () => {
      if (!client) return
      const { data: { user } } = await client.auth.getUser()
      if (user) {
        setIsSignedIn(true)
        // Check if signed in with Google
        const isGoogleUser = user.app_metadata?.provider === 'google' || 
                            user.identities?.some(i => i.provider === 'google')
        setUserAuthProvider(isGoogleUser ? 'google' : 'email')
      }
    }
    checkUserProvider()
  }, [])

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    if (!supabaseClient) {
      setAuthError("Authentication is not configured yet")
      return
    }
    setIsSubmitting(true)
    setAuthError(null)
    
    const redirectUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback` 
      : 'https://fitacle.com/auth/callback'
    
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    })
    
    if (error) {
      setAuthError(error.message)
      setIsSubmitting(false)
    }
  }

  // Handle Email Sign Up
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabaseClient) {
      setAuthError("Authentication is not configured yet")
      return
    }
    setIsSubmitting(true)
    setAuthError(null)
    setAuthSuccess(null)

    const emailRedirectUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback` 
      : 'https://fitacle.com/auth/callback'
    
    const firstName = formData.firstName.trim()
    const lastName = formData.lastName.trim()
    const fullName = [firstName, lastName].filter(Boolean).join(" ")

    const { error } = await supabaseClient.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: emailRedirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
          // Keep full_name in sync so all existing readers (navbar, profile, etc.) still work.
          full_name: fullName,
        },
      },
    })

    setIsSubmitting(false)
    
    if (error) {
      setAuthError(error.message)
    } else {
      setAuthSuccess("signup")
      setFormData({ firstName: "", lastName: "", email: "", password: "" })
    }
  }

  // Handle Email Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabaseClient) {
      setAuthError("Authentication is not configured yet")
      return
    }
    setIsSubmitting(true)
    setAuthError(null)

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    setIsSubmitting(false)
    
    if (error) {
      setAuthError(error.message)
    } else {
      setAuthSuccess("login")
      // A profile is "complete" only when every REQUIRED field is saved. Users
      // with missing details are sent to the completion flow; complete users
      // are never nudged.
      let hasCompleteProfile = false
      if (data.user) {
        const { data: partner } = await supabaseClient
          .from("fitness_partners")
          .select(
            "full_name, age, country, city, fitness_focus, usual_gym_time, gym_name, schedule_preference, weight_kg, height_cm, experience_level, goal",
          )
          .eq("user_id", data.user.id)
          .maybeSingle()
        hasCompleteProfile = isProfileComplete(partner)
      }

      setTimeout(() => {
        setShowAuthModal(false)
        if (!hasCompleteProfile) {
          window.location.href = '/#partner'
        } else {
          window.location.reload()
        }
      }, 2500)
    }
  }

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabaseClient) {
      setAuthError("Authentication is not configured yet")
      return
    }
    setIsSubmitting(true)
    setAuthError(null)
    setAuthSuccess(null)

    const redirectUrl = typeof window !== "undefined"
      ? `${window.location.origin}/auth/reset-password`
      : "https://fitacle.com/auth/reset-password"

    const { error } = await supabaseClient.auth.resetPasswordForEmail(formData.email, {
      redirectTo: redirectUrl,
    })

    setIsSubmitting(false)
    if (error) {
      setAuthError(error.message)
    } else {
      setAuthSuccess("reset")
    }
  }

  // Only allow opening the auth modal when signed out. Signed-in users are routed instead.
  const openAuth = (mode: "signin" | "signup") => {
    if (isSignedIn) {
      window.location.href = "/#score"
      return
    }
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  // Reset form when modal closes or mode changes
  const resetAuthState = () => {
    setAuthError(null)
    setAuthSuccess(null)
    setFormData({ firstName: "", lastName: "", email: "", password: "" })
  }

  // Safety net: never show the sign in / sign up form to a logged-in user.
  // Other sections (Daily Plan, Fitacle Score) can request the modal directly,
  // so if that happens while signed in we close it and route to the dashboard.
  useEffect(() => {
    if (showAuthModal && isSignedIn) {
      setShowAuthModal?.(false)
      window.location.href = "/#score"
    }
  }, [showAuthModal, isSignedIn])
  
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const y = useSpring(useTransform(scrollY, [0, 800], [0, 100]), springConfig)
  const backgroundOpacity = useSpring(useTransform(scrollY, [0, 800], [1, 0.3]), springConfig)
  const scale = useSpring(useTransform(scrollY, [0, 800], [1, 1.05]), springConfig)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Handle Google auth callback from URL params
  const [showGoogleAuthSuccess, setShowGoogleAuthSuccess] = useState<"signup" | "login" | null>(null)
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authType = params.get('auth')
    
    if (authType === 'google_signup') {
      setShowGoogleAuthSuccess('signup')
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname + window.location.hash)
      // Auto-dismiss after 3 seconds
      setTimeout(() => setShowGoogleAuthSuccess(null), 3500)
    } else if (authType === 'google_login') {
      setShowGoogleAuthSuccess('login')
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
      // Auto-dismiss after 3 seconds
      setTimeout(() => setShowGoogleAuthSuccess(null), 3500)
    }
  }, [])

// Live stats derived from the real registered-user count (see /api/stats).
  const liveStats = useStats()
  const stats = [
  { value: liveStats.users, suffix: "+", label: "Users" },
  { value: liveStats.workoutsTracked, suffix: "+", label: "Workouts Tracked" },
  { value: liveStats.satisfaction, suffix: "%", label: "Satisfaction" },
  ]

  return (
    <>
      <section id="begin" ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background with Jaw-Dropping Effects */}
        <motion.div 
          style={{ y, scale }}
          className="absolute inset-0"
        >
          {/* Base gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-200" />

          {/* Subtle motivational fitness video (behind all hero content) */}
          <HeroVideoBackground />
          
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
          
          {/* Floating Fitness Elements - Smooth floating with fade effect */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Desktop floating elements */}
            {floatingElements.map((element, i) => (
              <motion.div
                key={`floating-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  y: [20, -20, -25, -10],
                  x: [0, i % 2 === 0 ? 8 : -8, i % 2 === 0 ? -5 : 5, 0],
                }}
                transition={{
                  duration: element.duration,
                  repeat: Infinity,
                  delay: element.delay,
                  ease: "easeInOut",
                  times: [0, 0.15, 0.85, 1]
                }}
                className="absolute hidden sm:block will-change-transform"
                style={{
                  left: element.x,
                  top: element.y,
                }}
              >
                <div className="p-2.5 rounded-xl bg-white/95 border border-emerald-500/20 shadow-md backdrop-blur-sm">
                  <element.icon 
                    size={element.size} 
                    className="text-emerald-600"
                    strokeWidth={1.5}
                  />
                </div>
              </motion.div>
            ))}
            {/* Mobile floating elements */}
            {floatingElements.map((element, i) => (
              <motion.div
                key={`floating-mobile-${i}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ 
                  opacity: [0, 0.9, 0.9, 0],
                  y: [15, -15, -18, -5],
                }}
                transition={{
                  duration: element.duration + 0.5,
                  repeat: Infinity,
                  delay: element.delay,
                  ease: "easeInOut",
                  times: [0, 0.15, 0.85, 1]
                }}
                className="absolute sm:hidden will-change-transform"
                style={{
                  left: element.mobileX,
                  top: element.mobileY,
                }}
              >
                <div className="p-1.5 rounded-lg bg-white/90 border border-emerald-500/15 shadow-sm">
                  <element.icon 
                    size={element.mobileSize} 
                    className="text-emerald-600"
                    strokeWidth={1.5}
                  />
                </div>
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
        <div
          className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-12 sm:py-28 md:py-32 text-center"
        >
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 sm:mb-10"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-foreground/5 border border-foreground/10 text-xs sm:text-sm font-medium text-foreground">
              <Sparkles size={14} className="text-foreground sm:w-4 sm:h-4" />
              Identity-Driven Transformation
              <ChevronRight size={12} className="text-muted-foreground sm:w-3.5 sm:h-3.5" />
            </span>
          </motion.div>

          {/* Main Heading */}
          <div className="mb-5 sm:mb-10">
            <h1 className="text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold tracking-tight leading-[1.05] sm:leading-[1] [text-shadow:0_1px_20px_rgb(255_255_255_/_0.9)]">
              <div className="overflow-hidden">
                <motion.span 
                  className="block text-foreground"
                  initial={{ opacity: 0, y: 100, rotateX: -45 }}
                  animate={isLoaded ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                  transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  You Were Never
                </motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.span 
                  className="block text-foreground"
                  initial={{ opacity: 0, y: 100, rotateX: -45 }}
                  animate={isLoaded ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                  transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  Meant to Stay
                </motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.span 
                  className="block text-muted-foreground/70"
                  initial={{ opacity: 0, y: 100, rotateX: -45 }}
                  animate={isLoaded ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                  transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  The Same.
                </motion.span>
              </div>
            </h1>
          </div>

          {/* Emotional Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-6 px-2 [text-shadow:0_1px_14px_rgb(255_255_255_/_0.85)]"
          >
            Real fitness is not motivation. It is identity built through daily repetition.
          </motion.p>
          
          {/* Supporting Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="text-sm sm:text-base text-muted-foreground/70 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-14 px-2 [text-shadow:0_1px_12px_rgb(255_255_255_/_0.8)]"
          >
            An AI-powered fitness system that understands your habits, adapts to your lifestyle, and builds the future version of you — step by step.
          </motion.p>

          {/* Auth Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 px-2"
          >
            {isSignedIn ? (
              <>
                {/* Signed-in: route to dashboard / partner instead of auth */}
                <MagneticButton
                  onClick={() => { window.location.href = "/#score" }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-foreground text-background rounded-full font-semibold text-sm sm:text-base shadow-lg"
                >
                  <Check size={16} className="sm:w-[18px] sm:h-[18px]" />
                  Go to Dashboard
                </MagneticButton>
                <MagneticButton
                  onClick={() => { window.location.href = "/#members" }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-background/90 text-foreground border border-border rounded-full font-semibold text-sm sm:text-base"
                >
                  Find a Partner
                  <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                </MagneticButton>
              </>
            ) : (
              <>
                {/* Start Transformation CTA */}
                <MagneticButton 
                  onClick={() => openAuth("signup")}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-foreground text-background rounded-full font-semibold text-sm sm:text-base shadow-lg"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign up with Google
                </MagneticButton>

                {/* Email Sign Up */}
                <MagneticButton 
                  onClick={() => openAuth("signup")}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-background/90 text-muted-foreground border border-border rounded-full font-medium text-sm sm:text-base"
                >
                  <Mail size={16} className="sm:w-[18px] sm:h-[18px]" />
                  Sign up with Email
                  <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                </MagneticButton>
              </>
            )}
          </motion.div>

          {/* Sign In Link (signed-out only) */}
          {!isSignedIn && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={isLoaded ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 1.25 }}
              className="text-sm text-muted-foreground mb-16"
            >
              Already have an account?{" "}
              <button 
                onClick={() => openAuth("signin")}
                className="text-foreground font-medium hover:underline underline-offset-4 transition-all"
              >
                Sign in
              </button>
            </motion.p>
          )}

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-10 md:gap-16 mb-8 sm:mb-16 w-full max-w-xs sm:max-w-none mx-auto px-2"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                }}
                className="text-center"
              >
                <div className="text-xl sm:text-3xl md:text-4xl font-bold text-foreground mb-0.5">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[9px] sm:text-xs text-muted-foreground tracking-wide uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Instagram Highlight Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: "easeOut" }}
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
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-4 text-sm text-muted-foreground"
            >
              Daily tips, workout inspiration & community updates
            </motion.p>
          </motion.div>
        </div>

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
            onClick={() => { setShowAuthModal(false); resetAuthState(); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => { setShowAuthModal(false); resetAuthState(); }}
                aria-label="Close"
                className="absolute right-3 top-3 z-10 p-2 rounded-full text-muted-foreground hover:bg-accent transition-colors"
              >
                <X size={18} />
              </button>
              <div className="p-6">
                {/* Logo with animated effects */}
                <div className="flex justify-center mb-4">
                  <motion.div 
                    className="relative"
                    animate={{ 
                      boxShadow: [
                        "0 0 0 0 rgba(16, 185, 129, 0)",
                        "0 0 0 4px rgba(16, 185, 129, 0.1)",
                        "0 0 0 0 rgba(16, 185, 129, 0)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Image
                      src="/images/fitacle-logo.png"
                      alt="FITACLE"
                      width={36}
                      height={36}
                      className="rounded-lg shadow-md object-contain"
                      style={{ objectFit: 'contain' }}
                    />
                  </motion.div>
                </div>

                <h2 className="text-xl font-bold text-center text-foreground mb-1">
                  {authMode === "signup" ? "Create your account" : authMode === "reset" ? "Reset your password" : "Welcome back"}
                </h2>
                <p className="text-center text-muted-foreground text-sm mb-5">
                  {authMode === "signup" 
                    ? "Start your fitness journey today" 
                    : authMode === "reset"
                    ? "Enter your email and we'll send you a reset link"
                    : "Sign in to continue your journey"
                  }
                </p>

                {/* Success Message - Magical Effect */}
                {authSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", damping: 15, stiffness: 300 }}
                    className="p-6 mb-4 bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10 border border-emerald-500/20 rounded-2xl text-center relative overflow-hidden"
                  >
                    {/* Close button - works on mobile and desktop */}
                    <button
                      type="button"
                      onClick={() => setAuthSuccess(null)}
                      aria-label="Close"
                      className="absolute top-2 right-2 z-20 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/10 active:bg-foreground/20 transition-colors"
                    >
                      <X size={18} />
                    </button>

                    {/* Sparkle effects */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-xl"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-tr from-teal-400/20 to-transparent rounded-full blur-lg"
                    />
                    
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", damping: 12 }}
                      className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center"
                    >
                      <motion.div
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        <Check size={28} className="text-emerald-500" />
                      </motion.div>
                    </motion.div>
                    
                    {authSuccess === "reset" ? (
                      <>
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-lg font-bold text-emerald-600 mb-1"
                        >
                          Check your email
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="text-sm text-muted-foreground"
                        >
                          We&apos;ve sent a password reset link to your inbox.
                        </motion.p>
                      </>
                    ) : authSuccess === "signup" ? (
                      <>
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-lg font-bold text-emerald-600 mb-1"
                        >
                          Signup Successful
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="text-base font-semibold text-foreground mb-1"
                        >
                          Welcome to Fitacle!
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="text-sm text-muted-foreground"
                        >
                          The version of you you&apos;ve imagined starts now.
                        </motion.p>
                      </>
                    ) : (
                      <>
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-lg font-bold text-emerald-600 mb-1"
                        >
                          Login Successful!
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="text-base font-semibold text-foreground mb-1"
                        >
                          Welcome back
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="text-sm text-muted-foreground"
                        >
                          Keep moving forward
                        </motion.p>
                      </>
                    )}
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="mt-4 flex justify-center gap-1"
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                          className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                )}

                {/* Error Message */}
                {authError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600"
                  >
                    <AlertCircle size={18} />
                    <span className="text-sm">{authError}</span>
                  </motion.div>
                )}

                {/* Google Button (hidden in reset mode) */}
                {authMode !== "reset" && (
                <motion.button
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting || isSignedIn}
                  whileHover={{ scale: (isSubmitting || isSignedIn) ? 1 : 1.01 }}
                  whileTap={{ scale: (isSubmitting || isSignedIn) ? 1 : 0.99 }}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm mb-3 shadow-md transition-all ${
                    isSignedIn 
                      ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30 cursor-not-allowed' 
                      : 'bg-foreground text-background hover:shadow-lg disabled:opacity-70'
                  }`}
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : isSignedIn ? (
                    <>
                      <Check size={18} />
                      Already signed in
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </motion.button>
                )}

                {/* Divider (hidden in reset mode) */}
                {authMode !== "reset" && (
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                )}

                {/* Email Form */}
                <form
                  className="space-y-3"
                  onSubmit={
                    authMode === "signup"
                      ? handleEmailSignUp
                      : authMode === "reset"
                      ? handleForgotPassword
                      : handleEmailSignIn
                  }
                >
                  {authMode === "signup" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">First Name</label>
                        <input
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">Last Name</label>
                        <input
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Email</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                      required
                    />
                  </div>
                  {authMode !== "reset" && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-medium text-foreground">Password</label>
                        {authMode === "signin" && (
                          <button
                            type="button"
                            onClick={() => { setAuthMode("reset"); resetAuthState(); }}
                            className="text-xs text-emerald-600 font-medium hover:underline"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                        required
                        minLength={6}
                      />
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isSubmitting || isSignedIn}
                    whileHover={{ scale: (isSubmitting || isSignedIn) ? 1 : 1.01 }}
                    whileTap={{ scale: (isSubmitting || isSignedIn) ? 1 : 0.99 }}
                    className={`w-full py-2.5 rounded-lg font-medium text-sm shadow-md transition-all mt-1 flex items-center justify-center gap-2 ${
                      isSignedIn
                        ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30 cursor-not-allowed'
                        : 'bg-foreground text-background hover:shadow-lg disabled:opacity-70'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        {authMode === "signup" ? "Creating..." : authMode === "reset" ? "Sending..." : "Signing In..."}
                      </>
                    ) : isSignedIn ? (
                      <>
                        <Check size={16} />
                        Already signed in
                      </>
                    ) : (
                      authMode === "signup" ? "Create Account" : authMode === "reset" ? "Send Reset Link" : "Sign In"
                    )}
                  </motion.button>
                </form>

                {/* Toggle Auth Mode */}
                <p className="text-center text-xs text-muted-foreground mt-4">
                  {authMode === "signup" ? (
                    <>
                      Already have an account?{" "}
                      <button 
                        onClick={() => { setAuthMode("signin"); resetAuthState(); }}
                        className="text-foreground font-medium hover:underline"
                      >
                        Sign in
                      </button>
                    </>
                  ) : authMode === "reset" ? (
                    <>
                      Remembered it?{" "}
                      <button 
                        onClick={() => { setAuthMode("signin"); resetAuthState(); }}
                        className="text-foreground font-medium hover:underline"
                      >
                        Back to sign in
                      </button>
                    </>
                  ) : (
                    <>
                      Don&apos;t have an account?{" "}
                      <button 
                        onClick={() => { setAuthMode("signup"); resetAuthState(); }}
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

      {/* Google Auth Success Modal */}
      <AnimatePresence>
        {showGoogleAuthSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => setShowGoogleAuthSuccess(null)}
              aria-label="Close"
              className="absolute right-4 top-4 p-2 rounded-full text-muted-foreground hover:bg-accent transition-colors"
            >
              <X size={20} />
            </button>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="text-center max-w-sm"
            >
              {/* Sparkle effects */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-emerald-400/30 to-transparent rounded-full blur-2xl"
              />
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-teal-400/30 to-transparent rounded-full blur-xl"
              />
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 15 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center relative"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-emerald-500/10"
                />
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="w-12 h-12 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              </motion.div>
              
              {showGoogleAuthSuccess === 'signup' ? (
                <>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-bold text-emerald-600 mb-2"
                  >
                    Google Sign Up Successful
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg font-semibold text-foreground mb-1"
                  >
                    Welcome to Fitacle
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-muted-foreground"
                  >
                    Your fitness journey just got smarter.
                  </motion.p>
                </>
              ) : (
                <>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-bold text-emerald-600 mb-2"
                  >
                    Google Login Successful
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg font-semibold text-foreground mb-1"
                  >
                    Welcome back
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-muted-foreground"
                  >
                    Consistency looks good on you.
                  </motion.p>
                </>
              )}
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 flex justify-center gap-1.5"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                    className="w-2 h-2 rounded-full bg-emerald-500"
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
