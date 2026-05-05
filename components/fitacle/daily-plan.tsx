"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Utensils, Sun, Cloud, Moon, Coffee, ArrowRight, Leaf, Flame, 
  Dumbbell, Instagram, MessageCircle, ChevronRight, Sparkles,
  Heart, Target, TrendingUp
} from "lucide-react"

type GoalType = "lose" | "maintain" | "gain"
type CuisineType = "international" | "indian"

interface MealItem {
  name: string
  calories: number
  protein: number
}

interface Meal {
  icon: typeof Sun
  time: string
  name: string
  items: MealItem[]
  totalCalories: number
  totalProtein: number
}

interface MealPlan {
  breakfast: Meal
  lunch: Meal
  dinner: Meal
  snacks: Meal
}

// International meal plans by goal
const internationalMealPlans: Record<GoalType, MealPlan> = {
  lose: {
    breakfast: {
      icon: Sun,
      time: "7:00 AM",
      name: "Light Power Start",
      items: [
        { name: "Egg White Omelette", calories: 120, protein: 20 },
        { name: "Avocado Toast (Half)", calories: 150, protein: 4 },
        { name: "Green Smoothie", calories: 95, protein: 3 },
        { name: "Black Coffee", calories: 5, protein: 0 },
      ],
      totalCalories: 370,
      totalProtein: 27,
    },
    lunch: {
      icon: Cloud,
      time: "12:30 PM",
      name: "Lean & Clean",
      items: [
        { name: "Grilled Chicken Salad", calories: 280, protein: 42 },
        { name: "Quinoa (Small)", calories: 120, protein: 5 },
        { name: "Steamed Veggies", calories: 80, protein: 4 },
        { name: "Lemon Vinaigrette", calories: 45, protein: 0 },
      ],
      totalCalories: 525,
      totalProtein: 51,
    },
    dinner: {
      icon: Moon,
      time: "6:30 PM",
      name: "Light Evening",
      items: [
        { name: "Grilled Fish", calories: 220, protein: 35 },
        { name: "Cauliflower Rice", calories: 50, protein: 2 },
        { name: "Sauteed Spinach", calories: 45, protein: 3 },
        { name: "Herb Sauce", calories: 30, protein: 0 },
      ],
      totalCalories: 345,
      totalProtein: 40,
    },
    snacks: {
      icon: Coffee,
      time: "Between Meals",
      name: "Smart Snacks",
      items: [
        { name: "Greek Yogurt (Low Fat)", calories: 100, protein: 17 },
        { name: "Cucumber Slices", calories: 15, protein: 1 },
        { name: "Green Tea", calories: 0, protein: 0 },
        { name: "Almonds (15g)", calories: 85, protein: 3 },
      ],
      totalCalories: 200,
      totalProtein: 21,
    },
  },
  maintain: {
    breakfast: {
      icon: Sun,
      time: "7:00 AM",
      name: "Balanced Breakfast",
      items: [
        { name: "Whole Eggs (2)", calories: 180, protein: 14 },
        { name: "Whole Grain Toast", calories: 140, protein: 5 },
        { name: "Fresh Fruit Bowl", calories: 120, protein: 2 },
        { name: "Coffee with Milk", calories: 45, protein: 2 },
      ],
      totalCalories: 485,
      totalProtein: 23,
    },
    lunch: {
      icon: Cloud,
      time: "12:30 PM",
      name: "Power Lunch",
      items: [
        { name: "Grilled Chicken Breast", calories: 280, protein: 52 },
        { name: "Brown Rice", calories: 220, protein: 5 },
        { name: "Mixed Vegetables", calories: 100, protein: 4 },
        { name: "Olive Oil Dressing", calories: 90, protein: 0 },
      ],
      totalCalories: 690,
      totalProtein: 61,
    },
    dinner: {
      icon: Moon,
      time: "7:00 PM",
      name: "Complete Dinner",
      items: [
        { name: "Salmon Fillet", calories: 320, protein: 38 },
        { name: "Sweet Potato", calories: 160, protein: 4 },
        { name: "Asparagus", calories: 40, protein: 3 },
        { name: "Lemon Butter", calories: 60, protein: 0 },
      ],
      totalCalories: 580,
      totalProtein: 45,
    },
    snacks: {
      icon: Coffee,
      time: "Between Meals",
      name: "Healthy Snacks",
      items: [
        { name: "Protein Bar", calories: 200, protein: 20 },
        { name: "Apple with Peanut Butter", calories: 190, protein: 5 },
        { name: "Mixed Nuts (30g)", calories: 180, protein: 5 },
        { name: "Banana", calories: 105, protein: 1 },
      ],
      totalCalories: 675,
      totalProtein: 31,
    },
  },
  gain: {
    breakfast: {
      icon: Sun,
      time: "7:00 AM",
      name: "Mass Builder",
      items: [
        { name: "Whole Eggs (4)", calories: 360, protein: 28 },
        { name: "Oatmeal with Honey", calories: 280, protein: 8 },
        { name: "Banana & Berries", calories: 150, protein: 2 },
        { name: "Whole Milk", calories: 150, protein: 8 },
      ],
      totalCalories: 940,
      totalProtein: 46,
    },
    lunch: {
      icon: Cloud,
      time: "12:30 PM",
      name: "Muscle Fuel",
      items: [
        { name: "Double Chicken Breast", calories: 480, protein: 84 },
        { name: "White Rice (Large)", calories: 350, protein: 7 },
        { name: "Avocado", calories: 240, protein: 3 },
        { name: "Olive Oil", calories: 120, protein: 0 },
      ],
      totalCalories: 1190,
      totalProtein: 94,
    },
    dinner: {
      icon: Moon,
      time: "7:30 PM",
      name: "Growth Dinner",
      items: [
        { name: "Ribeye Steak", calories: 450, protein: 52 },
        { name: "Baked Potato", calories: 280, protein: 6 },
        { name: "Broccoli with Cheese", calories: 150, protein: 8 },
        { name: "Garlic Butter", calories: 100, protein: 0 },
      ],
      totalCalories: 980,
      totalProtein: 66,
    },
    snacks: {
      icon: Coffee,
      time: "Between Meals",
      name: "Calorie Boosters",
      items: [
        { name: "Mass Gainer Shake", calories: 450, protein: 35 },
        { name: "Trail Mix (60g)", calories: 340, protein: 10 },
        { name: "Cheese & Crackers", calories: 220, protein: 10 },
        { name: "Peanut Butter Sandwich", calories: 380, protein: 14 },
      ],
      totalCalories: 1390,
      totalProtein: 69,
    },
  },
}

// Indian meal plans by goal
const indianMealPlans: Record<GoalType, MealPlan> = {
  lose: {
    breakfast: {
      icon: Sun,
      time: "7:00 AM",
      name: "Light Indian Start",
      items: [
        { name: "Moong Dal Chilla", calories: 150, protein: 12 },
        { name: "Mint Chutney", calories: 20, protein: 1 },
        { name: "Buttermilk (Chaas)", calories: 40, protein: 3 },
        { name: "Green Tea", calories: 0, protein: 0 },
      ],
      totalCalories: 210,
      totalProtein: 16,
    },
    lunch: {
      icon: Cloud,
      time: "12:30 PM",
      name: "Satvik Lunch",
      items: [
        { name: "Tandoori Chicken (Boneless)", calories: 220, protein: 38 },
        { name: "Brown Rice Pulao (Small)", calories: 140, protein: 4 },
        { name: "Mixed Vegetable Sabzi", calories: 80, protein: 3 },
        { name: "Raita (Low Fat)", calories: 45, protein: 3 },
      ],
      totalCalories: 485,
      totalProtein: 48,
    },
    dinner: {
      icon: Moon,
      time: "6:30 PM",
      name: "Light Dinner",
      items: [
        { name: "Fish Curry (No Oil)", calories: 180, protein: 32 },
        { name: "Jowar Roti", calories: 70, protein: 3 },
        { name: "Palak Sabzi", calories: 60, protein: 4 },
        { name: "Salad", calories: 30, protein: 1 },
      ],
      totalCalories: 340,
      totalProtein: 40,
    },
    snacks: {
      icon: Coffee,
      time: "Between Meals",
      name: "Healthy Indian Snacks",
      items: [
        { name: "Roasted Chana", calories: 100, protein: 8 },
        { name: "Sprouts Chaat", calories: 80, protein: 6 },
        { name: "Coconut Water", calories: 45, protein: 0 },
        { name: "Makhana (Roasted)", calories: 65, protein: 3 },
      ],
      totalCalories: 290,
      totalProtein: 17,
    },
  },
  maintain: {
    breakfast: {
      icon: Sun,
      time: "7:30 AM",
      name: "Traditional Breakfast",
      items: [
        { name: "Poha with Peanuts", calories: 280, protein: 8 },
        { name: "Boiled Eggs (2)", calories: 140, protein: 12 },
        { name: "Fresh Fruit", calories: 80, protein: 1 },
        { name: "Masala Chai", calories: 60, protein: 2 },
      ],
      totalCalories: 560,
      totalProtein: 23,
    },
    lunch: {
      icon: Cloud,
      time: "1:00 PM",
      name: "Complete Thali",
      items: [
        { name: "Chicken Curry", calories: 320, protein: 42 },
        { name: "Jeera Rice", calories: 220, protein: 5 },
        { name: "Dal Tadka", calories: 150, protein: 10 },
        { name: "Roti (2)", calories: 160, protein: 5 },
      ],
      totalCalories: 850,
      totalProtein: 62,
    },
    dinner: {
      icon: Moon,
      time: "7:30 PM",
      name: "Wholesome Dinner",
      items: [
        { name: "Paneer Tikka", calories: 280, protein: 22 },
        { name: "Multigrain Roti (2)", calories: 180, protein: 7 },
        { name: "Mixed Dal", calories: 140, protein: 9 },
        { name: "Cucumber Raita", calories: 60, protein: 3 },
      ],
      totalCalories: 660,
      totalProtein: 41,
    },
    snacks: {
      icon: Coffee,
      time: "Between Meals",
      name: "Indian Snacks",
      items: [
        { name: "Paneer Bhurji (Small)", calories: 180, protein: 14 },
        { name: "Dates & Almonds", calories: 150, protein: 4 },
        { name: "Lassi (Sweet)", calories: 180, protein: 6 },
        { name: "Dhokla (2 pcs)", calories: 140, protein: 5 },
      ],
      totalCalories: 650,
      totalProtein: 29,
    },
  },
  gain: {
    breakfast: {
      icon: Sun,
      time: "7:00 AM",
      name: "Muscle Building Start",
      items: [
        { name: "Aloo Paratha (2)", calories: 480, protein: 10 },
        { name: "Paneer Bhurji", calories: 280, protein: 22 },
        { name: "Curd", calories: 100, protein: 5 },
        { name: "Banana Shake", calories: 280, protein: 10 },
      ],
      totalCalories: 1140,
      totalProtein: 47,
    },
    lunch: {
      icon: Cloud,
      time: "1:00 PM",
      name: "Heavy Thali",
      items: [
        { name: "Butter Chicken (Large)", calories: 520, protein: 48 },
        { name: "Biryani Rice", calories: 380, protein: 8 },
        { name: "Dal Makhani", calories: 280, protein: 12 },
        { name: "Butter Naan (2)", calories: 340, protein: 8 },
      ],
      totalCalories: 1520,
      totalProtein: 76,
    },
    dinner: {
      icon: Moon,
      time: "8:00 PM",
      name: "Growth Dinner",
      items: [
        { name: "Mutton Curry", calories: 450, protein: 42 },
        { name: "Ghee Rice", calories: 320, protein: 6 },
        { name: "Palak Paneer", calories: 280, protein: 16 },
        { name: "Tandoori Roti (2)", calories: 180, protein: 6 },
      ],
      totalCalories: 1230,
      totalProtein: 70,
    },
    snacks: {
      icon: Coffee,
      time: "Between Meals",
      name: "High Calorie Snacks",
      items: [
        { name: "Chana Masala", calories: 280, protein: 14 },
        { name: "Dry Fruit Milkshake", calories: 420, protein: 15 },
        { name: "Samosa (2)", calories: 300, protein: 6 },
        { name: "Peanut Chikki", calories: 220, protein: 8 },
      ],
      totalCalories: 1220,
      totalProtein: 43,
    },
  },
}

// Workout plans by goal
const workoutPlans: Record<GoalType, { title: string; exercises: { name: string; sets: string; focus: string }[] }> = {
  lose: {
    title: "Fat Burning Workout",
    exercises: [
      { name: "HIIT Cardio", sets: "20 min", focus: "Cardio" },
      { name: "Jump Squats", sets: "4x15", focus: "Lower Body" },
      { name: "Burpees", sets: "4x12", focus: "Full Body" },
      { name: "Mountain Climbers", sets: "4x30 sec", focus: "Core" },
      { name: "Plank Hold", sets: "3x45 sec", focus: "Core" },
    ],
  },
  maintain: {
    title: "Balanced Fitness",
    exercises: [
      { name: "Moderate Cardio", sets: "25 min", focus: "Cardio" },
      { name: "Squats", sets: "3x12", focus: "Lower Body" },
      { name: "Push-ups", sets: "3x15", focus: "Upper Body" },
      { name: "Dumbbell Rows", sets: "3x12", focus: "Back" },
      { name: "Core Circuit", sets: "3 rounds", focus: "Core" },
    ],
  },
  gain: {
    title: "Muscle Building",
    exercises: [
      { name: "Bench Press", sets: "4x8-10", focus: "Chest" },
      { name: "Deadlifts", sets: "4x6-8", focus: "Back/Legs" },
      { name: "Squats", sets: "4x8-10", focus: "Legs" },
      { name: "Overhead Press", sets: "4x8-10", focus: "Shoulders" },
      { name: "Barbell Rows", sets: "4x8-10", focus: "Back" },
    ],
  },
}

const goalInfo: Record<GoalType, { label: string; icon: typeof Target; color: string }> = {
  lose: { label: "Fat Loss", icon: TrendingUp, color: "text-red-500" },
  maintain: { label: "Maintain", icon: Target, color: "text-blue-500" },
  gain: { label: "Muscle Gain", icon: Dumbbell, color: "text-green-500" },
}

export function DailyPlan() {
  const [selectedGoal, setSelectedGoal] = useState<GoalType>("maintain")
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType>("indian")

  const mealPlan = selectedCuisine === "indian" 
    ? indianMealPlans[selectedGoal] 
    : internationalMealPlans[selectedGoal]
  
  const workout = workoutPlans[selectedGoal]

  const totalDayCalories = Object.values(mealPlan).reduce((acc, meal) => acc + meal.totalCalories, 0)
  const totalDayProtein = Object.values(mealPlan).reduce((acc, meal) => acc + meal.totalProtein, 0)

  return (
    <section id="plan" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/30 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-background/50 rounded-full blur-3xl" 
        />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background border border-border text-xs font-medium text-muted-foreground mb-6"
          >
            <Utensils size={14} />
            Personalized Nutrition + Workout
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-foreground">
            Your Custom Plan
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tailored meals and workouts designed for your specific goal
          </p>
        </motion.div>

        {/* Goal & Cuisine Selectors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
          {/* Goal Selector */}
          <div className="flex gap-2 p-1.5 bg-card border border-border rounded-2xl">
            {(Object.keys(goalInfo) as GoalType[]).map((goal) => {
              const info = goalInfo[goal]
              return (
                <motion.button
                  key={goal}
                  onClick={() => setSelectedGoal(goal)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                    selectedGoal === goal
                      ? "bg-foreground text-background shadow-lg"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <info.icon size={16} />
                  {info.label}
                </motion.button>
              )
            })}
          </div>

          {/* Cuisine Selector */}
          <div className="flex gap-2 p-1.5 bg-card border border-border rounded-2xl">
            {[
              { value: "indian" as CuisineType, label: "Indian", flag: "🇮🇳" },
              { value: "international" as CuisineType, label: "International", flag: "🌍" },
            ].map((cuisine) => (
              <motion.button
                key={cuisine.value}
                onClick={() => setSelectedCuisine(cuisine.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                  selectedCuisine === cuisine.value
                    ? "bg-foreground text-background shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{cuisine.flag}</span>
                {cuisine.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Daily Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-card border border-border rounded-3xl p-6 md:p-8 mb-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2 text-foreground flex items-center gap-2 justify-center md:justify-start">
                <Sparkles className="text-yellow-500" size={20} />
                Daily Overview - {goalInfo[selectedGoal].label}
              </h3>
              <p className="text-muted-foreground">Optimized {selectedCuisine === "indian" ? "Indian" : "International"} cuisine for your goal</p>
            </div>
            <div className="flex gap-6 md:gap-8">
              <div className="text-center">
                <motion.div 
                  key={totalDayCalories}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl md:text-3xl font-semibold text-foreground"
                >
                  {totalDayCalories}
                </motion.div>
                <div className="text-xs md:text-sm text-muted-foreground">Total Calories</div>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <motion.div 
                  key={totalDayProtein}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl md:text-3xl font-semibold text-foreground"
                >
                  {totalDayProtein}g
                </motion.div>
                <div className="text-xs md:text-sm text-muted-foreground">Total Protein</div>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-semibold text-success">4</div>
                <div className="text-xs md:text-sm text-muted-foreground">Meals</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Meal Cards */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${selectedGoal}-${selectedCuisine}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-4 md:gap-6 mb-12"
          >
            {Object.entries(mealPlan).map(([key, meal], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-xl transition-all duration-500 group"
              >
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <motion.div 
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className="p-2.5 md:p-3 rounded-xl bg-foreground group-hover:scale-105 transition-transform duration-300"
                    >
                      <meal.icon size={20} className="text-background md:w-6 md:h-6" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-base md:text-lg text-foreground">{meal.name}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">{meal.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg md:text-xl font-semibold text-foreground">{meal.totalCalories}</div>
                    <div className="text-xs text-muted-foreground">calories</div>
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  {meal.items.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                    >
                      <span className="text-xs md:text-sm text-foreground">{item.name}</span>
                      <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Flame size={10} className="md:w-3 md:h-3" />
                          {item.calories}
                        </span>
                        <span className="text-foreground font-medium">{item.protein}g</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs md:text-sm text-muted-foreground">Total Protein</span>
                  <span className="font-semibold text-foreground">{meal.totalProtein}g</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Workout Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm mb-8"
        >
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <motion.div 
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-3 rounded-xl bg-foreground"
            >
              <Dumbbell size={24} className="text-background" />
            </motion.div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">{workout.title}</h3>
              <p className="text-sm text-muted-foreground">Recommended workout for {goalInfo[selectedGoal].label.toLowerCase()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            {workout.exercises.map((exercise, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="bg-secondary/50 rounded-xl p-4 hover:bg-secondary transition-all duration-300 group cursor-pointer"
              >
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Heart size={10} className="group-hover:text-red-500 transition-colors" />
                  {exercise.focus}
                </div>
                <div className="font-medium text-sm text-foreground mb-1">{exercise.name}</div>
                <div className="text-xs font-semibold text-muted-foreground">{exercise.sets}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Instagram CTA for Custom Workout */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden"
        >
          <motion.div
            animate={{ 
              background: [
                "linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1), rgba(249, 115, 22, 0.1))",
                "linear-gradient(90deg, rgba(249, 115, 22, 0.1), rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))",
                "linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(249, 115, 22, 0.1), rgba(147, 51, 234, 0.1))",
              ]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="rounded-3xl border border-pink-500/20 p-6 md:p-10"
          >
            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-40"
                  animate={{
                    y: [100, -20],
                    x: [Math.random() * 100, Math.random() * 100],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                  style={{ left: `${10 + i * 15}%` }}
                />
              ))}
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 relative">
              <motion.div 
                animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-xl shadow-pink-500/20"
              >
                <Instagram size={36} className="text-white md:w-12 md:h-12" />
              </motion.div>
              
              <div className="flex-1 text-center lg:text-left">
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-xl md:text-2xl font-semibold text-foreground mb-2"
                >
                  Want a Custom Workout Plan?
                </motion.h3>
                <p className="text-muted-foreground mb-4 text-sm md:text-base">
                  Get personalized workout routines tailored to your body type and goals. 
                  DM us on Instagram for a detailed plan to achieve your transformation within the timeline!
                </p>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {["Personalized Plans", "Expert Guidance", "Free Consultation"].map((tag, i) => (
                    <motion.span 
                      key={tag}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="px-3 py-1 rounded-full bg-background/80 border border-border text-xs font-medium text-muted-foreground"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>

              <motion.a
                href="https://instagram.com/fitacle_official"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-2xl font-semibold shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 group"
              >
                <MessageCircle size={20} className="group-hover:animate-pulse" />
                <span>DM Us Now</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
