"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calculator, Scale, Target, Flame, Dumbbell, Heart, TrendingUp, Sparkles, Lock } from "lucide-react"

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
    <section id="analyzer" className="py-16 sm:py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent/50 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/50 rounded-full blur-3xl" />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-secondary text-[10px] sm:text-xs font-medium text-muted-foreground mb-4 sm:mb-6">
            <Calculator size={12} className="sm:w-3.5 sm:h-3.5" />
            Behavioral + Biological Analysis
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold mb-3 sm:mb-4 text-foreground px-2">
            Your Body Has a Language.
            <br />
            <span className="text-muted-foreground">We Decode It.</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto px-2 mb-2">
            Enter your metrics. Receive a full behavioural + biological analysis of your current state.
          </p>
          <p className="text-muted-foreground/70 text-xs sm:text-sm max-w-xl mx-auto px-2">
            Your body is not your problem. Your patterns are.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
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

            <div className="space-y-4 sm:space-y-6">
              {/* Gender */}
              <div>
                <label className="block text-[11px] sm:text-sm text-muted-foreground mb-1.5 sm:mb-3">Gender</label>
                <div className="grid grid-cols-2 gap-2">
                  {["male", "female"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setFormData({ ...formData, gender: g as "male" | "female" })}
                      className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-xs sm:text-base ${
                        formData.gender === g
                          ? "bg-foreground text-background shadow-md"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age, Height, Weight */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {[
                  { label: "Age", key: "age", suffix: "yrs", min: 16, max: 80 },
                  { label: "Height", key: "height", suffix: "cm", min: 140, max: 220 },
                  { label: "Weight", key: "weight", suffix: "kg", min: 40, max: 200 },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-[11px] sm:text-sm text-muted-foreground mb-1 sm:mb-2">{field.label}</label>
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
                        className="w-full py-2.5 sm:py-3 px-2 sm:px-4 pr-9 sm:pr-14 bg-secondary border border-border rounded-lg sm:rounded-xl text-foreground text-center font-medium focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all text-sm sm:text-base"
                      />
                      <span className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 text-[9px] sm:text-xs text-muted-foreground">
                        {field.suffix}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-[11px] sm:text-sm text-muted-foreground mb-1.5 sm:mb-3">Activity Level</label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                  className="w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-secondary border border-border rounded-lg sm:rounded-xl text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all appearance-none cursor-pointer text-xs sm:text-base"
                >
                  {activityLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-[11px] sm:text-sm text-muted-foreground mb-1.5 sm:mb-3">Your Goal</label>
                <div className="grid grid-cols-3 gap-2">
                  {goals.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => setFormData({ ...formData, goal: g.value })}
                      className={`py-2.5 sm:py-4 px-2 rounded-lg sm:rounded-xl font-medium transition-all duration-300 flex flex-col items-center gap-1 sm:gap-2 ${
                        formData.goal === g.value
                          ? "bg-foreground text-background shadow-md"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <g.icon size={16} className="sm:w-5 sm:h-5" />
                      <span className="text-[10px] sm:text-sm">{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                onClick={calculateResults}
                disabled={isCalculating}
                whileHover={{ scale: isCalculating ? 1 : 1.01 }}
                whileTap={{ scale: isCalculating ? 1 : 0.99 }}
                className="w-full py-3 sm:py-4 bg-foreground text-background rounded-lg sm:rounded-xl font-semibold text-sm sm:text-lg flex items-center justify-center gap-2 sm:gap-3 hover:bg-foreground/90 transition-all duration-300 mt-3 sm:mt-4 disabled:opacity-80 relative overflow-hidden"
              >
                {isCalculating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles size={18} className="sm:w-5 sm:h-5" />
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
                    <Sparkles size={18} className="sm:w-5 sm:h-5" />
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
                className="space-y-3 sm:space-y-6"
              >
                {/* Fitacle Score Card */}
                <div className="bg-card border border-border rounded-xl sm:rounded-3xl p-4 sm:p-8 shadow-sm">
                  <div className="flex flex-col items-center gap-4 sm:gap-8 md:flex-row">
                    <div className="scale-75 sm:scale-100 -my-4 sm:my-0">
                      <CircularProgress score={results.fitacleScore} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-base sm:text-2xl font-semibold mb-1 sm:mb-2 text-foreground">Your Fitacle Score</h3>
                      <p className="text-xs sm:text-base text-muted-foreground mb-2.5 sm:mb-4">
                        {results.fitacleScore >= 80
                          ? "Excellent! Peak condition."
                          : results.fitacleScore >= 60
                          ? "Great progress! Keep going."
                          : results.fitacleScore >= 40
                          ? "Good start! Room to grow."
                          : "Let's transform you."}
                      </p>
                      <div className="flex gap-1.5 sm:gap-2 justify-center md:justify-start">
                        {["Energy", "Focus", "Health"].map((label, i) => (
                          <span
                            key={label}
                            className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-secondary text-[9px] sm:text-xs font-medium text-muted-foreground"
                          >
                            {label}: {Math.max(20, results.fitacleScore - i * 5)}%
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* BMI & Calories */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-secondary">
                        <Scale size={14} className="text-foreground sm:w-[18px] sm:h-[18px]" />
                      </div>
                      <span className="text-xs sm:text-sm text-muted-foreground">BMI</span>
                    </div>
                    <div className="text-xl sm:text-3xl font-semibold text-foreground mb-0.5 sm:mb-1">
                      <AnimatedNumber value={results.bmi} decimals={1} />
                    </div>
                    <span className={`text-xs sm:text-sm font-medium ${
                      results.bmiCategory === "Normal" ? "text-success" : "text-muted-foreground"
                    }`}>
                      {results.bmiCategory}
                    </span>
                  </div>

                  <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-secondary">
                        <Flame size={14} className="text-foreground sm:w-[18px] sm:h-[18px]" />
                      </div>
                      <span className="text-xs sm:text-sm text-muted-foreground">Calories</span>
                    </div>
                    <div className="text-xl sm:text-3xl font-semibold text-foreground mb-0.5 sm:mb-1">
                      <AnimatedNumber value={results.dailyCalories} suffix="" />
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">kcal/day</span>
                  </div>
                </div>

                {/* Macros */}
                <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-secondary">
                      <Target size={14} className="text-foreground sm:w-[18px] sm:h-[18px]" />
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">Daily Macros</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {[
                      { label: "Protein", value: results.protein, color: "bg-foreground" },
                      { label: "Carbs", value: results.carbs, color: "bg-success" },
                      { label: "Fats", value: results.fats, color: "bg-chart-4" },
                    ].map((macro) => (
                      <div key={macro.label} className="text-center">
                        <div className="text-lg sm:text-2xl font-semibold text-foreground">
                          <AnimatedNumber value={macro.value} suffix="g" />
                        </div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">{macro.label}</div>
                        <div className="h-1 rounded-full bg-secondary mt-1.5 sm:mt-2 overflow-hidden">
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
                <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-secondary">
                      <Heart size={14} className="text-foreground sm:w-[18px] sm:h-[18px]" />
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">Ideal Weight Range</span>
                  </div>
                  <div className="flex items-baseline gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <span className="text-lg sm:text-2xl font-semibold text-foreground">
                      <AnimatedNumber value={results.idealWeightMin} decimals={1} />
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm">—</span>
                    <span className="text-lg sm:text-2xl font-semibold text-foreground">
                      <AnimatedNumber value={results.idealWeightMax} decimals={1} suffix=" kg" />
                    </span>
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${
                    Math.abs(results.weightDiff) <= 2 ? "text-success" : "text-muted-foreground"
                  }`}>
                    {results.weightDiff > 2
                      ? `${results.weightDiff.toFixed(1)} kg to lose`
                      : results.weightDiff < -2
                      ? `${Math.abs(results.weightDiff).toFixed(1)} kg to gain`
                      : "You're in ideal range!"}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!showResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center bg-card border border-border rounded-xl sm:rounded-3xl p-8 sm:p-12"
            >
              <div className="text-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-secondary mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                  <Sparkles size={28} className="text-muted-foreground sm:w-10 sm:h-10" />
                </div>
                <h3 className="text-base sm:text-xl font-semibold mb-1.5 sm:mb-2 text-foreground">Ready to Analyze</h3>
                <p className="text-xs sm:text-base text-muted-foreground max-w-xs">
                  Fill in your metrics to discover personalized insights
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
