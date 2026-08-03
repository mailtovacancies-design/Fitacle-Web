"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowRight, LogOut, User, Edit2, Instagram, Mail, Dumbbell, Heart, Apple, Flame, Zap, Target, Users, LayoutDashboard, Download } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { ProfileModal } from "@/components/fitacle/profile-modal"
import { NotificationsBell } from "@/components/fitacle/notifications-bell"
import { usePWA } from "@/components/pwa/pwa-context"

interface NavbarProps {
  onSignIn?: () => void
}

export function Navbar({ onSignIn }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const { installable, promptInstall } = usePWA()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${window.scrollY}px`
    } else {
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
    }
  }, [mobileMenuOpen])

  // Check for logged in user
  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient()
        if (!supabase) return
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch {
        // Supabase not configured yet
      }
    }
    checkUser()
  }, [])

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      if (!supabase) return
      await supabase.auth.signOut()
      setUser(null)
      setShowUserMenu(false)
      setShowLogoutSuccess(true)
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch {
      // Handle error
    }
  }

  const navLinks = [
    { href: "#begin", label: "Begin" },
    { href: "#analyzer", label: "Body Intelligence" },
    { href: "#plan", label: "AI Plan" },
    { href: "#transformation", label: "Progress" },
    { href: "#members", label: "Find a Training Partner" },
  ]

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-card py-3"
          : "bg-transparent py-5"
      }`}
    >
      {/* Floating Elements - Transparent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { icon: Dumbbell, x: "8%", delay: 0, duration: 7 },
          { icon: Heart, x: "25%", delay: 1.5, duration: 6 },
          { icon: Apple, x: "42%", delay: 3, duration: 8 },
          { icon: Flame, x: "58%", delay: 0.5, duration: 6.5 },
          { icon: Zap, x: "75%", delay: 2, duration: 7.5 },
          { icon: Target, x: "92%", delay: 1, duration: 6 },
        ].map((element, i) => (
          <motion.div
            key={`nav-float-${i}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: [0, 0.4, 0.4, 0],
              y: [10, -5, -8, 5],
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut",
              times: [0, 0.2, 0.8, 1]
            }}
            className="absolute hidden sm:block will-change-transform"
            style={{
              left: element.x,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <div className="p-1.5 rounded-lg bg-white/5 border border-emerald-500/10 backdrop-blur-[2px]">
              <element.icon 
                size={14} 
                className="text-emerald-500/40"
                strokeWidth={1.5}
              />
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between relative z-10">
        {/* Animated Logo */}
        <motion.a 
          href="#" 
          className="flex items-center gap-3 group relative"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Animated glow effect behind logo */}
          <motion.div
            className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Logo with animated ring */}
          <div className="relative">
            {/* Pulsing ring effect */}
            <motion.div
              className="absolute -inset-1 rounded-xl border-2 border-emerald-500/30"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Rotating highlight */}
            <motion.div
              className="absolute -inset-1 rounded-xl overflow-hidden"
              style={{ opacity: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
                animate={{
                  x: ["-200%", "200%"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 2
                }}
              />
            </motion.div>
            
            <Image
              src="/images/fitacle-logo.png"
              alt="FITACLE Logo"
              width={60}
              height={60}
              className="relative rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300 object-contain"
              style={{ objectFit: 'contain' }}
            />
          </div>
          
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-baseline">
              F<span className="text-emerald-600">i</span>tacle
            </span>
            <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              Transform Beyond
            </span>
          </div>
        </motion.a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) =>
            link.href === "#members" ? (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center gap-1.5 pl-3.5 pr-3.5 py-2 text-sm font-semibold text-white rounded-full bg-emerald-600 hover:bg-emerald-500 shadow-sm shadow-emerald-600/25 hover:shadow-md hover:shadow-emerald-500/30 transition-all duration-300 overflow-hidden"
              >
                {/* subtle shimmer sweep */}
                <motion.span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  animate={{ x: ["-150%", "150%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 3.5 }}
                />
                <Heart size={14} className="relative fill-white/90 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative">{link.label}</span>
              </motion.a>
            ) : (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 rounded-full group-hover:w-full transition-all duration-300" />
              </motion.a>
            )
          )}

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + navLinks.length * 0.1 }}
          >
            <Link
              href="/community"
              className="group relative inline-flex items-center gap-1.5 pl-3.5 pr-4 py-2 text-sm font-semibold text-emerald-700 rounded-full bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/15 hover:border-emerald-500/50 transition-all duration-300 overflow-hidden"
            >
              {/* subtle shimmer sweep */}
              <motion.span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent"
                animate={{ x: ["-150%", "150%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
              />
              {/* pulsing live dot badge */}
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <Users size={15} className="relative" />
              <span className="relative">Community</span>
            </Link>
          </motion.div>

          {installable && (
            <motion.button
              onClick={() => promptInstall()}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + navLinks.length * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-1.5 pl-3.5 pr-4 py-2 text-sm font-semibold text-emerald-700 rounded-full bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/15 hover:border-emerald-500/50 transition-all duration-300"
            >
              <Download size={15} className="relative transition-transform duration-300 group-hover:translate-y-0.5" />
              <span className="relative">Download App</span>
            </motion.button>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            /* User is logged in - show notifications + user menu */
            <div className="flex items-center gap-2">
            <NotificationsBell />
            <div className="relative">
              <motion.button 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold text-xs">
                  {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="max-w-[120px] truncate">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </motion.button>
              
              {/* User dropdown menu */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-border">
                      <p className="text-xs text-muted-foreground">Signed in as</p>
                      <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                    </div>
                    <a
                      href="/#score"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </a>
                    <button
                      onClick={() => { 
                        setShowUserMenu(false)
                        setShowProfileModal(true)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                    >
                      <Edit2 size={16} />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            </div>
          ) : (
            /* User is not logged in - show sign in/get started */
            <>
              <motion.button 
                onClick={onSignIn}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Sign In
              </motion.button>
              <motion.button 
                onClick={onSignIn}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-foreground text-background rounded-full hover:bg-foreground/90 transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Transformation
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
              </motion.button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-foreground p-2 rounded-xl hover:bg-foreground/5 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <AnimatePresence mode="wait">
            {mobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

{/* Mobile Menu - Full Screen Overlay */}
  <AnimatePresence>
  {mobileMenuOpen && (
  <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-[80] bg-background flex flex-col h-[100dvh] overflow-hidden"
          >
            {/* Floating Elements - Transparent Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[
                { icon: Dumbbell, x: "10%", y: "15%", delay: 0, duration: 8 },
                { icon: Heart, x: "85%", y: "20%", delay: 1.5, duration: 7 },
                { icon: Apple, x: "15%", y: "45%", delay: 2.5, duration: 9 },
                { icon: Flame, x: "80%", y: "55%", delay: 0.8, duration: 7.5 },
                { icon: Zap, x: "20%", y: "75%", delay: 1.2, duration: 8.5 },
                { icon: Target, x: "75%", y: "80%", delay: 2, duration: 7 },
              ].map((element, i) => (
                <motion.div
                  key={`mobile-float-${i}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: [0, 0.3, 0.3, 0],
                    scale: [0.8, 1, 1, 0.8],
                    y: [0, -10, -15, 0],
                  }}
                  transition={{
                    duration: element.duration,
                    repeat: Infinity,
                    delay: element.delay,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.8, 1]
                  }}
                  className="absolute will-change-transform"
                  style={{
                    left: element.x,
                    top: element.y,
                  }}
                >
                  <div className="p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <element.icon 
                      size={18} 
                      className="text-emerald-500/30"
                      strokeWidth={1.5}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Header with logo and close button */}
            <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                {/* Animated Logo */}
                <div className="relative w-10 h-10">
                  <motion.div
                    className="absolute -inset-0.5 rounded-lg overflow-hidden"
                    style={{ opacity: 0.3 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
                      animate={{ x: ["-200%", "200%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                    />
                  </motion.div>
                  <Image
                    src="/images/fitacle-logo.png"
                    alt="FITACLE Logo"
                    width={40}
                    height={40}
                    className="relative rounded-lg object-contain"
                  />
                </div>
                <div>
                  <span className="text-lg font-bold text-foreground">F<span className="text-emerald-600">i</span>tacle</span>
                  <p className="text-[9px] text-muted-foreground tracking-wider uppercase">Transform Beyond</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Navigation Links */}
              <div className="space-y-1">
                {navLinks.map((link, index) => {
                  const handleNavClick = (e: React.MouseEvent) => {
                    e.preventDefault()
                    setMobileMenuOpen(false)
                    const target = document.querySelector(link.href)
                    if (target) {
                      setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
                    }
                  }
                  return link.href === "#members" ? (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="relative flex items-center gap-2.5 text-white py-3 font-semibold rounded-xl bg-emerald-600 shadow-sm shadow-emerald-600/25 px-3.5 my-1 min-h-12 overflow-hidden active:scale-[0.98] transition-transform"
                      onClick={handleNavClick}
                    >
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ["-150%", "150%"] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 3.5 }}
                      />
                      <Heart size={18} className="relative fill-white/90" />
                      <span className="relative">{link.label}</span>
                      <span className="relative ml-auto text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/20 text-white">
                        New
                      </span>
                    </motion.a>
                  ) : (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="flex items-center text-foreground hover:text-primary transition-colors py-2.5 font-medium rounded-lg hover:bg-accent/50 px-3 min-h-11"
                      onClick={handleNavClick}
                    >
                      {link.label}
                    </motion.a>
                  )
                })}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: navLinks.length * 0.03 }}
                  className="pt-1"
                >
                  <Link
                    href="/community"
                    onClick={() => setMobileMenuOpen(false)}
                    className="relative flex items-center gap-2.5 text-emerald-700 py-3 font-semibold rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 overflow-hidden"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    <Users size={18} />
                    Community
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                      Join
                    </span>
                  </Link>
                </motion.div>

                {installable && (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: (navLinks.length + 1) * 0.03 }}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      promptInstall()
                    }}
                    className="relative flex w-full items-center gap-2.5 text-emerald-700 py-3 font-semibold rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 min-h-12 active:scale-[0.98] transition-transform"
                  >
                    <Download size={18} />
                    Download App
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                      Free
                    </span>
                  </motion.button>
                )}
              </div>
              
              {/* Social Links Row */}
              <div className="flex gap-2 mt-4">
                <motion.a
                  href="https://instagram.com/fitacle_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-pink-500/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Instagram size={16} className="text-pink-500" />
                  <span className="text-sm font-medium">@fitacle_official</span>
                </motion.a>
                <motion.a
                  href="mailto:contact@fitacle.com"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.12 }}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-accent/50 border border-border"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Mail size={16} className="text-muted-foreground" />
                </motion.a>
              </div>
            </div>
            
            {/* Footer with user actions - fixed at bottom */}
            <div className="shrink-0 p-4 border-t border-border bg-background">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
                      {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <a
                    href="/#score"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-sm text-foreground font-medium rounded-lg bg-accent hover:bg-accent/80 transition-colors flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard size={14} />
                    Dashboard
                  </a>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { 
                        setMobileMenuOpen(false)
                        setShowProfileModal(true)
                      }}
                      className="flex-1 py-2.5 text-sm text-foreground font-medium rounded-lg bg-accent hover:bg-accent/80 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit2 size={14} />
                      Edit Profile
                    </button>
                    <button 
                      onClick={handleSignOut}
                      className="py-2.5 px-4 text-sm text-red-500 font-medium rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <LogOut size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button 
                    className="flex-1 py-2.5 text-sm text-foreground font-medium rounded-lg bg-accent hover:bg-accent/80 transition-colors"
                    onClick={() => { setMobileMenuOpen(false); onSignIn?.(); }}
                  >
                    Sign In
                  </button>
                  <button 
                    className="flex-1 py-2.5 text-sm bg-foreground text-background rounded-lg font-semibold flex items-center justify-center gap-2"
                    onClick={() => { setMobileMenuOpen(false); onSignIn?.(); }}
                  >
                    Get Started
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Success Modal */}
      <AnimatePresence>
        {showLogoutSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => setShowLogoutSuccess(false)}
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
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 15 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center"
              >
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="w-10 h-10 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-foreground mb-2"
              >
                Logout Successful
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground"
              >
                You&apos;ve signed out safely.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground text-lg mt-1"
              >
                See you soon
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 flex justify-center gap-1"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full bg-emerald-500"
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Create/Edit Modal */}
      <ProfileModal open={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </motion.nav>
  )
}
