"use client"

import { motion } from "framer-motion"
import { Eye, Brain, RefreshCw, Sparkles } from "lucide-react"

const steps = [
  {
    icon: Eye,
    number: "01",
    title: "Observe You",
    description: "We track sleep, food, movement, hydration, and habits.",
  },
  {
    icon: Brain,
    number: "02",
    title: "Understand You",
    description: "AI identifies your behavioural patterns.",
  },
  {
    icon: RefreshCw,
    number: "03",
    title: "Adapt to You",
    description: "Plans change based on your real-life actions.",
  },
  {
    icon: Sparkles,
    number: "04",
    title: "Transform You",
    description: "Small daily actions become visible physical change.",
  },
]

export function EmotionalHook() {
  return (
    <section className="py-20 md:py-28 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-accent/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-background/50 rounded-full blur-3xl" />
      </div>
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-foreground leading-tight">
            &ldquo;Your body is not your problem.
            <br />
            <span className="text-muted-foreground">Your patterns are.&rdquo;</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            We don&apos;t give generic plans. We study your life and adapt in real time.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-foreground group-hover:bg-primary transition-colors duration-300">
                  <step.icon size={20} className="text-background" />
                </div>
                <span className="text-xs font-mono text-muted-foreground">{step.number}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* AI Coach Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 bg-card border border-border rounded-3xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">
                &ldquo;Your AI Coach Learns You Daily&rdquo;
              </h3>
              <p className="text-muted-foreground mb-6">
                It doesn&apos;t give generic plans. It studies your life and adjusts in real time.
              </p>
              <div className="space-y-3">
                {[
                  "Fatigue detection",
                  "Inconsistency prediction",
                  "Recovery adjustment",
                  "Habit correction"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl"
                />
                <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-foreground to-foreground/80 flex items-center justify-center">
                  <Brain size={64} className="text-background" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
