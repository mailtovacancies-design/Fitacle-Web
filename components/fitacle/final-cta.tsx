"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

interface FinalCTAProps {
  onStartTransformation?: () => void
}

// Simple stick figure SVG component
const StickFigure = ({ className, isGrey = true }: { className?: string, isGrey?: boolean }) => (
  <svg width="24" height="48" viewBox="0 0 24 48" className={className}>
    {/* Head */}
    <circle cx="12" cy="6" r="5" fill="currentColor" />
    {/* Body */}
    <line x1="12" y1="11" x2="12" y2="28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    {/* Arms */}
    <line x1="12" y1="16" x2="4" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="12" y1="16" x2="20" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    {/* Legs */}
    <line x1="12" y1="28" x2="6" y2="44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <line x1="12" y1="28" x2="18" y2="44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

export function FinalCTA({ onStartTransformation }: FinalCTAProps) {
  return (
    <section className="py-16 sm:py-20 bg-background relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        
        {/* Compact Transformation Animation */}
        <div className="relative h-20 sm:h-24 mb-8 flex items-center justify-center overflow-hidden">
          
          {/* Grey figures queue on the left - continuous flow */}
          <div className="absolute left-0 flex items-center gap-2 sm:gap-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ x: 0, opacity: 0.3 + i * 0.2 }}
                animate={{ 
                  x: [0, 60, 120, 180],
                  opacity: [0.3 + i * 0.2, 0.5, 0.7, 0]
                }}
                transition={{ 
                  duration: 3,
                  delay: i * 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="text-muted-foreground/40"
              >
                <StickFigure isGrey />
              </motion.div>
            ))}
          </div>

          {/* Center - Fitacle Logo (bigger) */}
          <motion.div 
            className="relative z-10 mx-8"
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="relative">
              <Image
                src="/fitacle-logo.png"
                alt="Fitacle"
                width={80}
                height={80}
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
              />
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-emerald-500/30"
                animate={{ 
                  scale: [1, 1.4, 1.4],
                  opacity: [0.5, 0, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            </div>
          </motion.div>

          {/* Green figures emerge on the right - continuous flow */}
          <div className="absolute right-0 flex items-center gap-2 sm:gap-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ x: -180, opacity: 0 }}
                animate={{ 
                  x: [-180, -120, -60, 0],
                  opacity: [0, 0.7, 0.9, 1]
                }}
                transition={{ 
                  duration: 3,
                  delay: i * 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="text-emerald-500"
              >
                <StickFigure isGrey={false} />
              </motion.div>
            ))}
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

          <button
            onClick={onStartTransformation}
            className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-foreground text-background rounded-full font-semibold text-sm sm:text-base shadow-xl hover:shadow-foreground/20 transition-all duration-300 hover:scale-105"
          >
            Step Through
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
