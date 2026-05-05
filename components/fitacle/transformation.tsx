"use client"

import { motion } from "framer-motion"
import { TrendingUp, Calendar, Zap, Trophy, Target, Flame, Check } from "lucide-react"

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
  },
]

export function Transformation() {
  return (
    <section id="transformation" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-accent/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-secondary/40 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-xs font-medium text-muted-foreground mb-6">
            <TrendingUp size={14} />
            Progress Timeline
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-foreground">
            Your Transformation Journey
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See what&apos;s possible with dedication and the right plan
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-foreground via-muted-foreground to-border" />

          <div className="space-y-12 md:space-y-0">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.day}
                initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={`relative md:grid md:grid-cols-2 md:gap-8 ${
                  index % 2 === 0 ? "" : "md:direction-rtl"
                } mb-12 md:mb-0`}
              >
                {/* Day Badge */}
                <div
                  className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full bg-foreground flex items-center justify-center z-10"
                >
                  <Calendar size={16} className="text-background" />
                </div>

                {/* Content */}
                <div
                  className={`ml-12 md:ml-0 ${
                    index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16 md:col-start-2"
                  }`}
                >
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                    <div
                      className={`flex items-center gap-3 mb-4 ${
                        index % 2 === 0 ? "md:justify-end" : ""
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-foreground">
                        {index === 0 ? (
                          <Zap size={20} className="text-background" />
                        ) : index === 1 ? (
                          <Flame size={20} className="text-background" />
                        ) : (
                          <Trophy size={20} className="text-background" />
                        )}
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground font-medium">Day {milestone.day}</span>
                        <h3 className="text-xl font-semibold text-foreground">{milestone.title}</h3>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm mb-6">{milestone.description}</p>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {milestone.metrics.map((metric, i) => (
                        <div key={i} className="text-center p-3 bg-secondary/50 rounded-xl">
                          <div className="text-lg font-semibold text-foreground">{metric.value}</div>
                          <div className="text-xs text-muted-foreground">{metric.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Achievements */}
                    <div className="space-y-2">
                      {milestone.achievements.map((achievement, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 text-sm text-muted-foreground ${
                            index % 2 === 0 ? "md:justify-end" : ""
                          }`}
                        >
                          <Check size={14} className="text-success" />
                          {achievement}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Motivational Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="bg-card border border-border rounded-3xl p-12 shadow-sm max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-foreground mx-auto mb-6 flex items-center justify-center">
              <Target size={32} className="text-background" />
            </div>
            <blockquote className="text-2xl md:text-3xl font-semibold text-foreground mb-4 leading-relaxed text-balance">
              &ldquo;The body achieves what the mind believes&rdquo;
            </blockquote>
            <p className="text-muted-foreground">
              Your transformation starts with a single decision. Let FITACLE guide you there.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
