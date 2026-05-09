"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

interface FinalCTAProps {
  onStartTransformation?: () => void
}

export function FinalCTA({ onStartTransformation }: FinalCTAProps) {
  return (
    <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/[0.02] to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.05),transparent_70%)]" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-foreground/10 text-sm font-medium text-foreground mb-8"
          >
            <Sparkles size={14} />
            The Moment Is Now
          </motion.span>

          {/* Main headline */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
          >
            <span className="text-foreground">Your Future Self</span>
            <br />
            <span className="text-muted-foreground">Is Already Waiting.</span>
          </motion.h2>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            The only question is whether you will meet them.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <button
              onClick={onStartTransformation}
              className="group inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-foreground text-background rounded-full font-semibold text-base sm:text-lg shadow-2xl hover:shadow-foreground/20 transition-all duration-300 hover:scale-105"
            >
              Start Your Transformation
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Trust line */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 text-sm text-muted-foreground/60"
          >
            Join thousands who already started their transformation journey
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
