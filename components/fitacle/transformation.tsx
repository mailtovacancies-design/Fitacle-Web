"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  TrendingUp, Calendar, Zap, Trophy, Flame, Check, 
  Instagram, MessageCircle, Star, ArrowRight
} from "lucide-react"

const milestones = [
  {
    day: 30,
    title: "Foundation Phase",
    description: "Build habits, increase energy, initial body composition changes",
    metrics: [
      { label: "Weight Change", value: "-2 to -4 kg" },
      { label: "Energy Boost", value: "+40%" },
      { label: "Sleep Quality", value: "+25%" },
    ],
    achievements: ["Consistent routine established", "Cravings reduced", "Mood improvement"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    day: 60,
    title: "Transformation Phase",
    description: "Visible changes, strength gains, metabolism optimization",
    metrics: [
      { label: "Weight Change", value: "-5 to -8 kg" },
      { label: "Muscle Definition", value: "Visible" },
      { label: "Strength Gain", value: "+30%" },
    ],
    achievements: ["Clothes fit differently", "Others notice changes", "Increased confidence"],
    color: "from-purple-500 to-pink-500",
  },
  {
    day: 90,
    title: "Elite Phase",
    description: "Peak performance, sustainable lifestyle, total transformation",
    metrics: [
      { label: "Weight Change", value: "-8 to -12 kg" },
      { label: "Body Fat", value: "-5 to -8%" },
      { label: "Fitness Level", value: "Advanced" },
    ],
    achievements: ["Complete transformation", "New lifestyle embedded", "Ready for new goals"],
    color: "from-orange-500 to-red-500",
  },
]





export function Transformation() {
  const [activePhase, setActivePhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhase((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section 
      id="transformation" 
      className="py-16 sm:py-24 md:py-32 bg-background relative overflow-hidden"
    >
      {/* Simplified Background - No heavy animations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-purple-500/8 via-pink-500/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-500/8 via-blue-500/4 to-transparent rounded-full blur-3xl" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-xs font-medium text-muted-foreground mb-6"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
              <TrendingUp size={14} />
            </motion.div>
            Your Journey Timeline
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 text-foreground"
          >
            90 Days to a
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              New You
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            See what&apos;s possible with dedication and the right plan
          </motion.p>
        </motion.div>

        {/* Phase Progress Bar - Mobile Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-8 sm:mb-12 px-2"
        >
          <div className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 bg-card border border-border rounded-xl sm:rounded-2xl w-full sm:w-auto justify-center">
            {milestones.map((milestone, index) => (
              <button
                key={milestone.day}
                onClick={() => setActivePhase(index)}
                className={`relative px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 ${
                  activePhase === index
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <Calendar size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Day</span> {milestone.day}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Active Phase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-4xl mx-auto mb-10 sm:mb-16 px-2"
          >
            <div 
              className="relative bg-card border border-border rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-sm overflow-hidden"
            >
              {/* Static gradient background */}
              <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${milestones[activePhase].color}`} />

              <div className="relative flex flex-col lg:flex-row items-start gap-5 sm:gap-8">
                {/* Left side - Icon and title */}
                <div className="flex-shrink-0 flex lg:flex-col items-center gap-4 lg:gap-0">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl bg-gradient-to-br ${milestones[activePhase].color} flex items-center justify-center shadow-lg`}
                  >
                    {activePhase === 0 ? (
                      <Zap size={28} className="text-white sm:w-9 sm:h-9" />
                    ) : activePhase === 1 ? (
                      <Flame size={28} className="text-white sm:w-9 sm:h-9" />
                    ) : (
                      <Trophy size={28} className="text-white sm:w-9 sm:h-9" />
                    )}
                  </div>
                  <div className="lg:mt-4 text-center">
                    <div className={`text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r ${milestones[activePhase].color} bg-clip-text text-transparent`}>
                      {milestones[activePhase].day}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Days</div>
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-2 sm:mb-3">
                    {milestones[activePhase].title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                    {milestones[activePhase].description}
                  </p>

                  {/* Metrics - Mobile Responsive */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    {milestones[activePhase].metrics.map((metric, i) => (
                      <div
                        key={i}
                        className="text-center p-2 sm:p-4 bg-secondary/50 rounded-lg sm:rounded-xl"
                      >
                        <div className={`text-sm sm:text-lg md:text-xl font-bold bg-gradient-to-r ${milestones[activePhase].color} bg-clip-text text-transparent`}>
                          {metric.value}
                        </div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Achievements */}
                  <div className="space-y-1.5 sm:space-y-2">
                    {milestones[activePhase].achievements.map((achievement, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground"
                      >
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r ${milestones[activePhase].color} flex items-center justify-center flex-shrink-0`}>
                          <Check size={10} className="text-white sm:w-3 sm:h-3" />
                        </div>
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Timeline Visual - Mobile Responsive */}
        <div className="relative flex justify-center items-center gap-2 sm:gap-4 mb-10 sm:mb-16 px-4">
          <div className="flex-1 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-border to-border rounded-full max-w-20 sm:max-w-none" />
          {milestones.map((milestone, index) => (
            <div key={milestone.day} className="relative">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                  activePhase >= index 
                    ? `bg-gradient-to-r ${milestone.color} text-white shadow-md`
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {milestone.day}
              </div>
              {index < milestones.length - 1 && (
                <ArrowRight size={16} className="absolute -right-5 sm:-right-8 top-1/2 -translate-y-1/2 text-muted-foreground hidden sm:block" />
              )}
            </div>
          ))}
          <div className="flex-1 h-0.5 sm:h-1 bg-gradient-to-r from-border via-border to-transparent rounded-full max-w-20 sm:max-w-none" />
        </div>

        {/* Instagram CTA for Custom Workout Routine - Simplified */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative px-2"
        >
          <div className="bg-gradient-to-r from-purple-500/5 via-pink-500/8 to-orange-500/5 rounded-2xl sm:rounded-3xl border border-pink-500/20 p-5 sm:p-8 md:p-12 overflow-hidden">
            <div className="relative flex flex-col lg:flex-row items-center gap-5 sm:gap-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <Instagram size={36} className="text-white sm:w-12 sm:h-12" />
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start mb-2 sm:mb-3">
                  <Star className="text-yellow-500 fill-yellow-500" size={16} />
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">Exclusive Offer</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-3">
                  Achieve Your Goal Within
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent"> 90 Days</span>
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-xl">
                  Want a personalized workout routine? Follow us on Instagram and DM for a <strong>FREE custom workout plan</strong>!
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start">
                  <a
                    href="https://instagram.com/fitacle_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base shadow-lg transition-transform hover:scale-105 active:scale-95"
                  >
                    <Instagram size={18} className="sm:w-5 sm:h-5" />
                    <span>Follow @fitacle_official</span>
                  </a>
                  
                  <a
                    href="https://instagram.com/fitacle_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-card border border-border rounded-xl sm:rounded-2xl font-medium text-sm sm:text-base text-foreground hover:bg-secondary transition-colors"
                  >
                    <MessageCircle size={18} className="sm:w-5 sm:h-5" />
                    <span>DM for Details</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
