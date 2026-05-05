"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Mail, Instagram, ArrowRight } from "lucide-react"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
        {/* Logo */}
        <motion.a 
          href="#" 
          className="flex items-center gap-2.5 group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="h-10 w-10 rounded-xl bg-foreground flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            <span className="text-background font-bold text-base">F</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">FITACLE</span>
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
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground rounded-full group-hover:w-full transition-all duration-300" />
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
          <motion.button 
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-foreground text-background rounded-full hover:bg-foreground/90 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Get Started
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
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
                <motion.button 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                  className="py-3 text-foreground font-medium rounded-xl hover:bg-foreground/5 transition-colors"
                >
                  Sign In
                </motion.button>
                <motion.button 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="py-3 bg-foreground text-background rounded-full font-semibold shadow-md flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
