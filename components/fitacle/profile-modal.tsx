"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Instagram, Star, X, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

const experienceLevels = ["Beginner", "Intermediate", "Advanced"]
const activityOptions = [
  "Gym Workout",
  "Running",
  "Cycling",
  "Swimming",
  "Yoga",
  "CrossFit",
  "Boxing",
  "Martial Arts",
  "Calisthenics",
  "Hiking",
  "Home Workout",
  "Other",
]
const locationOptions = ["Gym", "Home", "Park", "Track", "Pool"]
const workoutTimeOptions = ["Morning", "Afternoon", "Evening", "Flexible"]
const goalOptions = ["Weight Loss", "Muscle Gain", "Strength", "Endurance", "General Fitness", "Stay Active"]

// Proper Case (Excel style): trim, collapse spaces, capitalize each word.
function toProperCase(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

// Split an existing combined name into first + last for editing.
// First token is the first name; everything after is the last name.
function splitFullName(value: string): { first: string; last: string } {
  const parts = (value || "").trim().replace(/\s+/g, " ").split(" ").filter(Boolean)
  if (parts.length === 0) return { first: "", last: "" }
  return { first: parts[0], last: parts.slice(1).join(" ") }
}

// Accept "@handle" or "handle", strip spaces and leading @.
function cleanInstagram(value: string) {
  return value.replace(/\s+/g, "").replace(/^@+/, "")
}

// Letters, spaces, hyphens, apostrophes and periods only.
const TEXT_ONLY = /^[A-Za-z\s'.-]+$/

interface ProfileModalProps {
  open: boolean
  onClose: () => void
}

export function ProfileModal({ open, onClose }: ProfileModalProps) {
  const [user, setUser] = useState<User | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [, setSuccess] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    instagram_id: "",
    age: "",
    country: "",
    city: "",
    preferred_location: "Gym",
    gym_name: "",
    weight_kg: "",
    height_cm: "",
    body_fat_percentage: "",
    fitness_focus: "Gym Workout",
    experience_level: "Beginner",
    schedule_preference: "Flexible",
    goal: "General Fitness",
    is_visible: true,
    is_trainer: false,
  })
  const [showTrainerNote, setShowTrainerNote] = useState(false)

  // Check user and load existing profile
  useEffect(() => {
    const checkUserAndLoadData = async () => {
      try {
        const supabase = createClient()
        if (!supabase) return
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          const { data: profile } = await supabase
            .from("fitness_partners")
            .select("*")
            .eq("user_id", user.id)
            .single()

          if (profile) {
            setHasProfile(true)
            const { first, last } = splitFullName(profile.full_name || "")
            setFormData({
              first_name: first,
              last_name: last,
              instagram_id: profile.instagram_id || "",
              age: profile.age?.toString() || "",
              country: profile.country || "",
              city: profile.city || "",
              // Preferred Location reuses the existing usual_gym_time column.
              preferred_location: locationOptions.includes(profile.usual_gym_time)
                ? profile.usual_gym_time
                : "Gym",
              gym_name: profile.gym_name || "",
              weight_kg: profile.weight_kg?.toString() || "",
              height_cm: profile.height_cm?.toString() || "",
              body_fat_percentage: profile.body_fat_percentage?.toString() || "",
              fitness_focus: activityOptions.includes(profile.fitness_focus)
                ? profile.fitness_focus
                : "Gym Workout",
              experience_level: experienceLevels.includes(profile.experience_level)
                ? profile.experience_level
                : "Beginner",
              schedule_preference: workoutTimeOptions.includes(profile.schedule_preference)
                ? profile.schedule_preference
                : "Flexible",
              goal: goalOptions.includes(profile.goal) ? profile.goal : "General Fitness",
              is_visible: profile.is_visible,
              is_trainer: profile.is_trainer || false,
            })
          }
        }
      } catch {
        // Supabase not configured
      }
    }

    checkUserAndLoadData()
  }, [])

  // Validation function
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.first_name.trim() || formData.first_name.trim().length < 2) {
      errors.first_name = "Please enter your first name (min 2 characters)"
    } else if (!TEXT_ONLY.test(formData.first_name.trim())) {
      errors.first_name = "First name must contain letters only"
    }

    // Last name is optional, but if provided it must be letters only.
    if (formData.last_name.trim() && !TEXT_ONLY.test(formData.last_name.trim())) {
      errors.last_name = "Last name must contain letters only"
    }

    // Instagram is optional. Validate only if provided.
    if (formData.instagram_id.trim()) {
      const handle = cleanInstagram(formData.instagram_id)
      if (handle.length < 2) {
        errors.instagram_id = "Please enter a valid Instagram username"
      }
    }

    if (formData.age) {
      const age = parseInt(formData.age)
      if (isNaN(age) || age < 16 || age > 100) {
        errors.age = "Enter realistic age (16-100)"
      }
    }

    if (!formData.country.trim() || formData.country.trim().length < 2) {
      errors.country = "Please enter your country"
    } else if (!TEXT_ONLY.test(formData.country.trim())) {
      errors.country = "Country must contain letters only"
    }

    if (!formData.city.trim() || formData.city.trim().length < 2) {
      errors.city = "Please enter your city"
    } else if (!TEXT_ONLY.test(formData.city.trim())) {
      errors.city = "City must contain letters only"
    }

    // Gym Name required only when Preferred Location is Gym.
    if (formData.preferred_location === "Gym") {
      if (!formData.gym_name.trim() || formData.gym_name.trim().length < 2) {
        errors.gym_name = "Please enter your gym name"
      }
    }

    if (formData.weight_kg) {
      const weight = parseFloat(formData.weight_kg)
      if (isNaN(weight) || weight < 30 || weight > 300) {
        errors.weight_kg = "Enter realistic weight (30-300 kg)"
      }
    }

    if (formData.height_cm) {
      const height = parseFloat(formData.height_cm)
      if (isNaN(height) || height < 100 || height > 250) {
        errors.height_cm = "Enter realistic height (100-250 cm)"
      }
    }

    if (formData.body_fat_percentage) {
      const bodyFat = parseFloat(formData.body_fat_percentage)
      if (isNaN(bodyFat) || bodyFat < 3 || bodyFat > 60) {
        errors.body_fat_percentage = "Enter realistic body fat (3-60%)"
      }
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!validateForm()) {
      setError("Please fix the errors below")
      return
    }

    const supabase = createClient()
    if (!supabase) return

    setSubmitting(true)
    setError(null)
    setFieldErrors({})

    try {
      // Combine first + last into the canonical full_name so all existing
      // readers (members showcase, navbar, messaging) keep working unchanged.
      const properName = [toProperCase(formData.first_name), toProperCase(formData.last_name)]
        .filter(Boolean)
        .join(" ")
      const isGym = formData.preferred_location === "Gym"

      const profileData = {
        user_id: user.id,
        full_name: properName,
        instagram_id: formData.instagram_id.trim() ? cleanInstagram(formData.instagram_id) : null,
        age: formData.age ? parseInt(formData.age) : null,
        country: formData.country.trim(),
        city: formData.city.trim(),
        // Preferred Location stored in the existing usual_gym_time column.
        usual_gym_time: formData.preferred_location,
        gym_name: isGym ? formData.gym_name.trim() : null,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
        body_fat_percentage: formData.body_fat_percentage ? parseFloat(formData.body_fat_percentage) : null,
        fitness_focus: formData.fitness_focus,
        experience_level: formData.experience_level,
        schedule_preference: formData.schedule_preference,
        goal: formData.goal,
        is_visible: formData.is_visible,
        is_trainer: formData.is_trainer,
        avatar_initial: properName.charAt(0).toUpperCase(),
      }

      if (hasProfile) {
        const { error } = await supabase.from("fitness_partners").update(profileData).eq("user_id", user.id)

        if (error) throw error
        setSuccess("Profile updated successfully!")
      } else {
        const { error } = await supabase.from("fitness_partners").insert(profileData)

        if (error) throw error
        setHasProfile(true)
        setSuccess("Welcome to the Fitness Partner Network!")
      }

      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile")
    } finally {
      setSubmitting(false)
    }
  }

  const isGymLocation = formData.preferred_location === "Gym"

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl overflow-hidden my-8"
          >
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  {hasProfile ? "Edit Your Profile" : "Create Your Profile"}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
                  <X size={20} className="text-muted-foreground" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-5">
                Used to improve partner matching and personalised recommendations.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmitProfile} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">First Name *</label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => {
                        setFormData({ ...formData, first_name: e.target.value })
                        if (fieldErrors.first_name) setFieldErrors({ ...fieldErrors, first_name: "" })
                      }}
                      onBlur={(e) => setFormData({ ...formData, first_name: toProperCase(e.target.value) })}
                      placeholder="Nithin"
                      className={`w-full px-3 py-2.5 bg-input border rounded-lg text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${fieldErrors.first_name ? "border-red-500" : "border-border"}`}
                    />
                    {fieldErrors.first_name && <p className="text-xs text-red-500 mt-1">{fieldErrors.first_name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => {
                        setFormData({ ...formData, last_name: e.target.value })
                        if (fieldErrors.last_name) setFieldErrors({ ...fieldErrors, last_name: "" })
                      }}
                      onBlur={(e) => setFormData({ ...formData, last_name: toProperCase(e.target.value) })}
                      placeholder="Francis"
                      className={`w-full px-3 py-2.5 bg-input border rounded-lg text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${fieldErrors.last_name ? "border-red-500" : "border-border"}`}
                    />
                    {fieldErrors.last_name && <p className="text-xs text-red-500 mt-1">{fieldErrors.last_name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Instagram (Optional)</label>
                    <div className="relative">
                      <Instagram size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={formData.instagram_id}
                        onChange={(e) => {
                          setFormData({ ...formData, instagram_id: e.target.value })
                          if (fieldErrors.instagram_id) setFieldErrors({ ...fieldErrors, instagram_id: "" })
                        }}
                        onBlur={(e) => setFormData({ ...formData, instagram_id: cleanInstagram(e.target.value) })}
                        placeholder="_its_nithin_"
                        className={`w-full pl-9 pr-3 py-2.5 bg-input border rounded-lg text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${fieldErrors.instagram_id ? "border-red-500" : "border-border"}`}
                      />
                    </div>
                    {fieldErrors.instagram_id && <p className="text-xs text-red-500 mt-1">{fieldErrors.instagram_id}</p>}
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Age</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formData.age}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "")
                      setFormData({ ...formData, age: val })
                      if (fieldErrors.age) setFieldErrors({ ...fieldErrors, age: "" })
                    }}
                    placeholder="28"
                    className={`w-full px-3 py-2.5 bg-input border rounded-lg text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${fieldErrors.age ? "border-red-500" : "border-border"}`}
                  />
                  {fieldErrors.age && <p className="text-xs text-red-500 mt-1">{fieldErrors.age}</p>}
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Country *</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => {
                        setFormData({ ...formData, country: e.target.value })
                        if (fieldErrors.country) setFieldErrors({ ...fieldErrors, country: "" })
                      }}
                      placeholder="United Kingdom"
                      className={`w-full px-3 py-2.5 bg-input border rounded-lg text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${fieldErrors.country ? "border-red-500" : "border-border"}`}
                    />
                    {fieldErrors.country && <p className="text-xs text-red-500 mt-1">{fieldErrors.country}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value })
                        if (fieldErrors.city) setFieldErrors({ ...fieldErrors, city: "" })
                      }}
                      placeholder="Telford"
                      className={`w-full px-3 py-2.5 bg-input border rounded-lg text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${fieldErrors.city ? "border-red-500" : "border-border"}`}
                    />
                    {fieldErrors.city && <p className="text-xs text-red-500 mt-1">{fieldErrors.city}</p>}
                  </div>
                </div>

                {/* Fitness: Activity + Preferred Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Primary Activity</label>
                    <select
                      value={formData.fitness_focus}
                      onChange={(e) => setFormData({ ...formData, fitness_focus: e.target.value })}
                      className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-base sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                    >
                      {activityOptions.map((activity) => (
                        <option key={activity} value={activity}>
                          {activity}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Preferred Location</label>
                    <select
                      value={formData.preferred_location}
                      onChange={(e) => {
                        setFormData({ ...formData, preferred_location: e.target.value })
                        if (fieldErrors.gym_name) setFieldErrors({ ...fieldErrors, gym_name: "" })
                      }}
                      className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-base sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                    >
                      {locationOptions.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Gym Name — only when Preferred Location is Gym */}
                {isGymLocation && (
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Gym Name *</label>
                    <input
                      type="text"
                      value={formData.gym_name}
                      onChange={(e) => {
                        setFormData({ ...formData, gym_name: e.target.value })
                        if (fieldErrors.gym_name) setFieldErrors({ ...fieldErrors, gym_name: "" })
                      }}
                      placeholder="The Gym Group"
                      className={`w-full px-3 py-2.5 bg-input border rounded-lg text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${fieldErrors.gym_name ? "border-red-500" : "border-border"}`}
                    />
                    {fieldErrors.gym_name && <p className="text-xs text-red-500 mt-1">{fieldErrors.gym_name}</p>}
                  </div>
                )}

                {/* Workout Time */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Workout Time</label>
                  <select
                    value={formData.schedule_preference}
                    onChange={(e) => setFormData({ ...formData, schedule_preference: e.target.value })}
                    className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-base sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                  >
                    {workoutTimeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Body Metrics */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Weight (kg)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={formData.weight_kg}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, "")
                        setFormData({ ...formData, weight_kg: val })
                        if (fieldErrors.weight_kg) setFieldErrors({ ...fieldErrors, weight_kg: "" })
                      }}
                      placeholder="94"
                      className={`w-full px-3 py-2.5 bg-input border rounded-lg text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${fieldErrors.weight_kg ? "border-red-500" : "border-border"}`}
                    />
                    {fieldErrors.weight_kg && <p className="text-xs text-red-500 mt-1">{fieldErrors.weight_kg}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Height (cm)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={formData.height_cm}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, "")
                        setFormData({ ...formData, height_cm: val })
                        if (fieldErrors.height_cm) setFieldErrors({ ...fieldErrors, height_cm: "" })
                      }}
                      placeholder="183"
                      className={`w-full px-3 py-2.5 bg-input border rounded-lg text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${fieldErrors.height_cm ? "border-red-500" : "border-border"}`}
                    />
                    {fieldErrors.height_cm && <p className="text-xs text-red-500 mt-1">{fieldErrors.height_cm}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Body Fat %</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={formData.body_fat_percentage}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, "")
                        setFormData({ ...formData, body_fat_percentage: val })
                        if (fieldErrors.body_fat_percentage) setFieldErrors({ ...fieldErrors, body_fat_percentage: "" })
                      }}
                      placeholder="18"
                      className={`w-full px-3 py-2.5 bg-input border rounded-lg text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${fieldErrors.body_fat_percentage ? "border-red-500" : "border-border"}`}
                    />
                    {fieldErrors.body_fat_percentage && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.body_fat_percentage}</p>
                    )}
                  </div>
                </div>

                {/* Experience + Goal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Experience</label>
                    <select
                      value={formData.experience_level}
                      onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                      className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-base sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                    >
                      {experienceLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Goal</label>
                    <select
                      value={formData.goal}
                      onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                      className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-base sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                    >
                      {goalOptions.map((goal) => (
                        <option key={goal} value={goal}>
                          {goal}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Are you a trainer? */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Star size={18} className={formData.is_trainer ? "text-amber-500" : "text-muted-foreground"} />
                    <div>
                      <p className="text-sm font-medium text-foreground">Are you a certified trainer?</p>
                      <p className="text-xs text-muted-foreground">Become a verified Fitacle Community Trainer</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newValue = !formData.is_trainer
                      setFormData({ ...formData, is_trainer: newValue })
                      if (newValue) setShowTrainerNote(true)
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${formData.is_trainer ? "bg-amber-500" : "bg-muted"}`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.is_trainer ? "left-7" : "left-1"}`}
                    />
                  </button>
                </div>

                {/* Trainer Verification Note Popup */}
                <AnimatePresence>
                  {showTrainerNote && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground mb-1">Trainer Verification</p>
                          <p className="text-xs text-muted-foreground">
                            We may ask for certification details to verify your trainer profile.
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowTrainerNote(false)}
                            className="mt-2 text-xs text-amber-600 hover:text-amber-500 font-medium"
                          >
                            I understand
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Visibility Toggle */}
                <div className="flex items-center justify-between p-4 bg-accent rounded-xl">
                  <div className="flex items-center gap-3">
                    {formData.is_visible ? (
                      <Eye size={18} className="text-emerald-500" />
                    ) : (
                      <EyeOff size={18} className="text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">Profile Visibility</p>
                      <p className="text-xs text-muted-foreground">
                        {formData.is_visible
                          ? "Visible to the Fitacle Community"
                          : "Your profile is hidden"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_visible: !formData.is_visible })}
                    className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${formData.is_visible ? "bg-emerald-500" : "bg-muted"}`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.is_visible ? "left-7" : "left-1"}`}
                    />
                  </button>
                </div>

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: submitting ? 1 : 1.01 }}
                  whileTap={{ scale: submitting ? 1 : 0.99 }}
                  className="w-full py-3 bg-foreground text-background rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      {hasProfile ? "Update Profile" : "Create Profile"}
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
