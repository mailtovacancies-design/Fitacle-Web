"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Activity, Zap, Heart, Brain, TrendingUp, Award, Trophy } from "lucide-react"

interface ScoreRingProps {
  score: number
  label: string
  color: string
  size?: number
  delay?: number
}

function ScoreRing({ score, label, color, size = 100, delay = 0 }: ScoreRingProps) {
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const [offset, setOffset] = useState(circumference)
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (score / 100) * circumference)
      
      const duration = 1500
      const steps = 60
      const increment = score / steps
      let current = 0
      const numTimer = setInterval(() => {
        current += increment
        if (current >= score) {
          setDisplayScore(score)
          clearInterval(numTimer)
        } else {
          setDisplayScore(Math.floor(current))
        }
      }, duration / steps)
      
      return () => clearInterval(numTimer)
    }, delay)
    return () => clearTimeout(timer)
  }, [score, circumference, delay])

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-accent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-[1500ms] ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-foreground">{displayScore}</span>
        </div>
      </div>
      <span className="text-sm text-muted-foreground mt-3">{label}</span>
    </div>
  )
}

function MainScoreRing({ score }: { score: number }) {
  const size = 220
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const [offset, setOffset] = useState(circumference)
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (score / 100) * circumference)
      
      const duration = 2000
      const steps = 80
      const increment = score / steps
      let current = 0
      const numTimer = setInterval(() => {
        current += increment
        if (current >= score) {
          setDisplayScore(score)
          clearInterval(numTimer)
        } else {
          setDisplayScore(Math.floor(current))
        }
      }, duration / steps)
      
      return () => clearInterval(numTimer)
    }, 300)
    return () => clearTimeout(timer)
  }, [score, circumference])

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="mainScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a0a0f" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-accent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#mainScoreGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-[2000ms] ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-6xl font-bold text-foreground">{displayScore}</span>
        <span className="text-sm text-muted-foreground mt-1">Fitacle Score</span>
      </div>
    </div>
  )
}

export function FitacleScore() {
  const mainScore = 78
  const subScores = [
    { label: "Energy", score: 82, color: "#f59e0b", icon: Zap },
    { label: "Consistency", score: 75, color: "#10b981", icon: Activity },
    { label: "Health", score: 80, color: "#3b82f6", icon: Heart },
    { label: "Recovery", score: 72, color: "#8b5cf6", icon: Brain },
  ]

  const weeklyProgress = [
    { day: "Mon", score: 72 },
    { day: "Tue", score: 75 },
    { day: "Wed", score: 68 },
    { day: "Thu", score: 80 },
    { day: "Fri", score: 78 },
    { day: "Sat", score: 85 },
    { day: "Sun", score: 78 },
  ]

  const achievements = [
    { title: "7-Day Streak", icon: Activity, unlocked: true },
    { title: "Calorie Master", icon: Zap, unlocked: true },
    { title: "Early Bird", icon: TrendingUp, unlocked: true },
    { title: "Hydration King", icon: Heart, unlocked: false },
  ]

  return (
    <section id="score" className="py-24 md:py-32 bg-accent/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-accent to-transparent rounded-full blur-3xl"
        />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border text-sm font-medium text-foreground mb-6">
            <Award size={16} className="text-primary" />
            Performance Dashboard
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-foreground">Your Fitacle</span>
            <br />
            <span className="text-muted-foreground">Score</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            A comprehensive measure of your fitness journey based on consistency, 
            energy levels, and overall health metrics.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="lg:col-span-1 bg-card rounded-3xl border border-border p-8 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col items-center"
          >
            <MainScoreRing score={mainScore} />

            <div className="mt-10 w-full space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-muted-foreground text-sm">Weekly Average</span>
                <span className="font-semibold text-foreground">76.6</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-muted-foreground text-sm">Best Score</span>
                <span className="font-semibold text-emerald-600">85</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground text-sm">Improvement</span>
                <span className="font-semibold text-primary flex items-center gap-1">
                  <TrendingUp size={14} />
                  +12%
                </span>
              </div>
            </div>
          </motion.div>

          {/* Sub Scores */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 bg-card rounded-3xl border border-border p-8 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-foreground mb-8">Score Breakdown</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {subScores.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div 
                    className="p-2.5 rounded-xl mb-4" 
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <item.icon size={20} style={{ color: item.color }} />
                  </div>
                  <ScoreRing score={item.score} label={item.label} color={item.color} delay={300 + index * 100} />
                </motion.div>
              ))}
            </div>

            {/* Weekly Chart */}
            <div className="mt-12 pt-8 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-6">Weekly Progress</h4>
              <div className="flex items-end justify-between gap-3 h-32">
                {weeklyProgress.map((day, index) => (
                  <motion.div
                    key={day.day}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${day.score}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div
                      className="w-full rounded-lg bg-foreground"
                      style={{ height: `${day.score}%`, minHeight: "20%" }}
                    />
                    <span className="text-xs text-muted-foreground font-medium">{day.day}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 bg-card rounded-3xl border border-border p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-8">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-foreground">Achievements</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className={`p-6 rounded-2xl text-center transition-all duration-300 ${
                    achievement.unlocked
                      ? "bg-accent hover:bg-accent/80 border border-border"
                      : "bg-accent/50 opacity-60"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                      achievement.unlocked ? "bg-foreground" : "bg-muted"
                    }`}
                  >
                    <achievement.icon
                      size={24}
                      className={achievement.unlocked ? "text-background" : "text-muted-foreground"}
                    />
                  </div>
                  <h4 className={`font-semibold ${achievement.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {achievement.unlocked ? "Unlocked" : "Locked"}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
