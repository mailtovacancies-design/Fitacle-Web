"use client"

import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useRef, useState, useEffect } from "react"

interface FinalCTAProps {
  onStartTransformation?: () => void
}

export function FinalCTA({ onStartTransformation }: FinalCTAProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    if (isInView) {
      // Start animation sequence
      const timer1 = setTimeout(() => setAnimationPhase(1), 500)  // Person starts walking
      const timer2 = setTimeout(() => setAnimationPhase(2), 2000) // Person enters logo
      const timer3 = setTimeout(() => setAnimationPhase(3), 2800) // Transformation
      const timer4 = setTimeout(() => setAnimationPhase(4), 3500) // Fit person exits
      
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
        clearTimeout(timer4)
      }
    }
  }, [isInView])

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/[0.02] to-transparent" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        {/* Transformation Animation */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="relative h-48 sm:h-64 mb-12 flex items-center justify-center"
        >
          {/* Journey Path Line */}
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-muted-foreground/20 to-transparent top-1/2 -translate-y-1/2" />
          
          {/* Fitacle Logo Portal in Center */}
          <motion.div 
            className="absolute left-1/2 -translate-x-1/2 z-10"
            animate={animationPhase >= 2 && animationPhase < 4 ? { 
              scale: [1, 1.2, 1],
              boxShadow: ["0 0 0 0 rgba(16,185,129,0)", "0 0 40px 20px rgba(16,185,129,0.3)", "0 0 0 0 rgba(16,185,129,0)"]
            } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 flex items-center justify-center bg-background transition-all duration-500 ${
              animationPhase >= 2 && animationPhase < 4 
                ? "border-emerald-500 shadow-lg shadow-emerald-500/30" 
                : "border-foreground/20"
            }`}>
              <span className={`text-2xl sm:text-3xl font-bold tracking-tight transition-colors duration-500 ${
                animationPhase >= 2 && animationPhase < 4 ? "text-emerald-500" : "text-foreground"
              }`}>
                F
              </span>
            </div>
          </motion.div>

          {/* Unfit Person (Before) */}
          <motion.div
            className="absolute z-20"
            initial={{ x: "-200px", opacity: 0 }}
            animate={
              animationPhase === 0 ? { x: "-200px", opacity: 0 } :
              animationPhase === 1 ? { x: "-60px", opacity: 1 } :
              animationPhase >= 2 ? { x: "0px", opacity: 0, scale: 0.5 } : {}
            }
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {/* Slouched/Tired Person SVG */}
            <svg width="60" height="100" viewBox="0 0 60 100" className="text-muted-foreground/60">
              {/* Head */}
              <circle cx="30" cy="15" r="10" fill="currentColor" />
              {/* Body - slouched */}
              <path 
                d="M30 25 Q35 45 32 55 L28 55 Q25 45 30 25" 
                fill="currentColor" 
                opacity="0.8"
              />
              {/* Arms - drooping */}
              <path 
                d="M30 30 Q15 45 12 55" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinecap="round"
                fill="none"
              />
              <path 
                d="M30 30 Q45 45 48 55" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinecap="round"
                fill="none"
              />
              {/* Legs - tired stance */}
              <path 
                d="M28 55 Q25 75 22 95" 
                stroke="currentColor" 
                strokeWidth="5" 
                strokeLinecap="round"
                fill="none"
              />
              <path 
                d="M32 55 Q35 75 38 95" 
                stroke="currentColor" 
                strokeWidth="5" 
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </motion.div>

          {/* Transformation Particles */}
          {animationPhase >= 2 && animationPhase < 4 && (
            <motion.div className="absolute left-1/2 -translate-x-1/2 z-5">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-emerald-500 rounded-full"
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    x: Math.cos(i * 45 * Math.PI / 180) * 60,
                    y: Math.sin(i * 45 * Math.PI / 180) * 60,
                  }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                />
              ))}
            </motion.div>
          )}

          {/* Fit Person (After) */}
          <motion.div
            className="absolute z-20"
            initial={{ x: "0px", opacity: 0, scale: 0.5 }}
            animate={
              animationPhase < 3 ? { x: "0px", opacity: 0, scale: 0.5 } :
              animationPhase === 3 ? { x: "0px", opacity: 1, scale: 1 } :
              animationPhase >= 4 ? { x: "80px", opacity: 1, scale: 1 } : {}
            }
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Strong/Confident Person SVG */}
            <svg width="60" height="100" viewBox="0 0 60 100" className="text-emerald-500">
              {/* Head */}
              <circle cx="30" cy="12" r="10" fill="currentColor" />
              {/* Body - upright, athletic */}
              <path 
                d="M25 22 L25 50 L35 50 L35 22 Z" 
                fill="currentColor" 
                opacity="0.9"
              />
              {/* Chest/Shoulders - broader */}
              <path 
                d="M20 25 Q30 20 40 25 L40 35 Q30 32 20 35 Z" 
                fill="currentColor"
              />
              {/* Arms - strong, slightly raised */}
              <path 
                d="M20 28 Q10 35 8 45 Q6 48 10 48" 
                stroke="currentColor" 
                strokeWidth="5" 
                strokeLinecap="round"
                fill="none"
              />
              <path 
                d="M40 28 Q50 35 52 45 Q54 48 50 48" 
                stroke="currentColor" 
                strokeWidth="5" 
                strokeLinecap="round"
                fill="none"
              />
              {/* Legs - strong stance */}
              <path 
                d="M27 50 L24 95" 
                stroke="currentColor" 
                strokeWidth="6" 
                strokeLinecap="round"
                fill="none"
              />
              <path 
                d="M33 50 L36 95" 
                stroke="currentColor" 
                strokeWidth="6" 
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </motion.div>

          {/* Labels */}
          <motion.span 
            className="absolute left-4 sm:left-16 bottom-2 text-xs sm:text-sm text-muted-foreground/50"
            initial={{ opacity: 0 }}
            animate={animationPhase >= 1 ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            Before
          </motion.span>
          <motion.span 
            className="absolute right-4 sm:right-16 bottom-2 text-xs sm:text-sm text-emerald-500/70 font-medium"
            initial={{ opacity: 0 }}
            animate={animationPhase >= 4 ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            After Fitacle
          </motion.span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center"
        >
          {/* Main headline */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
          >
            <span className="text-foreground">Your Transformation</span>
            <br />
            <span className="text-muted-foreground">Begins Here.</span>
          </motion.h2>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10"
          >
            One decision. One step through. A completely different version of you on the other side.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button
              onClick={onStartTransformation}
              className="group inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-foreground text-background rounded-full font-semibold text-base sm:text-lg shadow-2xl hover:shadow-foreground/20 transition-all duration-300 hover:scale-105"
            >
              Step Through
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Replay hint */}
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
            onClick={() => {
              setAnimationPhase(0)
              setTimeout(() => setAnimationPhase(1), 100)
              setTimeout(() => setAnimationPhase(2), 1600)
              setTimeout(() => setAnimationPhase(3), 2400)
              setTimeout(() => setAnimationPhase(4), 3100)
            }}
            className="mt-8 text-sm text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            Replay animation
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
