"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowRight, LogOut, User, Edit2, Instagram, Mail } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface NavbarProps {
  onSignIn?: () => void
}

export function Navbar({ onSignIn }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: "",
    instagramId: "",
    gymName: "",
    height: "",
    weight: "",
    age: "",
    fitnessGoal: ""
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Check for logged in user
  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient()
        if (!supabase) return
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        if (user) {
          setProfileData({
            fullName: user.user_metadata?.full_name || "",
            instagramId: user.user_metadata?.instagram_id || "",
            gymName: user.user_metadata?.gym_name || "",
            height: user.user_metadata?.height || "",
            weight: user.user_metadata?.weight || "",
            age: user.user_metadata?.age || "",
            fitnessGoal: user.user_metadata?.fitness_goal || ""
          })
        }
      } catch {
        // Supabase not configured yet
      }
    }
    checkUser()
  }, [])

  const handleProfileUpdate = async () => {
    if (!user) return
    setProfileError(null)
    setProfileSuccess(null)

    // Validation
    if (profileData.height && (parseInt(profileData.height) < 100 || parseInt(profileData.height) > 250)) {
      setProfileError("Height must be between 100-250 cm")
      return
    }
    if (profileData.weight && (parseInt(profileData.weight) < 30 || parseInt(profileData.weight) > 300)) {
      setProfileError("Weight must be between 30-300 kg")
      return
    }
    if (profileData.age && (parseInt(profileData.age) < 13 || parseInt(profileData.age) > 100)) {
      setProfileError("Age must be between 13-100 years")
      return
    }

    setIsUpdating(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.fullName,
          instagram_id: profileData.instagramId,
          gym_name: profileData.gymName,
          height: profileData.height,
          weight: profileData.weight,
          age: profileData.age,
          fitness_goal: profileData.fitnessGoal
        }
      })
      if (!error) {
        setProfileSuccess("Profile updated successfully!")
        setTimeout(() => {
          setShowProfileEdit(false)
          setProfileSuccess(null)
          window.location.reload()
        }, 1500)
      } else {
        setProfileError(error.message)
      }
    } catch {
      setProfileError("Something went wrong. Please try again.")
    }
    setIsUpdating(false)
  }

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
    { href: "#partner", label: "Never Train Alone" },
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
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
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
          {navLinks.map((link, index) => (
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
          ))}
          
          
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            /* User is logged in - show user menu */
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
                    <button
                      onClick={() => { setShowProfileEdit(true); setShowUserMenu(false) }}
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden glass-card mx-4 mt-3 rounded-2xl"
          >
            <div className="p-6 flex flex-col gap-2">
              {/* Logo in mobile menu */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
<Image
                    src="/images/fitacle-logo.png"
                    alt="FITACLE Logo"
                    width={40}
                    height={40}
                    style={{ objectFit: 'contain' }}
                  className="rounded-xl"
                />
                <div>
                  <span className="text-lg font-bold text-foreground">F<span className="text-emerald-600">i</span>tacle</span>
                  <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Transform Beyond Limits</p>
                </div>
              </div>
              
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="text-foreground hover:text-primary transition-colors py-3 font-medium rounded-xl hover:bg-foreground/5 px-4 -mx-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              
              {/* Instagram Link - Highlighted in Mobile */}
              <motion.a
                href="https://instagram.com/fitacle_official"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="flex items-center gap-3 py-3 px-4 -mx-4 rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-pink-500/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                  <Instagram size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Follow us</p>
                  <p className="text-foreground font-medium">@fitacle_official</p>
                </div>
              </motion.a>
              
              {/* Contact Email in Mobile */}
              <motion.a
                href="mailto:contact@fitacle.com"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-3 font-medium rounded-xl hover:bg-foreground/5 px-4 -mx-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Mail size={16} />
                contact@fitacle.com
              </motion.a>
              
              <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-border">
                {user ? (
                  /* User logged in - show user info */
                  <>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.25 }}
                      className="flex items-center gap-3 py-3 px-4 -mx-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold">
                        {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </motion.div>
                    <motion.button 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.28 }}
                      onClick={() => { setShowProfileEdit(true); setMobileMenuOpen(false) }}
                      className="py-3 text-foreground font-medium rounded-xl hover:bg-accent transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit Profile
                    </motion.button>
                    <motion.button 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.32 }}
                      onClick={handleSignOut}
                      className="py-3 text-red-500 font-medium rounded-xl hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </motion.button>
                  </>
                ) : (
                  /* User not logged in */
                  <>
                    <motion.button 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.25 }}
                      className="py-3 text-foreground font-medium rounded-xl hover:bg-foreground/5 transition-colors text-center"
                      onClick={() => { setMobileMenuOpen(false); onSignIn?.(); }}
                    >
                      Sign In
                    </motion.button>
                    <motion.button 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="py-3 bg-foreground text-background rounded-full font-semibold shadow-md flex items-center justify-center gap-2"
                      onClick={() => { setMobileMenuOpen(false); onSignIn?.(); }}
                    >
                      Get Started
                      <ArrowRight size={16} />
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {showProfileEdit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowProfileEdit(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">Edit Profile</h3>
                <button
                  onClick={() => setShowProfileEdit(false)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Success/Error Messages */}
              {profileSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 mb-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">{profileSuccess}</span>
                </motion.div>
              )}
              {profileError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm">{profileError}</span>
                </motion.div>
              )}

              {/* Avatar - Initial Letter */}
              <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {profileData.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
              </div>

              {/* Form - Scrollable */}
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-foreground mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      className="w-full px-3 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-foreground mb-1">Email</label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-3 py-2.5 bg-accent border border-border rounded-xl text-muted-foreground cursor-not-allowed text-sm"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-foreground mb-1">Instagram ID</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                      <input
                        type="text"
                        value={profileData.instagramId}
                        onChange={(e) => setProfileData({ ...profileData, instagramId: e.target.value.replace('@', '') })}
                        className="w-full pl-7 pr-3 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
                        placeholder="username"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-foreground mb-1">Gym Name</label>
                    <input
                      type="text"
                      value={profileData.gymName}
                      onChange={(e) => setProfileData({ ...profileData, gymName: e.target.value })}
                      className="w-full px-3 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
                      placeholder="Where do you train?"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Height (cm)</label>
                    <input
                      type="number"
                      value={profileData.height}
                      onChange={(e) => setProfileData({ ...profileData, height: e.target.value })}
                      className="w-full px-3 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
                      placeholder="170"
                      min="100"
                      max="250"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={profileData.weight}
                      onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
                      className="w-full px-3 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
                      placeholder="70"
                      min="30"
                      max="300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Age</label>
                    <input
                      type="number"
                      value={profileData.age}
                      onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                      className="w-full px-3 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
                      placeholder="25"
                      min="13"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Fitness Goal</label>
                    <select
                      value={profileData.fitnessGoal}
                      onChange={(e) => setProfileData({ ...profileData, fitnessGoal: e.target.value })}
                      className="w-full px-3 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="fat_loss">Fat Loss</option>
                      <option value="muscle_gain">Muscle Gain</option>
                      <option value="maintain">Maintain</option>
                      <option value="strength">Build Strength</option>
                      <option value="endurance">Improve Endurance</option>
                    </select>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleProfileUpdate}
                  disabled={isUpdating}
                  className="w-full py-3 bg-foreground text-background rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-foreground/90 transition-all disabled:opacity-50 mt-4"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </motion.button>
              </div>
            </motion.div>
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
    </motion.nav>
  )
}
