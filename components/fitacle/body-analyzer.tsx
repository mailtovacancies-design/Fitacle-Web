"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calculator, Scale, Target, Flame, Dumbbell, Heart, TrendingUp, Sparkles } from "lucide-react"

interface FormData {
  gender: "male" | "female"
  age: number
  height: number
  weight: number
  activityLevel: string
  goal: string
}

interface Results {
  bmi: number
  bmiCategory: string
  dailyCalories: number
  protein: number
  carbs: number
  fats: number
  idealWeightMin: number
  idealWeightMax: number
  weightDiff: number
  fitacleScore: number
}

function AnimatedNumber({ value, suffix = "", decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(current)
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])

  return (
    <span>
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  )
}

function CircularProgress({ score, size = 160 }: { score: number; size?: number }) {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const [offset, setOffset] = useState(circumference)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (score / 100) * circumference)
    }, 300)
    return () => clearTimeout(timer)
  }, [score, circumference])

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.15 0.005 285)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold text-foreground">
          <AnimatedNumber value={score} />
        </span>
        <span className="text-xs text-muted-foreground mt-1">Fitacle Score</span>
      </div>
    </div>
  )
}

export function BodyAnalyzer() {
  const [formData, setFormData] = useState<FormData>({
    gender: "male",
    age: 25,
    height: 175,
    weight: 75,
    activityLevel: "moderate",
    goal: "maintain",
  })
  const [results, setResults] = useState<Results | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)

  const activityLevels = [
    { value: "sedentary", label: "Sedentary", multiplier: 1.2 },
    { value: "light", label: "Lightly Active", multiplier: 1.375 },
    { value: "moderate", label: "Moderately Active", multiplier: 1.55 },
    { value: "active", label: "Very Active", multiplier: 1.725 },
    { value: "athlete", label: "Athlete", multiplier: 1.9 },
  ]

  const goals = [
    { value: "lose", label: "Fat Loss", icon: TrendingUp },
    { value: "maintain", label: "Maintain", icon: Target },
    { value: "gain", label: "Muscle Gain", icon: Dumbbell },
  ]

  const calculateResults = () => {
    setIsCalculating(true)
    
    // Simulate AI processing with a dramatic delay
    setTimeout(() => {
      const { gender, age, height, weight, activityLevel, goal } = formData
    
      const heightM = height / 100
      const bmi = weight / (heightM * heightM)
      
      let bmiCategory = ""
      if (bmi < 18.5) bmiCategory = "Underweight"
      else if (bmi < 25) bmiCategory = "Normal"
      else if (bmi < 30) bmiCategory = "Overweight"
      else bmiCategory = "Obese"

      let bmr: number
      if (gender === "male") {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
      }

      const activityMultiplier = activityLevels.find(a => a.value === activityLevel)?.multiplier || 1.55
      let dailyCalories = bmr * activityMultiplier
      
      if (goal === "lose") dailyCalories -= 500
      else if (goal === "gain") dailyCalories += 300

      const protein = weight * (goal === "gain" ? 2.2 : goal === "lose" ? 2 : 1.8)
      const fats = (dailyCalories * 0.25) / 9
      const carbs = (dailyCalories - (protein * 4 + fats * 9)) / 4

      const idealWeightMin = 18.5 * heightM * heightM
      const idealWeightMax = 24.9 * heightM * heightM
      const idealWeight = 21.5 * heightM * heightM
      const weightDiff = weight - idealWeight

      let fitacleScore = 50
      if (bmi >= 18.5 && bmi < 25) fitacleScore += 20
      else if (bmi >= 16 && bmi < 18.5) fitacleScore += 10
      else if (bmi >= 25 && bmi < 30) fitacleScore += 5
      
      if (activityLevel === "athlete") fitacleScore += 20
      else if (activityLevel === "active") fitacleScore += 15
      else if (activityLevel === "moderate") fitacleScore += 10
      else if (activityLevel === "light") fitacleScore += 5

      if (age >= 20 && age <= 40) fitacleScore += 10
      else if (age >= 18 && age < 20) fitacleScore += 8
      else if (age > 40 && age <= 50) fitacleScore += 8
      else fitacleScore += 5

      fitacleScore = Math.min(100, Math.max(0, fitacleScore))

      setResults({
        bmi,
        bmiCategory,
        dailyCalories,
        protein,
        carbs,
        fats,
        idealWeightMin,
        idealWeightMax,
        weightDiff,
        fitacleScore,
      })
      setIsCalculating(false)
      setShowResults(true)
    }, 1500)
  }

  return (
    <section id="analyzer" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent/50 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/50 rounded-full blur-3xl" />
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
            <Calculator size={14} />
            Premium Body Analysis
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-foreground">
            Unlock Your Body Intelligence
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get personalized insights powered by advanced algorithms
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="bg-card border border-border rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm hover:shadow-lg transition-shadow duration-500"
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-5 sm:mb-8 flex items-center gap-3 text-foreground">
              <div className="p-2 rounded-xl bg-foreground">
                <Scale size={18} className="text-background sm:w-5 sm:h-5" />
              </div>
              Your Body Metrics
            </h3>

            <div className="space-y-6">
              {/* Gender */}
              <div>
                <label className="block text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">Gender</label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {["male", "female"].map((g) => (
                    <motion.button
                      key={g}
                      onClick={() => setFormData({ ...formData, gender: g as "male" | "female" })}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`py-3 px-4 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                        formData.gender === g
                          ? "bg-foreground text-background shadow-lg"
                          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Age, Height, Weight - Cleaner mobile layout */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { label: "Age", key: "age", suffix: "years", min: 16, max: 80 },
                  { label: "Height", key: "height", suffix: "cm", min: 140, max: 220 },
                  { label: "Weight", key: "weight", suffix: "kg", min: 40, max: 200 },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">{field.label}</label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        inputMode="numeric"
                        value={formData[field.key as keyof FormData] as number}
                        onChange={(e) =>
                          setFormData({ ...formData, [field.key]: Number(e.target.value) })
                        }
                        min={field.min}
                        max={field.max}
                        className="w-full py-3 px-4 pr-14 bg-secondary border border-border rounded-xl text-foreground text-center font-medium focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all text-base"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-secondary px-1">
                        {field.suffix}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">Activity Level</label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                  className="w-full py-3 px-4 bg-secondary border border-border rounded-xl text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all appearance-none cursor-pointer text-sm sm:text-base"
                >
                  {activityLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Goal - Better mobile touch targets */}
              <div>
                <label className="block text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">Your Goal</label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {goals.map((g) => (
                    <motion.button
                      key={g.value}
                      onClick={() => setFormData({ ...formData, goal: g.value })}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`py-3 sm:py-4 px-2 sm:px-4 rounded-xl font-medium transition-all duration-300 flex flex-col items-center gap-1.5 sm:gap-2 ${
                        formData.goal === g.value
                          ? "bg-foreground text-background shadow-lg"
                          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                      }`}
                    >
                      <g.icon size={18} className="sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm">{g.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.button
                onClick={calculateResults}
                disabled={isCalculating}
                whileHover={{ scale: isCalculating ? 1 : 1.01 }}
                whileTap={{ scale: isCalculating ? 1 : 0.99 }}
                className="w-full py-4 bg-foreground text-background rounded-xl font-semibold text-lg flex items-center justify-center gap-3 hover:bg-foreground/90 transition-all duration-300 mt-4 disabled:opacity-80 relative overflow-hidden"
              >
                {isCalculating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles size={20} />
                    </motion.div>
                    Analyzing...
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent"
                      animate={{ x: ["-200%", "200%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Analyze My Body
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {showResults && results && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                {/* Fitacle Score Card */}
                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <CircularProgress score={results.fitacleScore} />
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl font-semibold mb-2 text-foreground">Your Fitacle Score</h3>
                      <p className="text-muted-foreground mb-4">
                        {results.fitacleScore >= 80
                          ? "Excellent! You're in peak condition."
                          : results.fitacleScore >= 60
                          ? "Great progress! Keep pushing."
                          : results.fitacleScore >= 40
                          ? "Good start! Room for improvement."
                          : "Let's begin your transformation."}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["Energy", "Consistency", "Health"].map((label, i) => (
                          <span
                            key={label}
                            className="px-3 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground"
                          >
                            {label}: {Math.max(20, results.fitacleScore - i * 5)}%
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* BMI & Calories */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-secondary">
                        <Scale size={18} className="text-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">BMI Score</span>
                    </div>
                    <div className="text-3xl font-semibold text-foreground mb-1">
                      <AnimatedNumber value={results.bmi} decimals={1} />
                    </div>
                    <span className={`text-sm font-medium ${
                      results.bmiCategory === "Normal" ? "text-success" : "text-muted-foreground"
                    }`}>
                      {results.bmiCategory}
                    </span>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-secondary">
                        <Flame size={18} className="text-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">Daily Calories</span>
                    </div>
                    <div className="text-3xl font-semibold text-foreground mb-1">
                      <AnimatedNumber value={results.dailyCalories} suffix=" kcal" />
                    </div>
                    <span className="text-sm text-muted-foreground">Target intake</span>
                  </div>
                </div>

                {/* Macros */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-secondary">
                      <Target size={18} className="text-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">Daily Macros</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Protein", value: results.protein, color: "bg-foreground" },
                      { label: "Carbs", value: results.carbs, color: "bg-success" },
                      { label: "Fats", value: results.fats, color: "bg-chart-4" },
                    ].map((macro) => (
                      <div key={macro.label} className="text-center">
                        <div className="text-2xl font-semibold text-foreground">
                          <AnimatedNumber value={macro.value} suffix="g" />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{macro.label}</div>
                        <div className="h-1 rounded-full bg-secondary mt-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full ${macro.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ideal Weight */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-secondary">
                      <Heart size={18} className="text-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">Ideal Weight Range</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-semibold text-foreground">
                      <AnimatedNumber value={results.idealWeightMin} decimals={1} />
                    </span>
                    <span className="text-muted-foreground">—</span>
                    <span className="text-2xl font-semibold text-foreground">
                      <AnimatedNumber value={results.idealWeightMax} decimals={1} suffix=" kg" />
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${
                    Math.abs(results.weightDiff) <= 2 ? "text-success" : "text-muted-foreground"
                  }`}>
                    {results.weightDiff > 2
                      ? `${results.weightDiff.toFixed(1)} kg to lose`
                      : results.weightDiff < -2
                      ? `${Math.abs(results.weightDiff).toFixed(1)} kg to gain`
                      : "You're in the ideal range!"}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!showResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center bg-card border border-border rounded-3xl p-12"
            >
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-secondary mx-auto mb-6 flex items-center justify-center">
                  <Sparkles size={40} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Ready to Analyze</h3>
                <p className="text-muted-foreground max-w-xs">
                  Fill in your metrics and discover your personalized fitness insights
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
