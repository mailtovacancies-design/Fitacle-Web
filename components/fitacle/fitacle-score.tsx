"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Zap, Heart, Brain, TrendingUp, Award, Trophy, Droplets, Moon, Flame, Target, Sparkles, ArrowRight, Lock, LogIn } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

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

type GoalMode = "fat_loss" | "maintain" | "muscle_gain"

interface DailyInput {
  caloriesConsumed: string
  caloriesBurned: string
  waterLitres: string
  sleepHours: string
  steps: string
}

interface AIAdvice {
  message: string
  type: "warning" | "success" | "info"
  icon: typeof Flame
}

function calculateScore(input: DailyInput, goalMode: GoalMode): { score: number; advice: AIAdvice[] } {
  const calories = parseFloat(input.caloriesConsumed) || 0
  const burned = parseFloat(input.caloriesBurned) || 0
  const water = parseFloat(input.waterLitres) || 0
  const sleep = parseFloat(input.sleepHours) || 0
  const steps = parseFloat(input.steps) || 0
  
  let score = 50 // Base score
  const advice: AIAdvice[] = []
  
  // Goal-based calorie analysis
  const calorieBalance = calories - burned
  
  if (goalMode === "fat_loss") {
    // For fat loss, need calorie deficit
    if (calorieBalance < -300 && calorieBalance > -700) {
      score += 15
      advice.push({ message: "Perfect calorie deficit for fat loss!", type: "success", icon: Flame })
    } else if (calorieBalance > 0) {
      score -= 10
      advice.push({ message: "You're in a calorie surplus. Burn more or eat less for fat loss.", type: "warning", icon: Flame })
    } else if (calorieBalance < -700) {
      score -= 5
      advice.push({ message: "Deficit too aggressive. This may affect muscle retention.", type: "warning", icon: Flame })
    }
  } else if (goalMode === "muscle_gain") {
    // For muscle gain, need calorie surplus
    if (calorieBalance > 200 && calorieBalance < 500) {
      score += 15
      advice.push({ message: "Excellent surplus for lean muscle gains!", type: "success", icon: Flame })
    } else if (calorieBalance < 0) {
      score -= 10
      advice.push({ message: "You need a calorie surplus to build muscle. Eat more!", type: "warning", icon: Flame })
    } else if (calorieBalance > 500) {
      score -= 5
      advice.push({ message: "Surplus too high. May lead to excess fat gain.", type: "info", icon: Flame })
    }
  } else {
    // Maintain
    if (Math.abs(calorieBalance) < 200) {
      score += 15
      advice.push({ message: "Perfect balance for maintenance!", type: "success", icon: Flame })
    } else {
      advice.push({ message: "Try to balance calories consumed with calories burned.", type: "info", icon: Flame })
    }
  }
  
  // Water analysis (target: 3L minimum)
  if (water >= 3) {
    score += 15
    advice.push({ message: "Excellent hydration! Keep it up.", type: "success", icon: Droplets })
  } else if (water >= 2) {
    score += 8
    advice.push({ message: `Drink ${(3 - water).toFixed(1)}L more water today.`, type: "info", icon: Droplets })
  } else {
    score -= 5
    advice.push({ message: "Seriously dehydrated! Drink at least 3L daily.", type: "warning", icon: Droplets })
  }
  
  // Sleep analysis (target: 7-9 hours)
  if (sleep >= 7 && sleep <= 9) {
    score += 15
    advice.push({ message: "Optimal sleep for recovery and performance!", type: "success", icon: Moon })
  } else if (sleep >= 6) {
    score += 5
    advice.push({ message: "Need more sleep. Aim for 7-9 hours.", type: "info", icon: Moon })
  } else if (sleep > 0) {
    score -= 10
    advice.push({ message: "Sleep deprivation detected. This affects recovery and fat loss.", type: "warning", icon: Moon })
  }
  
  // Steps analysis (target: 10,000)
  if (steps >= 10000) {
    score += 10
    advice.push({ message: "Amazing activity level! 10K+ steps achieved.", type: "success", icon: Activity })
  } else if (steps >= 7000) {
    score += 5
    advice.push({ message: `Walk ${Math.round((10000 - steps) / 1000)}K more steps to hit your goal.`, type: "info", icon: Activity })
  } else if (steps > 0) {
    advice.push({ message: "Increase daily movement. Walking burns fat and improves health.", type: "info", icon: Activity })
  }
  
  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, score))
  
  return { score, advice }
}

interface FitacleScoreProps {
  onSignUpClick?: () => void
}

export function FitacleScore({ onSignUpClick }: FitacleScoreProps) {
  const [showCalculator, setShowCalculator] = useState(false)
  const [goalMode, setGoalMode] = useState<GoalMode>("fat_loss")
  const [dailyInput, setDailyInput] = useState<DailyInput>({
    caloriesConsumed: "",
    caloriesBurned: "",
    waterLitres: "",
    sleepHours: "",
    steps: ""
  })
  const [calculatedResult, setCalculatedResult] = useState<{ score: number; advice: AIAdvice[] } | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        if (!supabase) {
          setIsLoading(false)
          return
        }
        const { data: { user } } = await supabase.auth.getUser()
        setIsLoggedIn(!!user)
      } catch {
        // Supabase not configured
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])
  
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
  
  const handleCalculate = () => {
    const result = calculateScore(dailyInput, goalMode)
    setCalculatedResult(result)
  }

  const goalModes = [
    { id: "fat_loss" as GoalMode, label: "Fat Loss", icon: Flame, description: "Calorie deficit" },
    { id: "maintain" as GoalMode, label: "Maintain", icon: Target, description: "Balance calories" },
    { id: "muscle_gain" as GoalMode, label: "Muscle Gain", icon: Zap, description: "Calorie surplus" },
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
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative">
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
            <span className="text-foreground">Your Life,</span>
            <br />
            <span className="text-muted-foreground">Quantified.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto text-pretty mb-2">
            Not just fitness. Your entire lifestyle translated into data.
          </p>
          <p className="text-sm text-muted-foreground/70 max-w-lg mx-auto text-pretty mb-8">
            What gets measured gets improved. What gets ignored disappears.
          </p>
          
          {/* Find Your Fitacle Score CTA */}
          {isLoading ? (
            <div className="h-14 w-64 mx-auto bg-accent animate-pulse rounded-full" />
          ) : isLoggedIn ? (
            <div className="space-y-4">
              <motion.button
                onClick={() => setShowCalculator(!showCalculator)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-bold text-base shadow-lg hover:shadow-xl hover:bg-foreground/90 transition-all"
              >
                <Sparkles size={18} />
                <span>
                  Find your <span className="text-emerald-400">daily Fitacle Score</span>
                </span>
                <ArrowRight size={18} />
              </motion.button>
              <p className="text-sm text-muted-foreground">
                Enter today&apos;s activity and get personalized AI advice
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <motion.button
                onClick={onSignUpClick}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-bold text-base shadow-lg hover:shadow-xl hover:bg-foreground/90 transition-all"
              >
                <LogIn size={18} />
                <span>
                  Sign up to find your <span className="text-emerald-400">daily Fitacle Score</span>
                </span>
                <ArrowRight size={18} />
              </motion.button>
              <p className="text-sm text-muted-foreground">
                Enter today&apos;s activity and get personalized AI advice
              </p>
            </div>
          )}
        </motion.div>
        
        {/* Score Calculator Modal/Section - Only for logged in users */}
        <AnimatePresence>
          {showCalculator && isLoggedIn && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 overflow-hidden"
            >
              <div className="bg-card rounded-2xl sm:rounded-3xl border border-border p-4 sm:p-8 shadow-lg">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Calculate Your Daily Score</h3>
                  <p className="text-muted-foreground">Enter today&apos;s activity and get personalized AI advice</p>
                </div>
                
                {/* Goal Mode Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-foreground mb-4 text-center">Select Your Goal</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                    {goalModes.map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setGoalMode(mode.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          goalMode === mode.id
                            ? "border-foreground bg-foreground/5"
                            : "border-border hover:border-foreground/30"
                        }`}
                      >
                        <mode.icon size={20} className={`mx-auto mb-2 ${goalMode === mode.id ? "text-foreground" : "text-muted-foreground"}`} />
                        <p className={`text-sm font-medium ${goalMode === mode.id ? "text-foreground" : "text-muted-foreground"}`}>{mode.label}</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">{mode.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Input Fields */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-8">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">
                      <Flame size={12} className="inline mr-1" />
                      Calories Consumed
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={dailyInput.caloriesConsumed}
                      onChange={(e) => setDailyInput({ ...dailyInput, caloriesConsumed: e.target.value.replace(/[^0-9]/g, '') })}
                      placeholder="2000"
                      className="w-full px-4 py-3 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">
                      <Activity size={12} className="inline mr-1" />
                      Calories Burned
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={dailyInput.caloriesBurned}
                      onChange={(e) => setDailyInput({ ...dailyInput, caloriesBurned: e.target.value.replace(/[^0-9]/g, '') })}
                      placeholder="500"
                      className="w-full px-4 py-3 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">
                      <Droplets size={12} className="inline mr-1" />
                      Water (Litres)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={dailyInput.waterLitres}
                      onChange={(e) => setDailyInput({ ...dailyInput, waterLitres: e.target.value.replace(/[^0-9.]/g, '') })}
                      placeholder="3"
                      className="w-full px-4 py-3 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">
                      <Moon size={12} className="inline mr-1" />
                      Sleep (Hours)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={dailyInput.sleepHours}
                      onChange={(e) => setDailyInput({ ...dailyInput, sleepHours: e.target.value.replace(/[^0-9.]/g, '') })}
                      placeholder="8"
                      className="w-full px-4 py-3 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">
                      <TrendingUp size={12} className="inline mr-1" />
                      Steps
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={dailyInput.steps}
                      onChange={(e) => setDailyInput({ ...dailyInput, steps: e.target.value.replace(/[^0-9]/g, '') })}
                      placeholder="10000"
                      className="w-full px-4 py-3 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <motion.button
                    onClick={handleCalculate}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-foreground text-background rounded-full font-semibold text-sm"
                  >
                    <Sparkles size={16} />
                    Calculate My Score
                  </motion.button>
                </div>
                
                {/* Results */}
                <AnimatePresence>
                  {calculatedResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-8 pt-8 border-t border-border"
                    >
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Score Display */}
                        <div className="flex-shrink-0">
                          <div className="relative w-32 h-32">
                            <svg width={128} height={128} className="transform -rotate-90">
                              <circle
                                cx={64}
                                cy={64}
                                r={56}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={8}
                                className="text-accent"
                              />
                              <motion.circle
                                cx={64}
                                cy={64}
                                r={56}
                                fill="none"
                                stroke={calculatedResult.score >= 70 ? "#10b981" : calculatedResult.score >= 50 ? "#f59e0b" : "#ef4444"}
                                strokeWidth={8}
                                strokeLinecap="round"
                                strokeDasharray={351.86}
                                initial={{ strokeDashoffset: 351.86 }}
                                animate={{ strokeDashoffset: 351.86 - (calculatedResult.score / 100) * 351.86 }}
                                transition={{ duration: 1.5 }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-3xl font-bold text-foreground">{calculatedResult.score}</span>
                              <span className="text-xs text-muted-foreground">Today</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* AI Advice */}
                        <div className="flex-1 space-y-3">
                          <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <Brain size={18} className="text-primary" />
                            AI Recommendations
                          </h4>
                          {calculatedResult.advice.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`flex items-start gap-3 p-3 rounded-xl ${
                                item.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20" :
                                item.type === "warning" ? "bg-amber-500/10 border border-amber-500/20" :
                                "bg-blue-500/10 border border-blue-500/20"
                              }`}
                            >
                              <item.icon size={16} className={
                                item.type === "success" ? "text-emerald-500" :
                                item.type === "warning" ? "text-amber-500" :
                                "text-blue-500"
                              } />
                              <p className="text-sm text-foreground">{item.message}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Sign Up CTA */}
                      <div className="mt-8 p-6 bg-gradient-to-r from-foreground/5 to-foreground/10 rounded-2xl border border-border text-center">
                        <Lock size={24} className="mx-auto mb-3 text-muted-foreground" />
                        <h4 className="text-lg font-semibold text-foreground mb-2">Track Your Progress Daily</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Sign up to save your scores, track trends, and get personalized AI coaching based on your history.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-semibold text-sm"
                        >
                          Sign Up to Track Your Score
                          <ArrowRight size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Achievements - Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card rounded-2xl border border-border p-6 shadow-sm opacity-60"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-semibold text-foreground">Achievements</h3>
            </div>
            <span className="text-xs px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full border border-amber-500/20">
              Coming Soon
            </span>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {achievements.slice(0, 4).map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex-shrink-0 p-4 rounded-xl text-center bg-accent/50 border border-border w-24"
              >
                <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center bg-muted">
                  <achievement.icon size={18} className="text-muted-foreground" />
                </div>
                <h4 className="text-xs font-medium text-muted-foreground truncate">
                  {achievement.title}
                </h4>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
