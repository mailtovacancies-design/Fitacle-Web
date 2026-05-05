"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { 
  TrendingUp, Calendar, Zap, Trophy, Target, Flame, Check, 
  Instagram, MessageCircle, ChevronRight, Sparkles, Star,
  ArrowRight, Play
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

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [target])
  
  return <span>{count}{suffix}</span>
}

function FloatingParticle({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
      initial={{ opacity: 0, y: 100 }}
      animate={{
        opacity: [0, 1, 0],
        y: [-20, -100],
        x: [0, Math.random() * 50 - 25],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
      style={{
        left: `${Math.random() * 100}%`,
        bottom: 0,
      }}
    />
  )
}

export function Transformation() {
  const [activePhase, setActivePhase] = useState(0)
  const [isHovering, setIsHovering] = useState<number | null>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const backgroundX = useTransform(mouseX, [0, 1000], [-20, 20])
  const backgroundY = useTransform(mouseY, [0, 1000], [-20, 20])

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhase((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section 
      id="transformation" 
      className="py-24 md:py-32 bg-background relative overflow-hidden"
      onMouseMove={(e) => {
        mouseX.set(e.clientX)
        mouseY.set(e.clientY)
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          style={{ x: backgroundX, y: backgroundY }}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-0 w-[700px] h-[700px] bg-gradient-to-bl from-purple-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl" 
        />
        <motion.div 
          style={{ x: useTransform(backgroundX, v => -v), y: useTransform(backgroundY, v => -v) }}
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl" 
        />
        
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.3} />
        ))}
        
        {/* Grid pattern */}
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
            className="text-4xl md:text-6xl font-semibold mb-4 text-foreground"
          >
            90 Days to a
            <motion.span
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="block bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-[length:200%_auto] bg-clip-text text-transparent"
            >
              New You
            </motion.span>
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

        {/* Phase Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-12"
        >
          <div className="flex items-center gap-4 p-2 bg-card border border-border rounded-2xl">
            {milestones.map((milestone, index) => (
              <motion.button
                key={milestone.day}
                onClick={() => setActivePhase(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-500 ${
                  activePhase === index
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  Day {milestone.day}
                </span>
                {activePhase === index && (
                  <motion.div
                    layoutId="activePhase"
                    className="absolute inset-0 bg-foreground rounded-xl -z-10"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Active Phase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto mb-16"
          >
            <div 
              className="relative bg-card border border-border rounded-3xl p-8 md:p-12 shadow-lg overflow-hidden"
              onMouseEnter={() => setIsHovering(activePhase)}
              onMouseLeave={() => setIsHovering(null)}
            >
              {/* Animated gradient border */}
              <motion.div
                animate={{
                  background: [
                    `linear-gradient(45deg, ${milestones[activePhase].color.split(" ")[0].replace("from-", "")}, transparent)`,
                  ]
                }}
                className={`absolute inset-0 opacity-10 bg-gradient-to-br ${milestones[activePhase].color}`}
              />
              
              {/* Sparkle effects on hover */}
              {isHovering === activePhase && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="absolute"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                      }}
                    >
                      <Sparkles size={16} className="text-yellow-500" />
                    </motion.div>
                  ))}
                </>
              )}

              <div className="relative flex flex-col lg:flex-row items-start gap-8">
                {/* Left side - Icon and title */}
                <div className="flex-shrink-0">
                  <motion.div
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgba(147, 51, 234, 0.3)",
                        "0 0 40px rgba(236, 72, 153, 0.3)",
                        "0 0 20px rgba(147, 51, 234, 0.3)",
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${milestones[activePhase].color} flex items-center justify-center`}
                  >
                    {activePhase === 0 ? (
                      <Zap size={36} className="text-white" />
                    ) : activePhase === 1 ? (
                      <Flame size={36} className="text-white" />
                    ) : (
                      <Trophy size={36} className="text-white" />
                    )}
                  </motion.div>
                  <div className="mt-4 text-center">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${milestones[activePhase].color} bg-clip-text text-transparent`}
                    >
                      <AnimatedCounter target={milestones[activePhase].day} />
                    </motion.div>
                    <div className="text-sm text-muted-foreground">Days</div>
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="flex-1">
                  <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl md:text-3xl font-semibold text-foreground mb-3"
                  >
                    {milestones[activePhase].title}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground mb-6"
                  >
                    {milestones[activePhase].description}
                  </motion.p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {milestones[activePhase].metrics.map((metric, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        className="text-center p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-all duration-300 cursor-default"
                      >
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                          className={`text-lg md:text-xl font-bold bg-gradient-to-r ${milestones[activePhase].color} bg-clip-text text-transparent`}
                        >
                          {metric.value}
                        </motion.div>
                        <div className="text-xs text-muted-foreground mt-1">{metric.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Achievements */}
                  <div className="space-y-2">
                    {milestones[activePhase].achievements.map((achievement, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex items-center gap-3 text-sm text-muted-foreground group"
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          className={`w-6 h-6 rounded-full bg-gradient-to-r ${milestones[activePhase].color} flex items-center justify-center`}
                        >
                          <Check size={12} className="text-white" />
                        </motion.div>
                        <span className="group-hover:text-foreground transition-colors">{achievement}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Timeline Visual */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative flex justify-center items-center gap-4 mb-16"
        >
          <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-border to-border rounded-full" />
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.day}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, type: "spring" }}
              className="relative"
            >
              <motion.div
                animate={activePhase === index ? { 
                  scale: [1, 1.2, 1],
                  boxShadow: ["0 0 0 0 rgba(147, 51, 234, 0)", "0 0 0 10px rgba(147, 51, 234, 0.2)", "0 0 0 0 rgba(147, 51, 234, 0)"]
                } : {}}
                transition={{ duration: 1.5, repeat: activePhase === index ? Infinity : 0 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                  activePhase >= index 
                    ? `bg-gradient-to-r ${milestone.color} text-white shadow-lg`
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {milestone.day}
              </motion.div>
              {index < milestones.length - 1 && (
                <ArrowRight size={20} className="absolute -right-8 top-1/2 -translate-y-1/2 text-muted-foreground" />
              )}
            </motion.div>
          ))}
          <div className="flex-1 h-1 bg-gradient-to-r from-border via-border to-transparent rounded-full" />
        </motion.div>

        {/* Instagram CTA for Custom Workout Routine */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 60px rgba(147, 51, 234, 0.1)",
                "0 0 100px rgba(236, 72, 153, 0.15)",
                "0 0 60px rgba(147, 51, 234, 0.1)",
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="bg-gradient-to-r from-purple-500/5 via-pink-500/10 to-orange-500/5 backdrop-blur-xl rounded-3xl border border-pink-500/20 p-8 md:p-12 overflow-hidden"
          >
            {/* Animated background gradient */}
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-conic from-purple-500/20 via-pink-500/10 via-orange-500/20 via-transparent to-purple-500/20 blur-3xl"
            />

            <div className="relative flex flex-col lg:flex-row items-center gap-8">
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 3, -3, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-pink-500/30">
                  <Instagram size={48} className="text-white md:w-16 md:h-16" />
                </div>
                {/* Pulsing ring */}
                <motion.div
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-3xl border-2 border-pink-500"
                />
              </motion.div>
              
              <div className="flex-1 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 justify-center lg:justify-start mb-3"
                >
                  <Star className="text-yellow-500 fill-yellow-500" size={18} />
                  <span className="text-sm font-medium text-muted-foreground">Exclusive Offer</span>
                </motion.div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Achieve Your Goal Within
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent"> 90 Days</span>
                </h3>
                <p className="text-muted-foreground mb-6 max-w-xl">
                  Want a detailed, personalized workout routine that complements your diet plan? 
                  Follow us on Instagram and DM for a <strong>FREE custom workout plan</strong> designed 
                  specifically for your body type and goals!
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <motion.a
                    href="https://instagram.com/fitacle_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-2xl font-semibold shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 group"
                  >
                    <Instagram size={22} />
                    <span>Follow @fitacle_official</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </motion.a>
                  
                  <motion.a
                    href="https://instagram.com/fitacle_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-4 bg-card border border-border rounded-2xl font-medium text-foreground hover:bg-secondary transition-all duration-300"
                  >
                    <MessageCircle size={20} />
                    <span>DM for Details</span>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
