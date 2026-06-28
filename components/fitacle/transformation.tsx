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
    title: "Awareness",
    description: "You begin to see your patterns. The unconscious becomes conscious. Habits are identified.",
    metrics: [
      { label: "Pattern Recognition", value: "Active" },
      { label: "Energy Awareness", value: "+40%" },
      { label: "Sleep Tracking", value: "Initiated" },
    ],
    achievements: ["Patterns identified", "Daily tracking established", "Baseline set"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    day: 60,
    title: "Adaptation",
    description: "Your body and mind begin to respond. Old patterns break. New identity forms.",
    metrics: [
      { label: "Habit Consistency", value: "75%+" },
      { label: "Behavioral Change", value: "Visible" },
      { label: "Identity Shift", value: "Beginning" },
    ],
    achievements: ["Old habits replaced", "New routines embedded", "Confidence building"],
    color: "from-purple-500 to-pink-500",
  },
  {
    day: 90,
    title: "Transformation",
    description: "A different version of you emerges. This is no longer effort. This is who you are.",
    metrics: [
      { label: "Identity Shift", value: "Complete" },
      { label: "Discipline", value: "Automatic" },
      { label: "Lifestyle", value: "Embedded" },
    ],
    achievements: ["Irreversible change", "New identity locked", "Ready for next level"],
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
      className="pt-16 sm:pt-24 md:pt-32 pb-8 sm:pb-10 md:pb-12 bg-background relative overflow-hidden"
    >
      {/* Simplified Background - No heavy animations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-purple-500/8 via-pink-500/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-500/8 via-blue-500/4 to-transparent rounded-full blur-3xl" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative">
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
            Behavioural Change System
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 text-foreground"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              90 Days to a Different
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="block bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent"
            >
              Version of You.
            </motion.span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-2"
          >
            Not motivation. Not theory. Just structured behavioural change.
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-muted-foreground/70 text-xs sm:text-sm max-w-lg mx-auto"
          >
            Small changes repeated daily create irreversible identity shifts.
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
              <motion.button
                key={milestone.day}
                onClick={() => setActivePhase(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 ${
                  activePhase === index
                    ? "bg-foreground text-background shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <Calendar size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Day</span> {milestone.day}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Active Phase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto mb-10 sm:mb-16 px-2"
          >
            <motion.div 
              className="relative bg-card border border-border rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-sm overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated gradient background */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.08 }}
                transition={{ duration: 0.5 }}
                className={`absolute inset-0 bg-gradient-to-br ${milestones[activePhase].color}`} 
              />

              <div className="relative flex flex-col lg:flex-row items-start gap-5 sm:gap-8">
                {/* Left side - Icon and title */}
                <div className="flex-shrink-0 flex lg:flex-col items-center gap-4 lg:gap-0">
                  <motion.div
                    initial={{ scale: 0.8, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl bg-gradient-to-br ${milestones[activePhase].color} flex items-center justify-center shadow-lg`}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.2, type: "spring" }}
                    >
                      {activePhase === 0 ? (
                        <Zap size={28} className="text-white sm:w-9 sm:h-9" />
                      ) : activePhase === 1 ? (
                        <Flame size={28} className="text-white sm:w-9 sm:h-9" />
                      ) : (
                        <Trophy size={28} className="text-white sm:w-9 sm:h-9" />
                      )}
                    </motion.div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="lg:mt-4 text-center"
                  >
                    <motion.div 
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
                      className={`text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r ${milestones[activePhase].color} bg-clip-text text-transparent`}
                    >
                      {milestones[activePhase].day}
                    </motion.div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Days</div>
                  </motion.div>
                </div>

                {/* Right side - Content */}
                <div className="flex-1">
                  <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-2 sm:mb-3"
                  >
                    {milestones[activePhase].title}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6"
                  >
                    {milestones[activePhase].description}
                  </motion.p>

                  {/* Metrics - Mobile Responsive */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    {milestones[activePhase].metrics.map((metric, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                        className="text-center p-2 sm:p-4 bg-secondary/50 rounded-lg sm:rounded-xl"
                      >
                        <div className={`text-sm sm:text-lg md:text-xl font-bold bg-gradient-to-r ${milestones[activePhase].color} bg-clip-text text-transparent`}>
                          {metric.value}
                        </div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">{metric.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Achievements */}
                  <div className="space-y-1.5 sm:space-y-2">
                    {milestones[activePhase].achievements.map((achievement, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                        className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground"
                      >
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.6 + i * 0.1, type: "spring" }}
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r ${milestones[activePhase].color} flex items-center justify-center flex-shrink-0`}
                        >
                          <Check size={10} className="text-white sm:w-3 sm:h-3" />
                        </motion.div>
                        <span>{achievement}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Timeline Visual - Mobile Responsive */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative flex justify-center items-center gap-2 sm:gap-4 mb-10 sm:mb-16 px-4"
        >
          <div className="flex-1 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-border to-border rounded-full max-w-20 sm:max-w-none" />
          {milestones.map((milestone, index) => (
            <motion.div 
              key={milestone.day} 
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
            >
              <motion.div
                animate={activePhase === index ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1.5, repeat: activePhase === index ? Infinity : 0 }}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-500 ${
                  activePhase >= index 
                    ? `bg-gradient-to-r ${milestone.color} text-white shadow-md`
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {milestone.day}
              </motion.div>
              {index < milestones.length - 1 && (
                <ArrowRight size={16} className="absolute -right-5 sm:-right-8 top-1/2 -translate-y-1/2 text-muted-foreground hidden sm:block" />
              )}
            </motion.div>
          ))}
          <div className="flex-1 h-0.5 sm:h-1 bg-gradient-to-r from-border via-border to-transparent rounded-full max-w-20 sm:max-w-none" />
        </motion.div>

        {/* Instagram CTA for Custom Workout Routine - Simplified */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative px-2"
        >
          <div className="bg-gradient-to-r from-purple-500/5 via-pink-500/8 to-orange-500/5 rounded-2xl border border-pink-500/20 p-4 sm:p-6 max-w-3xl mx-auto overflow-hidden">
            <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <Instagram size={26} className="text-white sm:w-7 sm:h-7" />
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-1.5 justify-center sm:justify-start mb-1.5">
                  <Star className="text-yellow-500 fill-yellow-500" size={14} />
                  <span className="text-xs font-medium text-muted-foreground">Exclusive Offer</span>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-1.5">
                  Achieve Your Goal Within
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent"> 90 Days</span>
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 max-w-xl">
                  Want a personalized workout routine? Follow us on Instagram and DM for a <strong>FREE custom workout plan</strong>!
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center sm:justify-start">
                  <a
                    href="https://instagram.com/fitacle_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-xl font-semibold text-sm shadow-lg transition-transform hover:scale-105 active:scale-95"
                  >
                    <Instagram size={16} />
                    <span>Follow @fitacle_official</span>
                  </a>
                  
                  <a
                    href="https://instagram.com/fitacle_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl font-medium text-sm text-foreground hover:bg-secondary transition-colors"
                  >
                    <MessageCircle size={16} />
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
