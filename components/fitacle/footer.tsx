"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { Instagram, Twitter, Youtube, Linkedin, Mail, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react"
import Image from "next/image"
import { useRef, useEffect, useState } from "react"

const footerLinks = {
  product: [
    { label: "Body Analyzer", href: "#analyzer" },
    { label: "Daily Plans", href: "#plan" },
    { label: "Gym Partner", href: "#partner" },
    { label: "Fitacle Score", href: "#score" },
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press Kit", href: "#" },
    { label: "Contact", href: "mailto:contact@fitacle.com" },
  ],
  resources: [
    { label: "Blog", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Community", href: "#" },
    { label: "API Docs", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
}

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/fitacle_official", label: "Instagram", highlight: true },
  { icon: Twitter, href: "#", label: "Twitter", highlight: false },
  { icon: Youtube, href: "#", label: "YouTube", highlight: false },
  { icon: Linkedin, href: "#", label: "LinkedIn", highlight: false },
]

// Particle animation component for the footer finale
function ParticleField() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-emerald-500/20 to-green-400/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Animated text that reveals character by character
function AnimatedText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: i * 0.03,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

// Morphing shapes animation
function MorphingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {/* Large morphing blob 1 */}
      <motion.div
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-500/30 via-green-400/20 to-transparent blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Large morphing blob 2 */}
      <motion.div
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-tl from-emerald-400/25 via-green-500/15 to-transparent blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -40, 0],
          y: [0, -30, 0],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Center glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-emerald-500/10 via-transparent to-transparent blur-2xl"
        animate={{
          scale: [0.8, 1.1, 0.8],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

// Animated counter for the finale section
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
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
  }, [value, isVisible])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

// Finale experience component
function FinaleExperience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.8]), { stiffness: 100, damping: 30 })
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5], [0.9, 1]), { stiffness: 100, damping: 30 })
  const y = useSpring(useTransform(scrollYProgress, [0, 0.5], [50, 0]), { stiffness: 100, damping: 30 })

  const fitnessIcons = [
    { icon: "💪", x: "10%", y: "20%", delay: 0 },
    { icon: "🏃", x: "85%", y: "15%", delay: 0.5 },
    { icon: "🥗", x: "15%", y: "70%", delay: 1 },
    { icon: "🎯", x: "80%", y: "75%", delay: 1.5 },
    { icon: "⚡", x: "50%", y: "10%", delay: 2 },
    { icon: "🔥", x: "5%", y: "45%", delay: 2.5 },
    { icon: "💚", x: "92%", y: "50%", delay: 3 },
    { icon: "🏆", x: "45%", y: "85%", delay: 3.5 },
  ]

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity, scale, y }}
      className="relative py-16 sm:py-24 md:py-32 overflow-hidden"
    >
      {/* Animated background elements */}
      <MorphingShapes />
      <ParticleField />

      {/* Floating emoji icons */}
      <div className="absolute inset-0 pointer-events-none">
        {fitnessIcons.map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl sm:text-3xl md:text-4xl"
            style={{ left: item.x, top: item.y }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: item.delay * 0.3, duration: 0.5, type: "spring" }}
          >
            <motion.span
              animate={{
                y: [-10, 10, -10],
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="block"
            >
              {item.icon}
            </motion.span>
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 text-center">
        {/* Sparkle burst */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex justify-center mb-6 sm:mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-emerald-500 via-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
            </div>
            {/* Orbiting dots */}
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-emerald-400"
                style={{
                  top: "50%",
                  left: "50%",
                }}
                animate={{
                  x: [0, Math.cos(i * Math.PI / 2) * 50, 0],
                  y: [0, Math.sin(i * Math.PI / 2) * 50, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.75,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Animated headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-foreground tracking-tight"
        >
          <AnimatedText text="Your Journey" className="block" />
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="block bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 bg-clip-text text-transparent"
          >
            Starts Now
          </motion.span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed"
        >
          Join thousands who have already transformed their lives with FITACLE. 
          Your best self is just one decision away.
        </motion.p>

        {/* Animated stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto mb-8 sm:mb-12"
        >
          {[
            { value: 847, suffix: "+", label: "Active Users" },
            { value: 12, suffix: "K+", label: "Workouts Done" },
            { value: 94, suffix: "%", label: "Success Rate" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 1.4 + i * 0.1 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1"
              >
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </motion.div>
              <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA with animated border */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="relative inline-block"
        >
          <motion.div
            className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600 opacity-70 blur-md"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.a
            href="#analyzer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-5 bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-500 text-white rounded-full font-semibold text-sm sm:text-lg shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300"
          >
            <span>Begin Your Transformation</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight size={18} className="sm:w-5 sm:h-5" />
            </motion.span>
          </motion.a>
        </motion.div>

        {/* Animated line decoration */}
        <div className="mt-12 sm:mt-16 flex items-center justify-center gap-2 sm:gap-4">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 2 }}
            className="h-px bg-gradient-to-r from-transparent to-border sm:w-20"
          />
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 2.2, type: "spring" }}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          </motion.div>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 2 }}
            className="h-px bg-gradient-to-l from-transparent to-border sm:w-20"
          />
        </div>
      </div>
    </motion.div>
  )
}

export function Footer() {
  return (
    <footer className="relative pt-0 pb-12 bg-background overflow-hidden">
      {/* Amazing Finale Animation Section */}
      <FinaleExperience />
      
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent/30 via-transparent to-transparent pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-6 relative">
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-foreground rounded-3xl p-12 md:p-16 mb-20 text-center overflow-hidden"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/2 -right-1/4 w-full h-full rounded-full bg-background/5 blur-3xl"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-1/2 -left-1/4 w-full h-full rounded-full bg-background/5 blur-3xl"
            />
          </div>
          
          <div className="relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-background tracking-tight text-balance"
            >
              Ready to Start Your
              <br />
              Transformation?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-background/70 text-lg max-w-xl mx-auto mb-8"
            >
              Join thousands of people who have transformed their bodies and lives with FITACLE.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.a
                href="#analyzer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 px-8 py-4 bg-background text-foreground rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </motion.a>
              <span className="text-background/60 text-sm">No credit card required</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <motion.a 
              href="#" 
              className="flex items-center gap-3 mb-5 group"
              whileHover={{ scale: 1.02 }}
            >
              {/* Animated logo with glow */}
              <div className="relative">
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-green-500/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <Image
                  src="/images/fitacle-logo.png"
                  alt="FITACLE Logo"
                  width={44}
                  height={44}
                  className="relative rounded-xl shadow-lg"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-foreground">
                  F<span className="text-emerald-600">i</span>tacle
                </span>
                <span className="text-[9px] tracking-[0.15em] text-muted-foreground uppercase">
                  Transform Beyond Limits
                </span>
              </div>
            </motion.a>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-xs">
              Your AI-powered fitness companion for lasting transformation and sustainable results.
            </p>
            
            {/* Contact Email - Prominent */}
            <motion.a
              href="mailto:contact@fitacle.com"
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent border border-border rounded-xl text-sm font-medium text-foreground hover:bg-accent/80 transition-all duration-300 mb-6"
            >
              <Mail size={16} />
              contact@fitacle.com
              <ArrowUpRight size={14} className="text-muted-foreground" />
            </motion.a>
            
            {/* Instagram Highlight Banner */}
            <motion.a
              href="https://instagram.com/fitacle_official"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="group flex items-center gap-3 p-3 mb-4 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300"
            >
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg"
              >
                <Instagram size={18} className="text-white" />
              </motion.div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Follow us on Instagram</p>
                <p className="text-sm font-semibold text-foreground group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-orange-600 group-hover:bg-clip-text transition-all">@fitacle_official</p>
              </div>
              <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-pink-500 transition-colors" />
            </motion.a>
            
            <div className="flex gap-2">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={social.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2.5 rounded-xl border transition-all duration-300 ${
                    social.highlight 
                      ? "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white border-transparent hover:shadow-lg hover:shadow-pink-500/20" 
                      : "bg-accent border-border hover:bg-foreground hover:text-background hover:border-foreground"
                  }`}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-5">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <motion.li 
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block hover:translate-x-1 transform"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-5">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <motion.li 
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block hover:translate-x-1 transform"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-5">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <motion.li 
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block hover:translate-x-1 transform"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-foreground mb-5">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get fitness tips and updates directly to your inbox.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full py-2.5 pl-10 pr-3 bg-accent border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all"
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-foreground rounded-xl text-background hover:bg-foreground/90 transition-colors shadow-md hover:shadow-lg"
              >
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FITACLE. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {footerLinks.legal.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
