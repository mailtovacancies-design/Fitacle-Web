"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Mail, Instagram, ArrowRight, User, LogOut } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

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
      await supabase.auth.signOut()
      setUser(null)
      setShowUserMenu(false)
      window.location.reload()
    } catch {
      // Handle error
    }
  }

  const navLinks = [
    { href: "#analyzer", label: "Analyze" },
    { href: "#plan", label: "Plans" },
    { href: "#score", label: "Score" },
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
              className="relative rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
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
          
          {/* Instagram Link - Highlighted */}
          <motion.a
            href="https://instagram.com/fitacle_official"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-full border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 group"
          >
            <Instagram size={16} className="text-pink-500" />
            <span className="text-foreground">@fitacle_official</span>
          </motion.a>
          
          {/* Contact Email */}
          <motion.a
            href="mailto:contact@fitacle.com"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <Mail size={14} />
            Contact
          </motion.a>
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
              <motion.a 
                href="#get-started"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Sign In
              </motion.a>
              <motion.a 
                href="#get-started"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-foreground text-background rounded-full hover:bg-foreground/90 transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
              </motion.a>
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
                      transition={{ duration: 0.3, delay: 0.3 }}
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
                    <motion.a 
                      href="#get-started"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.25 }}
                      className="py-3 text-foreground font-medium rounded-xl hover:bg-foreground/5 transition-colors text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </motion.a>
                    <motion.a 
                      href="#get-started"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="py-3 bg-foreground text-background rounded-full font-semibold shadow-md flex items-center justify-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                      <ArrowRight size={16} />
                    </motion.a>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
