"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"

interface FinalCTAProps {
  onStartTransformation?: () => void
}

// Minimal bathroom-sign style person SVG
const PersonFigure = ({ variant = "grey" }: { variant?: "grey" | "green" }) => {
  const color = variant === "grey" ? "currentColor" : "#10b981"
  const opacity = variant === "grey" ? 0.4 : 1
  
  return (
    <svg width="28" height="52" viewBox="0 0 28 52" style={{ opacity }}>
      {/* Head */}
      <circle cx="14" cy="7" r="6" fill={color} />
      {/* Body - wider torso */}
      <path 
        d="M7 16 L21 16 L19 32 L9 32 Z" 
        fill={color}
      />
      {/* Arms */}
      <path 
        d="M7 16 L2 28" 
        stroke={color} 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      <path 
        d="M21 16 L26 28" 
        stroke={color} 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      {/* Legs */}
      <path 
        d="M9 32 L6 50" 
        stroke={color} 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      <path 
        d="M19 32 L22 50" 
        stroke={color} 
        strokeWidth="4" 
        strokeLinecap="round"
      />
    </svg>
  )
}

// Fit person - more confident posture
const FitPersonFigure = () => (
  <svg width="32" height="52" viewBox="0 0 32 52">
    {/* Head */}
    <circle cx="16" cy="7" r="6" fill="#10b981" />
    {/* Body - athletic V-shape torso */}
    <path 
      d="M6 16 L26 16 L22 32 L10 32 Z" 
      fill="#10b981"
    />
    {/* Arms - slightly raised, confident */}
    <path 
      d="M6 16 L1 26" 
      stroke="#10b981" 
      strokeWidth="4.5" 
      strokeLinecap="round"
    />
    <path 
      d="M26 16 L31 26" 
      stroke="#10b981" 
      strokeWidth="4.5" 
      strokeLinecap="round"
    />
    {/* Legs - strong stance */}
    <path 
      d="M10 32 L6 50" 
      stroke="#10b981" 
      strokeWidth="5" 
      strokeLinecap="round"
    />
    <path 
      d="M22 32 L26 50" 
      stroke="#10b981" 
      strokeWidth="5" 
      strokeLinecap="round"
    />
  </svg>
)

export function FinalCTA({ onStartTransformation }: FinalCTAProps) {
  const [currentPerson, setCurrentPerson] = useState(0)
  
  // Cycle through people every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPerson(prev => (prev + 1) % 4)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-12 sm:py-16 bg-background relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        
        {/* Compact Transformation Animation Container */}
        <div className="relative h-32 sm:h-36 mb-6 flex items-center justify-center">
          
          {/* Animation Track */}
          <div className="relative flex items-center justify-center w-full max-w-md">
            
            {/* Left side - Grey person walking in */}
            <div className="absolute left-0 sm:left-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`grey-${currentPerson}`}
                  initial={{ x: -40, opacity: 0, scale: 0.8 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ x: 60, opacity: 0, scale: 0.9 }}
                  transition={{ 
                    duration: 1.2,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  className="text-muted-foreground"
                >
                  <PersonFigure variant="grey" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dotted path line */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <motion.line
                x1="15%"
                y1="50%"
                x2="42%"
                y2="50%"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="text-muted-foreground/20"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <motion.line
                x1="58%"
                y1="50%"
                x2="85%"
                y2="50%"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="opacity-30"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1 }}
              />
            </svg>

            {/* Center - Fitacle Logo Portal */}
            <div className="relative z-10">
              {/* Outer glow rings */}
              <motion.div
                className="absolute -inset-4 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)"
                }}
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Pulse ring 1 */}
              <motion.div
                className="absolute -inset-2 rounded-full border border-emerald-500/40"
                animate={{ 
                  scale: [1, 1.8, 1.8],
                  opacity: [0.6, 0, 0]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
              
              {/* Pulse ring 2 - offset */}
              <motion.div
                className="absolute -inset-2 rounded-full border border-emerald-500/30"
                animate={{ 
                  scale: [1, 2, 2],
                  opacity: [0.4, 0, 0]
                }}
                transition={{ 
                  duration: 2.5,
                  delay: 0.5,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />

              {/* Logo container with breathing animation */}
              <motion.div
                animate={{ 
                  scale: [1, 1.08, 1],
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.6, 1]
                }}
                className="relative"
              >
                {/* Glow background */}
                <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-xl" />
                
                {/* Actual Logo */}
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_ug9hmdug9hmdug9h-HbOKJNuZtPbQW2u832B4ESSwd3Em5K.png"
                  alt="Fitacle"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain relative z-10"
                />
              </motion.div>

              {/* Transformation sparkles */}
              <AnimatePresence>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`sparkle-${currentPerson}-${i}`}
                    className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                    style={{
                      left: "50%",
                      top: "50%",
                    }}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{ 
                      scale: [0, 1, 0],
                      x: [0, (Math.cos(i * 60 * Math.PI / 180) * 50)],
                      y: [0, (Math.sin(i * 60 * Math.PI / 180) * 50)],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 1,
                      delay: 1.2 + i * 0.08,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Right side - Green fit person emerging */}
            <div className="absolute right-0 sm:right-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`green-${currentPerson}`}
                  initial={{ x: -60, opacity: 0, scale: 0.9 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ x: 40, opacity: 0 }}
                  transition={{ 
                    duration: 1.2,
                    delay: 1.3,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <FitPersonFigure />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Text content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            <span className="text-foreground">Your Transformation</span>
            <br />
            <span className="text-muted-foreground">Begins Here.</span>
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-8">
            One decision. One step through. A completely different version of you.
          </p>

          <motion.button
            onClick={onStartTransformation}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-foreground text-background rounded-full font-semibold text-sm sm:text-base shadow-xl hover:shadow-foreground/20 transition-all duration-300"
          >
            Step Through
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
