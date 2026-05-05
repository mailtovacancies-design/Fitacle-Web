"use client"

import { motion } from "framer-motion"
import { Utensils, Sun, Cloud, Moon, Coffee, ArrowRight, Leaf, Flame } from "lucide-react"

const mealPlan = {
  breakfast: {
    icon: Sun,
    time: "7:00 AM",
    name: "Power Breakfast",
    items: [
      { name: "Greek Yogurt Bowl", calories: 320, protein: 22 },
      { name: "Mixed Berries", calories: 85, protein: 1 },
      { name: "Granola & Honey", calories: 180, protein: 4 },
      { name: "Black Coffee", calories: 5, protein: 0 },
    ],
    totalCalories: 590,
    totalProtein: 27,
  },
  lunch: {
    icon: Cloud,
    time: "12:30 PM",
    name: "Balanced Lunch",
    items: [
      { name: "Grilled Chicken Breast", calories: 280, protein: 52 },
      { name: "Quinoa Salad", calories: 220, protein: 8 },
      { name: "Roasted Vegetables", calories: 120, protein: 4 },
      { name: "Olive Oil Dressing", calories: 90, protein: 0 },
    ],
    totalCalories: 710,
    totalProtein: 64,
  },
  dinner: {
    icon: Moon,
    time: "7:00 PM",
    name: "Lean Dinner",
    items: [
      { name: "Salmon Fillet", calories: 350, protein: 40 },
      { name: "Sweet Potato", calories: 180, protein: 4 },
      { name: "Steamed Broccoli", calories: 55, protein: 4 },
      { name: "Lemon Herb Sauce", calories: 45, protein: 0 },
    ],
    totalCalories: 630,
    totalProtein: 48,
  },
  snacks: {
    icon: Coffee,
    time: "Throughout Day",
    name: "Smart Snacks",
    items: [
      { name: "Protein Shake", calories: 180, protein: 25 },
      { name: "Almonds (30g)", calories: 170, protein: 6 },
      { name: "Apple", calories: 95, protein: 0 },
      { name: "Rice Cakes", calories: 70, protein: 2 },
    ],
    totalCalories: 515,
    totalProtein: 33,
  },
}

const foodSwaps = [
  { bad: "White Bread", good: "Whole Grain Bread", savings: "-80 cal" },
  { bad: "Soda", good: "Sparkling Water", savings: "-150 cal" },
  { bad: "Chips", good: "Air-Popped Popcorn", savings: "-100 cal" },
  { bad: "Ice Cream", good: "Frozen Yogurt", savings: "-120 cal" },
  { bad: "Mayo", good: "Greek Yogurt", savings: "-90 cal" },
  { bad: "Candy Bar", good: "Dark Chocolate (70%)", savings: "-80 cal" },
]

export function DailyPlan() {
  const totalDayCalories = Object.values(mealPlan).reduce((acc, meal) => acc + meal.totalCalories, 0)
  const totalDayProtein = Object.values(mealPlan).reduce((acc, meal) => acc + meal.totalProtein, 0)

  return (
    <section id="plan" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-background/50 rounded-full blur-3xl" />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background border border-border text-xs font-medium text-muted-foreground mb-6">
            <Utensils size={14} />
            AI-Generated Nutrition
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-foreground">
            Your Daily Meal Blueprint
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Perfectly balanced meals designed for your goals
          </p>
        </motion.div>

        {/* Daily Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-card border border-border rounded-3xl p-8 mb-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Daily Overview</h3>
              <p className="text-muted-foreground">Optimized for sustainable results</p>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-3xl font-semibold text-foreground">{totalDayCalories}</div>
                <div className="text-sm text-muted-foreground">Total Calories</div>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <div className="text-3xl font-semibold text-foreground">{totalDayProtein}g</div>
                <div className="text-sm text-muted-foreground">Total Protein</div>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <div className="text-3xl font-semibold text-success">4</div>
                <div className="text-sm text-muted-foreground">Meals</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Meal Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {Object.entries(mealPlan).map(([key, meal], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-foreground group-hover:scale-105 transition-transform duration-300">
                    <meal.icon size={24} className="text-background" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{meal.name}</h3>
                    <p className="text-sm text-muted-foreground">{meal.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold text-foreground">{meal.totalCalories}</div>
                  <div className="text-xs text-muted-foreground">calories</div>
                </div>
              </div>

              <div className="space-y-3">
                {meal.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                  >
                    <span className="text-sm text-foreground">{item.name}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Flame size={12} />
                        {item.calories}
                      </span>
                      <span className="text-foreground font-medium">{item.protein}g</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Protein</span>
                <span className="font-semibold text-foreground">{meal.totalProtein}g</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Food Swaps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-card border border-border rounded-3xl p-8 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-foreground">
              <Leaf size={24} className="text-background" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">Smart Food Swaps</h3>
              <p className="text-sm text-muted-foreground">Simple changes, big results</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {foodSwaps.map((swap, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-secondary/50 rounded-xl p-4 hover:bg-secondary transition-colors duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-sm text-destructive line-through mb-1">{swap.bad}</div>
                    <div className="flex items-center gap-2">
                      <ArrowRight size={14} className="text-success" />
                      <span className="text-sm font-medium text-success">{swap.good}</span>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">
                    {swap.savings}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
