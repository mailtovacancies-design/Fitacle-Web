// Nutrition Calculator using scientific formulas
// All calculations based on established fitness/nutrition science

export type Gender = 'male' | 'female'
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
export type FitnessGoal = 'lose' | 'maintain' | 'gain'

// Activity multipliers for TDEE calculation
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,      // Little or no exercise
  light: 1.375,        // Light exercise 1-3 days/week
  moderate: 1.55,      // Moderate exercise 3-5 days/week
  active: 1.725,       // Hard exercise 6-7 days/week
  very_active: 1.9     // Very hard exercise, physical job
}

// Protein multipliers based on goal
const PROTEIN_MULTIPLIERS: Record<FitnessGoal, number> = {
  maintain: 1.6,  // Maintenance
  lose: 1.8,      // Fat loss (higher to preserve muscle)
  gain: 2.0       // Muscle gain
}

// BMI = weight (kg) / height (m)²
export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100
  return weightKg / (heightM * heightM)
}

// BMI category
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 24.9) return 'Normal'
  if (bmi < 29.9) return 'Overweight'
  return 'Obese'
}

// BMR using Mifflin-St Jeor Equation (most accurate for most people)
// Male: BMR = 10W + 6.25H - 5A + 5
// Female: BMR = 10W + 6.25H - 5A - 161
export function calculateBMR(weightKg: number, heightCm: number, ageYears: number, gender: Gender): number {
  const base = (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears)
  return gender === 'male' ? base + 5 : base - 161
}

// TDEE = BMR × Activity Multiplier
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activityLevel]
}

// Target calories based on goal
// Loss: TDEE - 300 to 500 (we use -400 as middle ground)
// Maintain: TDEE
// Gain: TDEE + 200 to 350 (we use +275 as middle ground)
export function calculateTargetCalories(tdee: number, goal: FitnessGoal): number {
  switch (goal) {
    case 'lose': return Math.round(tdee - 400)
    case 'maintain': return Math.round(tdee)
    case 'gain': return Math.round(tdee + 275)
  }
}

// Protein = weight × multiplier based on goal
// Maintain: 1.6g/kg, Fat loss: 1.8g/kg, Gain: 2.0g/kg
export function calculateProtein(weightKg: number, goal: FitnessGoal): number {
  return Math.round(weightKg * PROTEIN_MULTIPLIERS[goal])
}

// Fat = weight × 0.9 (middle of 0.8-1.0 range) OR 27.5% kcal (middle of 25-30%)
// We use the higher of the two to ensure adequate fat intake
export function calculateFat(calories: number, weightKg: number): number {
  const fatByWeight = Math.round(weightKg * 0.9)
  const fatByCalories = Math.round((calories * 0.275) / 9)
  return Math.max(fatByWeight, fatByCalories)
}

// Carbs = (calories - (protein×4 + fat×9)) / 4
// Minimum 100g for active users
export function calculateCarbs(calories: number, proteinGrams: number, fatGrams: number): number {
  const carbs = Math.round((calories - (proteinGrams * 4 + fatGrams * 9)) / 4)
  return Math.max(carbs, 100) // Minimum 100g threshold
}

// Ideal weight range based on BMI 18.5-24.9
export function calculateIdealWeightRange(heightCm: number): { min: number; max: number } {
  const heightM = heightCm / 100
  return {
    min: Math.round(18.5 * heightM * heightM),
    max: Math.round(24.9 * heightM * heightM)
  }
}

// Complete macro calculation with validation
export interface MacroResult {
  bmi: number
  bmiCategory: string
  bmr: number
  tdee: number
  targetCalories: number
  protein: number  // grams
  fat: number      // grams
  carbs: number    // grams
  idealWeightRange: { min: number; max: number }
  // Verification that macros match calories
  calculatedCalories: number
}

export function calculateMacros(
  weightKg: number,
  heightCm: number,
  ageYears: number,
  gender: Gender,
  activityLevel: ActivityLevel,
  goal: FitnessGoal
): MacroResult {
  const bmi = calculateBMI(weightKg, heightCm)
  const bmiCategory = getBMICategory(bmi)
  const bmr = calculateBMR(weightKg, heightCm, ageYears, gender)
  const tdee = calculateTDEE(bmr, activityLevel)
  const targetCalories = calculateTargetCalories(tdee, goal)
  const protein = calculateProtein(weightKg, goal)
  const fat = calculateFat(targetCalories, weightKg)
  
  // Calculate carbs with minimum threshold
  let carbs = calculateCarbs(targetCalories, protein, fat)
  
  // If carbs hit minimum (100g), adjust fat down to balance calories
  const calculatedCalories = (protein * 4) + (fat * 9) + (carbs * 4)
  let adjustedFat = fat
  
  if (calculatedCalories > targetCalories + 50) {
    // Recalculate fat to balance if over by more than 50 cal
    const remainingCalories = targetCalories - (protein * 4) - (100 * 4) // 100g carbs minimum
    adjustedFat = Math.max(Math.round(remainingCalories / 9), Math.round(weightKg * 0.8))
    carbs = calculateCarbs(targetCalories, protein, adjustedFat)
  }
  
  const finalCalculatedCalories = (protein * 4) + (adjustedFat * 9) + (carbs * 4)
  const idealWeightRange = calculateIdealWeightRange(heightCm)

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories,
    protein,
    fat: adjustedFat,
    carbs,
    idealWeightRange,
    calculatedCalories: finalCalculatedCalories
  }
}

// Quick protein recommendation based on goal and weight
export function getProteinRecommendation(weightKg: number, goal: FitnessGoal): string {
  const protein = calculateProtein(weightKg, goal)
  const perMeal = Math.round(protein / 4) // Assuming 4 meals/day
  return `${protein}g daily (${perMeal}g per meal)`
}
