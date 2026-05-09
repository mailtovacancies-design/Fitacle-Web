"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface FinalCTAProps {
  onStartTransformation?: () => void
}

export function FinalCTA({ onStartTransformation }: FinalCTAProps) {
  return (
    <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        
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
