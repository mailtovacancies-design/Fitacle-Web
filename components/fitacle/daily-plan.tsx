"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Utensils, Sun, Cloud, Moon, Coffee, ArrowRight, Leaf, Flame, 
  Dumbbell, Instagram, MessageCircle, ChevronRight, Sparkles,
  Heart, Target, TrendingUp
} from "lucide-react"

type GoalType = "lose" | "maintain" | "gain"
type CuisineType = "indian" | "arabic" | "asian" | "european"

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

// European meal plans by goal
const europeanMealPlans: Record<GoalType, MealPlan> = {
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

// Arabic meal plans by goal
const arabicMealPlans: Record<GoalType, MealPlan> = {
  lose: {
    breakfast: {
      icon: Sun,
      time: "7:00 AM",
      name: "Light Arabic Start",
      items: [
        { name: "Labneh (Low Fat)", calories: 80, protein: 8 },
        { name: "Whole Wheat Khubz", calories: 90, protein: 3 },
        { name: "Cucumber & Tomato", calories: 25, protein: 1 },
        { name: "Arabic Coffee", calories: 5, protein: 0 },
      ],
      totalCalories: 200,
      totalProtein: 12,
    },
    lunch: {
      icon: Cloud,
      time: "1:00 PM",
      name: "Lean Gulf Lunch",
      items: [
        { name: "Grilled Chicken Shawarma", calories: 280, protein: 38 },
        { name: "Tabbouleh Salad", calories: 120, protein: 3 },
        { name: "Hummus (Small)", calories: 80, protein: 4 },
        { name: "Grilled Vegetables", calories: 60, protein: 2 },
      ],
      totalCalories: 540,
      totalProtein: 47,
    },
    dinner: {
      icon: Moon,
      time: "7:00 PM",
      name: "Light Evening",
      items: [
        { name: "Grilled Fish (Hammour)", calories: 200, protein: 36 },
        { name: "Fattoush Salad", calories: 100, protein: 2 },
        { name: "Steamed Vegetables", calories: 50, protein: 2 },
        { name: "Lemon Tahini", calories: 40, protein: 1 },
      ],
      totalCalories: 390,
      totalProtein: 41,
    },
    snacks: {
      icon: Coffee,
      time: "Between Meals",
      name: "Healthy Gulf Snacks",
      items: [
        { name: "Dates (3 pcs)", calories: 70, protein: 1 },
        { name: "Mixed Nuts", calories: 100, protein: 4 },
        { name: "Green Tea", calories: 0, protein: 0 },
        { name: "Fresh Fruits", calories: 60, protein: 1 },
      ],
      totalCalories: 230,
      totalProtein: 6,
    },
  },
  maintain: {
    breakfast: {
      icon: Sun,
      time: "7:30 AM",
      name: "Traditional Breakfast",
      items: [
        { name: "Shakshuka", calories: 280, protein: 16 },
        { name: "Khubz Arabic", calories: 120, protein: 4 },
        { name: "Labneh with Olive Oil", calories: 150, protein: 6 },
        { name: "Chai Karak", calories: 80, protein: 2 },
      ],
      totalCalories: 630,
      totalProtein: 28,
    },
    lunch: {
      icon: Cloud,
      time: "1:30 PM",
      name: "Gulf Feast",
      items: [
        { name: "Chicken Machboos", calories: 450, protein: 38 },
        { name: "Mixed Grill (Small)", calories: 280, protein: 32 },
        { name: "Hummus & Muttabal", calories: 180, protein: 6 },
        { name: "Arabic Salad", calories: 80, protein: 2 },
      ],
      totalCalories: 990,
      totalProtein: 78,
    },
    dinner: {
      icon: Moon,
      time: "8:00 PM",
      name: "Evening Meal",
      items: [
        { name: "Lamb Kebab", calories: 320, protein: 28 },
        { name: "Saffron Rice", calories: 220, protein: 5 },
        { name: "Grilled Halloumi", calories: 150, protein: 12 },
        { name: "Yogurt Sauce", calories: 60, protein: 3 },
      ],
      totalCalories: 750,
      totalProtein: 48,
    },
    snacks: {
      icon: Coffee,
      time: "Between Meals",
      name: "Arabic Snacks",
      items: [
        { name: "Falafel (4 pcs)", calories: 240, protein: 10 },
        { name: "Dates with Tahini", calories: 180, protein: 4 },
        { name: "Fresh Juice", calories: 120, protein: 1 },
        { name: "Baklava (1 pc)", calories: 180, protein: 3 },
      ],
      totalCalories: 720,
      totalProtein: 18,
    },
  },
  gain: {
    breakfast: {
      icon: Sun,
      time: "7:00 AM",
      name: "Heavy Gulf Start",
      items: [
        { name: "Ful Medames", calories: 320, protein: 18 },
        { name: "Eggs with Ghee (3)", calories: 280, protein: 18 },
        { name: "Khubz with Honey", calories: 200, protein: 4 },
        { name: "Full Fat Laban", calories: 180, protein: 8 },
      ],
      totalCalories: 980,
      totalProtein: 48,
    },
    lunch: {
      icon: Cloud,
      time: "1:00 PM",
      name: "Feast Lunch",
      items: [
        { name: "Lamb Machboos (Large)", calories: 680, protein: 45 },
        { name: "Mixed Grill Platter", calories: 480, protein: 52 },
        { name: "Hummus with Meat", calories: 280, protein: 14 },
        { name: "Arabic Bread (2)", calories: 240, protein: 6 },
      ],
      totalCalories: 1680,
      totalProtein: 117,
    },
    dinner: {
      icon: Moon,
      time: "8:30 PM",
      name: "Growth Dinner",
      items: [
        { name: "Lamb Shoulder", calories: 520, protein: 42 },
        { name: "Kabsa Rice", calories: 380, protein: 8 },
        { name: "Grilled Vegetables", calories: 100, protein: 3 },
        { name: "Tahini Sauce", calories: 120, protein: 3 },
      ],
      totalCalories: 1120,
      totalProtein: 56,
    },
    snacks: {
      icon: Coffee,
      time: "Between Meals",
      name: "Calorie Boosters",
      items: [
        { name: "Kunafa", calories: 380, protein: 6 },
        { name: "Date Shake", calories: 420, protein: 12 },
        { name: "Cheese Sambusa (3)", calories: 320, protein: 10 },
        { name: "Nuts & Dates Mix", calories: 280, protein: 8 },
      ],
      totalCalories: 1400,
      totalProtein: 36,
    },
  },
}

// Asian meal plans by goal
const asianMealPlans: Record<GoalType, MealPlan> = {
  lose: {
    breakfast: {
      icon: Sun,
      time: "7:00 AM",
      name: "Light Asian Start",
      items: [
        { name: "Miso Soup", calories: 50, protein: 4 },
        { name: "Steamed Rice (Small)", calories: 100, protein: 2 },
        { name: "Grilled Fish", calories: 120, protein: 22 },
        { name: "Green Tea", calories: 0, protein: 0 },
      ],
      totalCalories: 270,
      totalProtein: 28,
    },
    lunch: {
      icon: Cloud,
      time: "12:30 PM",
      name: "Lean Asian Lunch",
      items: [
        { name: "Chicken Pho", calories: 280, protein: 28 },
        { name: "Spring Rolls (Fresh)", calories: 80, protein: 4 },
        { name: "Edamame", calories: 100, protein: 9 },
        { name: "Green Salad", calories: 40, protein: 2 },
      ],
      totalCalories: 500,
      totalProtein: 43,
    },
    dinner: {
      icon: Moon,
      time: "6:30 PM",
      name: "Light Evening",
      items: [
        { name: "Steamed Fish (Cantonese)", calories: 180, protein: 32 },
        { name: "Bok Choy Stir Fry", calories: 60, protein: 3 },
        { name: "Brown Rice (Small)", calories: 80, protein: 2 },
        { name: "Ginger Sauce", calories: 20, protein: 0 },
      ],
      totalCalories: 340,
      totalProtein: 37,
    },
    snacks: {
      icon: Coffee,
      time: "Between Meals",
      name: "Healthy Asian Snacks",
      items: [
        { name: "Seaweed Snacks", calories: 30, protein: 2 },
        { name: "Edamame Pods", calories: 80, protein: 7 },
        { name: "Green Tea", calories: 0, protein: 0 },
        { name: "Fresh Fruit", calories: 60, protein: 1 },
      ],
      totalCalories: 170,
      totalProtein: 10,
    },
  },
  maintain: {
    breakfast: {
      icon: Sun,
      time: "7:30 AM",
      name: "Traditional Asian",
      items: [
        { name: "Congee with Chicken", calories: 280, protein: 18 },
        { name: "Dim Sum (3 pcs)", calories: 180, protein: 10 },
        { name: "Soy Milk", calories: 100, protein: 7 },
        { name: "Pickled Vegetables", calories: 20, protein: 1 },
      ],
      totalCalories: 580,
      totalProtein: 36,
    },
    lunch: {
      icon: Cloud,
      time: "1:00 PM",
      name: "Asian Fusion",
      items: [
        { name: "Teriyaki Chicken", calories: 380, protein: 42 },
        { name: "Jasmine Rice", calories: 220, protein: 4 },
        { name: "Miso Soup", calories: 50, protein: 4 },
        { name: "Vegetable Tempura", calories: 180, protein: 4 },
      ],
      totalCalories: 830,
      totalProtein: 54,
    },
    dinner: {
      icon: Moon,
      time: "7:30 PM",
      name: "Evening Feast",
      items: [
        { name: "Korean BBQ Beef", calories: 350, protein: 38 },
        { name: "Kimchi Fried Rice", calories: 280, protein: 8 },
        { name: "Banchan (Side Dishes)", calories: 120, protein: 5 },
        { name: "Seaweed Soup", calories: 40, protein: 3 },
      ],
      totalCalories: 790,
      totalProtein: 54,
    },
    snacks: {
      icon: Coffee,
      time: "Between Meals",
      name: "Asian Snacks",
      items: [
        { name: "Onigiri (Rice Ball)", calories: 180, protein: 5 },
        { name: "Mochi (2 pcs)", calories: 140, protein: 2 },
        { name: "Bubble Tea", calories: 200, protein: 2 },
        { name: "Dried Fruits", calories: 120, protein: 1 },
      ],
      totalCalories: 640,
      totalProtein: 10,
    },
  },
  gain: {
    breakfast: {
      icon: Sun,
      time: "7:00 AM",
      name: "Heavy Asian Start",
      items: [
        { name: "Nasi Lemak", calories: 520, protein: 18 },
        { name: "Eggs (3)", calories: 210, protein: 18 },
        { name: "Fried Chicken", calories: 280, protein: 22 },
        { name: "Teh Tarik", calories: 120, protein: 3 },
      ],
      totalCalories: 1130,
      totalProtein: 61,
    },
    lunch: {
      icon: Cloud,
      time: "12:30 PM",
      name: "Muscle Fuel",
      items: [
        { name: "Char Siu Pork (Large)", calories: 480, protein: 42 },
        { name: "Fried Rice (Large)", calories: 420, protein: 12 },
        { name: "Gyoza (6 pcs)", calories: 280, protein: 14 },
        { name: "Ramen Soup", calories: 180, protein: 8 },
      ],
      totalCalories: 1360,
      totalProtein: 76,
    },
    dinner: {
      icon: Moon,
      time: "8:00 PM",
      name: "Growth Dinner",
      items: [
        { name: "Korean BBQ Platter", calories: 620, protein: 58 },
        { name: "Bibimbap", calories: 480, protein: 18 },
        { name: "Korean Fried Chicken", calories: 380, protein: 28 },
        { name: "Rice (Large)", calories: 280, protein: 5 },
      ],
      totalCalories: 1760,
      totalProtein: 109,
    },
    snacks: {
      icon: Coffee,
      time: "Between Meals",
      name: "Calorie Boosters",
      items: [
        { name: "Pork Buns (2)", calories: 380, protein: 14 },
        { name: "Mango Sticky Rice", calories: 320, protein: 4 },
        { name: "Thai Milk Tea", calories: 280, protein: 4 },
        { name: "Spring Rolls (4)", calories: 320, protein: 8 },
      ],
      totalCalories: 1300,
      totalProtein: 30,
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

  const getMealPlan = () => {
    switch (selectedCuisine) {
      case "indian": return indianMealPlans[selectedGoal]
      case "arabic": return arabicMealPlans[selectedGoal]
      case "asian": return asianMealPlans[selectedGoal]
      case "european": return europeanMealPlans[selectedGoal]
      default: return indianMealPlans[selectedGoal]
    }
  }
  
  const mealPlan = getMealPlan()
  
  const workout = workoutPlans[selectedGoal]

  const totalDayCalories = Object.values(mealPlan).reduce((acc, meal) => acc + meal.totalCalories, 0)
  const totalDayProtein = Object.values(mealPlan).reduce((acc, meal) => acc + meal.totalProtein, 0)

  return (
    <section id="plan" className="py-16 sm:py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration - static for performance */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-background/40 rounded-full blur-3xl" />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-background border border-border text-[10px] sm:text-xs font-medium text-muted-foreground mb-4 sm:mb-6"
          >
            <Utensils size={12} className="sm:w-3.5 sm:h-3.5" />
            Nutrition + Workout
          </motion.span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold mb-2 sm:mb-4 text-foreground">
            Your Custom Plan
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto px-2">
            Tailored meals and workouts for your goal
          </p>
        </motion.div>

        {/* Goal & Cuisine Selectors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-2.5 sm:gap-4 sm:flex-row justify-center items-center mb-5 sm:mb-8"
        >
          {/* Goal Selector */}
          <div className="flex gap-1 p-1 bg-card border border-border rounded-lg sm:rounded-2xl w-full sm:w-auto justify-center">
            {(Object.keys(goalInfo) as GoalType[]).map((goal) => {
              const info = goalInfo[goal]
              return (
                <button
                  key={goal}
                  onClick={() => setSelectedGoal(goal)}
                  className={`flex items-center justify-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-md sm:rounded-xl font-medium text-[11px] sm:text-sm transition-all duration-300 flex-1 sm:flex-initial ${
                    selectedGoal === goal
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <info.icon size={12} className="sm:w-4 sm:h-4" />
                  <span>{info.label}</span>
                </button>
              )
            })}
          </div>

          {/* Cuisine Selector */}
          <div className="flex gap-1 p-1 bg-card border border-border rounded-lg sm:rounded-2xl w-full sm:w-auto justify-center">
            {[
              { value: "indian" as CuisineType, label: "Indian", flag: "🇮🇳" },
              { value: "arabic" as CuisineType, label: "Arabic", flag: "🇸🇦" },
              { value: "asian" as CuisineType, label: "Asian", flag: "🇯🇵" },
              { value: "european" as CuisineType, label: "Europe", flag: "🇪🇺" },
            ].map((cuisine) => (
              <button
                key={cuisine.value}
                onClick={() => setSelectedCuisine(cuisine.value)}
                className={`flex items-center justify-center gap-1 px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-md sm:rounded-xl font-medium text-[11px] sm:text-sm transition-all duration-300 flex-1 sm:flex-initial ${
                  selectedCuisine === cuisine.value
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-sm sm:text-base">{cuisine.flag}</span>
                <span className="hidden xs:inline sm:inline">{cuisine.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Daily Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-card border border-border rounded-xl sm:rounded-3xl p-3 sm:p-6 md:p-8 mb-4 sm:mb-8 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
            <div className="text-center sm:text-left">
              <h3 className="text-sm sm:text-xl font-semibold text-foreground flex items-center gap-1.5 sm:gap-2 justify-center sm:justify-start">
                <Sparkles className="text-yellow-500 w-4 h-4 sm:w-5 sm:h-5" />
                {goalInfo[selectedGoal].label} Plan
              </h3>
              <p className="text-[10px] sm:text-sm text-muted-foreground mt-0.5">
                {selectedCuisine === "indian" ? "Indian" : selectedCuisine === "arabic" ? "Arabic" : selectedCuisine === "asian" ? "Asian" : "European"} Cuisine
              </p>
            </div>
            <div className="flex justify-center gap-4 sm:gap-6 py-2 sm:py-0">
              <div className="text-center">
                <motion.div 
                  key={totalDayCalories}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-base sm:text-2xl md:text-3xl font-bold text-foreground"
                >
                  {totalDayCalories}
                </motion.div>
                <div className="text-[9px] sm:text-xs text-muted-foreground">cal</div>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <motion.div 
                  key={totalDayProtein}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-base sm:text-2xl md:text-3xl font-bold text-foreground"
                >
                  {totalDayProtein}g
                </motion.div>
                <div className="text-[9px] sm:text-xs text-muted-foreground">protein</div>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <div className="text-base sm:text-2xl md:text-3xl font-bold text-success">4</div>
                <div className="text-[9px] sm:text-xs text-muted-foreground">meals</div>
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
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12"
          >
            {Object.entries(mealPlan).map(([key, meal], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                  <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4">
                    <div className="p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl bg-foreground">
                      <meal.icon size={16} className="text-background sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base md:text-lg text-foreground">{meal.name}</h3>
                      <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{meal.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base sm:text-lg md:text-xl font-semibold text-foreground">{meal.totalCalories}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">cal</div>
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                  {meal.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-1.5 sm:py-2 border-b border-border/50 last:border-0"
                    >
                      <span className="text-[11px] sm:text-xs md:text-sm text-foreground truncate max-w-[55%]">{item.name}</span>
                      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-xs md:text-sm">
                        <span className="text-muted-foreground flex items-center gap-0.5 sm:gap-1">
                          <Flame size={8} className="sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />
                          {item.calories}
                        </span>
                        <span className="text-foreground font-medium">{item.protein}g</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-2.5 sm:mt-3 md:mt-4 pt-2.5 sm:pt-3 md:pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Total Protein</span>
                  <span className="font-semibold text-sm sm:text-base text-foreground">{meal.totalProtein}g</span>
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
